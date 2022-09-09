export class AuthorModel {
    constructor(public id: number, public firstName: string, public lastName: string,
        public genreId: number) {

    }


    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }
}