import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, max, Observable } from "rxjs";
import { BookModel } from "../model/book.model";

@Injectable({
    providedIn: 'root',
})
export class BookService {
    constructor(private httpClient: HttpClient) {

    }

    public getLastId(): Observable<number> {
        return this.getBooks().pipe(
            map((books: BookModel[]) => {
                const ids: number[] = books.map(item => item.id);
                return Math.max(...ids);
            })
        )
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

    public saveBook(book: BookModel): Observable<Object> {
        const headers = { 'content-type': 'application/json' };
        return this.httpClient.post(`http://localhost:3000/books`, JSON.stringify(book), {
            headers: headers
        });
    }
}


