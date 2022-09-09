import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { GenreModel } from "../model/genre.model";

@Injectable({
    providedIn: 'root',
})
export class GenreService {
    constructor(private httpClient: HttpClient) {

    }

    public getGenres(): Observable<GenreModel[]> {
        return this.httpClient.get<GenreModel[]>(`http://localhost:3000/genres`).pipe(
            map((data: GenreModel[]) => {
                const books: GenreModel[] = [];
                data.forEach((item: GenreModel) => {
                    books.push(new GenreModel(item.id, item.name))
                });
                return books;
            })
        )
    }


}