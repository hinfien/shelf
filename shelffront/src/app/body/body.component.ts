import { Component } from '@angular/core';
import { Book } from '../models/book.model';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})

export class BodyComponent {
  books: Book[] = [];
  isAuthenticated: boolean = true;
  isCreationProcess: boolean = false;
  isColorPickerOpened: boolean = false;
  isFileChosen: boolean = false;

  constructor() {
    for (let i = 0; i < 30; i++) {
      this.books.push(new Book("gray", "none", "none"));
    }
    console.log(this.books)
  }

  onNothingClick(book: Book) {
    if (this.isAuthenticated && !this.isCreationProcess) {
      this.isCreationProcess = true;
      book.status = 'creation';
    }
  }

  cancelCreationPopup(book: Book) {
    this.isCreationProcess = false;
    this.isFileChosen = false;
    book.status = 'none';
  }

  onColorClick() {
    this.isColorPickerOpened = !this.isColorPickerOpened;
  }

  changeColor(book: Book, color: string) {
    console.log('book', book, 'color', color);
    book.color = color;
  }

  fileUpload(book: Book) {
    console.log('file upload');
  }

  onFileUpload(event: Event, book: Book) {
    console.log('onfileupload called', event);
  }

  confirmCreation(book: Book) {

    book.status = 'loading';
  }
}
