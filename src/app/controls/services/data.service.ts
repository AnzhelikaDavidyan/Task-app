import {Injectable} from "@angular/core";
import {map, mergeMap, Observable, of, switchMap, zip} from "rxjs";
import {BookModel} from "../books-table/model/book.model";
import {GenreModel} from "../genres-table/model/genre.model";
import {AuthorModel} from "../authors-table/model/author.model";
import {AUTHORS_URL, BOOKS_URL, GENRES_URL} from "../util/url";
import {CrudService} from "./crud.service";
import {RelatedDataI} from "../shared/util/table.util";
import {EntityModel} from "../model/entity.model";

@Injectable({
    providedIn: 'root'
})
export class DataService {
    constructor(private crudService: CrudService) {
    }

    public getList(url: string): Observable<EntityModel[]> {
        let list: Observable<EntityModel[]> = of([]);
        switch (url) {
            case BOOKS_URL:
                list = this.getBooks(url) as Observable<BookModel[]>;
                break;
            case GENRES_URL:
                list = this.getGenres(url) as Observable<GenreModel[]>;
                break;
            case AUTHORS_URL:
                list = this.getAuthors(url) as Observable<AuthorModel[]>;
                break;
        }
        return list;
    }

    private getBooks<Type>(url: string): Observable<BookModel[]> {
        return this.crudService.getList(url)
            .pipe(
                map((books: any) => {
                    const models: BookModel[] = [];
                    books.forEach((item: BookModel) => {
                        models.push(new BookModel(item.id, item.title, item.description,
                            item.genreId, item.publishedYear, item.authorId));
                    });
                    return models;
                })
            );
    }

    private getAuthors(url: string): Observable<AuthorModel[]> {
        return this.crudService.getList(url)
            .pipe(
                map((list: any[]) => {
                    const genres: AuthorModel[] = [];
                    list.forEach((item) => {
                        genres.push(new AuthorModel(item.id, item.firstName, item.lastName, item.genreId))
                    });
                    return genres;
                })
            );
    }

    private getGenres(url: string): Observable<GenreModel[]> {
        return this.crudService.getList(url)
            .pipe(
                map((list: any[]) => {
                    const genres: GenreModel[] = [];
                    list.forEach((item) => {
                        genres.push(new GenreModel(item.id, item.name))
                    });
                    return genres;
                })
            );
    }

    public deleteItem(url: string, model: EntityModel,
                      isWithRelatedData: boolean = false,
                      relatedData?: RelatedDataI): Observable<EntityModel> {
        return this.crudService.removeItem(url, model).pipe(
            switchMap((_) => {
                if (isWithRelatedData && relatedData) {
                    return this.removeRelatedData(relatedData);
                }
                return of(true);
            }),
            map(_ => model)
        );
    }

    private removeRelatedData(relatedData: RelatedDataI): Observable<boolean> {
        const list: Observable<Object>[] = [];
        relatedData.urls.forEach(url => {
            list.push(this.getDeletedItems(relatedData.filter, url));
        });
        return zip(...list).pipe(
            map(_ => true)
        );
    }

    private getDeletedItems(filter: string, url: string): Observable<Object | []> {
        return this.crudService.getItemsByFilter(url, filter).pipe(
            map((data) => data.map(item => item.id)),
            mergeMap((ids: number[]) => ids.length ? this.crudService.bulkDelete(url, ids) :
                of([]))
        );
    }

    public createItem(url: string, model: EntityModel): Observable<Object> {
        return this.crudService.getLastId(url).pipe(
            switchMap((id: number) => {
                model.id = ++id;
                return this.crudService.saveItem(url, model).pipe(
                    map(data => data)
                );
            })
        );
    }

    public editItem(url: string, model: any): Observable<any> {
        return this.crudService.editItem(url, model);
    }
}
