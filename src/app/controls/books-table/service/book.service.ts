import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { BookModel } from "../model/book.model";

@Injectable({
    providedIn: 'root',
})
export class BookService {
    constructor(private httpClient: HttpClient) {

    }

    public getBooks(): Observable<BookModel[]> {
        return this.httpClient.get<BookModel[]>(`http://localhost:3000/books`).pipe(
            map((data: BookModel[]) => {
                const books: BookModel[] = [];
                data.forEach((item: BookModel) => {
                    books.push(new BookModel(item.id, item.title, item.genreId,
                        item.publishedYear, item.authorId))
                });
                return books;
            })
        )
    }


    public removeBook(book: BookModel): Observable<Object> {
        return this.httpClient.delete(`http://localhost:3000/books/${book.id}`)
    }
}