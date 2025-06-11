export class Book {
    constructor(
        public color: string,
        // gray, red, green, blue
        public status: string,
        // none, creation, uploaded
        public id: string,
        public selectedFile: File | null,
        public fileName: string | null,
        public fileUrl: string | null
    ) { }
}