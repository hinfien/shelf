import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Book } from '../models/book.model';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})

export class BodyComponent {
  books: Book[] = [];
  isAuthenticated: boolean = true;
  isColorPickerOpened: boolean = false;
  hoveredBookId: string | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor() {
    this.loadLocal();

    if (this.books.length === 0) {
      for (let i = 0; i < 30; i++) {
        this.books.push(new Book("gray", "none", i.toString(), null, null, null));
      }
      this.saveLocal();
    }
  }

  mouseEnter(bookId: string) {
    this.hoveredBookId = bookId;
  }

  mouseLeave() {
    this.hoveredBookId = null;
  }

  @HostListener('window:keydown', ['$event'])
  onBackspace(event: KeyboardEvent) {
    if (event.key === 'Backspace' && this.hoveredBookId) {
      let bookToDelete = this.books.find(b => b.id === this.hoveredBookId);

      if (bookToDelete && bookToDelete.status !== 'none') {
        this.resetBook(bookToDelete);
      }

      this.hoveredBookId = null;
    }
  }

  saveLocal() {
    const booksToStore = this.books.map(book => {
      return {
        id: book.id,
        color: book.color,
        status: book.status,
        fileName: book.fileName,
        fileUrl: book.fileUrl,
      };
    });
    localStorage.setItem("skibidi", JSON.stringify(booksToStore));
  }

  loadLocal() {
    const localBooks = localStorage.getItem("skibidi");

    if (localBooks) {
      const storedBookDataArray = JSON.parse(localBooks);
      this.books = storedBookDataArray.map((data: any) => new Book(
        data.color,
        data.status,
        data.id,
        null,
        data.fileName,
        data.fileUrl,
      ));
    } else {
      this.books = [];
    }
  }

  resetBook(book: Book) {
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
    this.saveLocal();
  }

  onNothingClick(book: Book) {
    this.books.forEach(book => {
      if (book.status === 'creation') {
        this.resetBook(book);
      }
    });

    book.status = 'creation';
    book.color = 'gray';
    book.selectedFile = null;
    book.fileName = null;
    if (book.fileUrl) {
      URL.revokeObjectURL(book.fileUrl);
      book.fileUrl = null;
    }
    this.isColorPickerOpened = false;

    this.saveLocal();
  }

  cancelCreationPopup(book: Book) {
    this.resetBook(book);
  }

  onColorClick() {
    this.isColorPickerOpened = !this.isColorPickerOpened;
  }

  changeColor(book: Book, color: string) {
    book.color = color;
    this.saveLocal();
  }

  onFileSelected(event: Event, book: Book) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      book.selectedFile = file;
      book.fileName = file.name;

      if (book.fileUrl) {
        URL.revokeObjectURL(book.fileUrl);
      }
      book.fileUrl = URL.createObjectURL(file);
    }

    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
    this.saveLocal();
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
