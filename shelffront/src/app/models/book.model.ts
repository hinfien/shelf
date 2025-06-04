export class Book {
    constructor(
        public color: string,
        // gray, red, green, blue
        public bookLink: string,
        public status: string,
        // none, creation, loading, uploaded
    ) { }
}