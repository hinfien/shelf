import { Component, ViewChild, ElementRef, HostListener, OnInit } from '@angular/core';
import { Book } from '../models/book.model';
import * as localforage from 'localforage';


@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})

export class BodyComponent implements OnInit {
  books: Book[] = [];
  isAuthenticated: boolean = true;
  isColorPickerOpened: boolean = false;
  hoveredBookId: string | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor() { }

  async ngOnInit(): Promise<void> {
    await this.loadLocal();

    if (this.books.length === 0) {
      for (let i = 0; i < 30; i++) {
        this.books.push(new Book("gray", "none", i.toString(), null, null, null));
      }
      await this.saveLocal();
    }
  }

  mouseEnter(bookId: string) {
    this.hoveredBookId = bookId;
  }

  mouseLeave() {
    this.hoveredBookId = null;
  }

  @HostListener('window:keydown', ['$event'])
  async onBackspace(event: KeyboardEvent): Promise<void> {
    if (event.key === 'Backspace' && this.hoveredBookId) {
      let toDelete = this.books.find(b => b.id === this.hoveredBookId);

      if (toDelete && toDelete.status !== 'none') {
        await this.resetBook(toDelete);
      }

      this.hoveredBookId = null;
    }
  }

  async saveLocal(): Promise<void> {
    let booksToStore = this.books.map(book => {
      return {
        id: book.id,
        color: book.color,
        status: book.status,
        fileName: book.fileName,
      };
    });

    await localforage.setItem('brrpatapim', booksToStore);
  }

  async loadLocal() {
    const localBooks = await localforage.getItem<any[]>('brrpatapim');

    if (localBooks) {
      this.books = await Promise.all(localBooks.map(async (data: any) => {
        const book = new Book(
          data.color,
          data.status,
          data.id,
          null,
          data.fileName,
          null,
        );

        let file = await localforage.getItem<File>(book.id);
        if (file) {
          book.selectedFile = file;
          book.fileUrl = URL.createObjectURL(file);
        }

        return book;
      }));
    } else {
      this.books = [];
    }
  }

  async resetBook(book: Book): Promise<void> {
    if (book.fileUrl) {
      URL.revokeObjectURL(book.fileUrl);
    }

    book.status = 'none';
    book.color = 'gray';
    book.selectedFile = null;
    book.fileName = null;
    book.fileUrl = null;

    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }

    await localforage.removeItem(book.id);

    await this.saveLocal();
  }

  async onNothingClick(book: Book): Promise<void> {
    for (let b of this.books) {
      if (b.status === 'creation') {
        await this.resetBook(b);
      }
    }


    book.status = 'creation';
    book.color = 'gray';
    book.selectedFile = null;
    book.fileName = null;
    this.isColorPickerOpened = false;

    if (book.fileUrl) {
      URL.revokeObjectURL(book.fileUrl);
    }

    await localforage.removeItem(book.id);

    this.saveLocal();
  }

  async cancelCreationPopup(book: Book) {
    await this.resetBook(book);
  }

  onColorClick() {
    this.isColorPickerOpened = !this.isColorPickerOpened;
  }

  async changeColor(book: Book, color: string) {
    book.color = color;
    await this.saveLocal();
  }

  async onFileSelected(event: Event, book: Book): Promise<void> {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      book.selectedFile = file;
      book.fileName = file.name;

      if (book.fileUrl) {
        URL.revokeObjectURL(book.fileUrl);
      }

      book.fileUrl = URL.createObjectURL(file);

      await localforage.setItem(book.id, book.selectedFile);
    }

    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }

    await this.saveLocal();
  }

  confirmCreation(book: Book) {
    if (book.selectedFile) {
      book.status = 'uploaded';
      this.saveLocal();
    }
  }

  openBookLink(book: Book) {
    if (book.fileUrl) {
      window.open(book.fileUrl, '_blank');
    }
  }
}
