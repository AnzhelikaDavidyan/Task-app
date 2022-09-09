import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { AuthorModel } from "../model/author.model";

@Injectable({
    providedIn: 'root',
})
export class AuthorService {
    constructor(private httpClient: HttpClient) {

    }

    public getAuthors(): Observable<AuthorModel[]> {
        return this.httpClient.get<AuthorModel[]>(`http://localhost:3000/authors`).pipe(
            map((data: AuthorModel[]) => {
                const books: AuthorModel[] = [];
                data.forEach((item: AuthorModel) => {
                    books.push(new AuthorModel(item.id, item.firstName, item.lastName, item.genreId))
                });
                return books;
            })
        );
    }

    public getAuthorByGenreId(genreId: number) {
        return this.httpClient.get<AuthorModel[]>(`http://localhost:3000/authors?genreId=${genreId}`).pipe(
            map((data: AuthorModel[]) => {
                const authors: AuthorModel[] = [];
                data.forEach((item: AuthorModel) => {
                    authors.push(new AuthorModel(item.id, item.firstName, item.lastName, item.genreId))
                });
                return authors;
            })
        )
    }


}