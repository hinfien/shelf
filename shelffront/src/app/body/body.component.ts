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
  activeColor: string = 'gray';

  constructor() {
    for (let i = 0; i < 30; i++) {
      this.books.push(new Book("gray", "none", "none"));
    }
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
    book.color = color;
    console.log(book.color)
  }

  fileUpload(book: Book) {
    this.isFileChosen = true;
    console.log('file upload');
  }

  onFileUpload(event: Event, book: Book) {
    console.log('onfileupload called', event);
  }

  confirmCreation(book: Book) {
    this.isCreationProcess = false;
    this.isFileChosen = false;
    book.status = 'loading';
  }
}
