import {Injectable} from "@angular/core";
import {map, mergeMap, Observable, of, switchMap, zip} from "rxjs";
import {BookModel} from "../books-table/model/book.model";
import {GenreModel} from "../genres-table/model/genre.model";
import {AuthorModel} from "../authors-table/model/author.model";
import {AUTHORS_URL, BOOKS_URL, GENRES_URL} from "../util/url";
import {CrudService} from "./crud.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {DeletePopupComponent, DeletePopupI} from "../shared/delete-popup/delete-popup.component";
import {RelatedDataI} from "../shared/util/table.util";
import {DataCommunicationModel, DataCommunicationService} from "./data-communication.service";

@Injectable({
    providedIn: 'root'
})
export class DataService {
    constructor(private crudService: CrudService,
                public dialog: MatDialog,
                private dataCommunicationService: DataCommunicationService,) {
    }

    public getList(url: string): Observable<BookModel[] | GenreModel[] | AuthorModel[]> {
        let list: Observable<BookModel[] | GenreModel[] | AuthorModel[]> = of([]);
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

    private getBooks(url: string): Observable<BookModel[]> {
        return this.crudService.getList(url)
            .pipe(
                map((books: any) => {
                    const models: BookModel[] = [];
                    books.forEach((item: BookModel) => {
                        models.push(new BookModel(item.id, item.title, item.description,
                            item.genreId, item.publishedYear, item.authorId))
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

    public deleteItem(url: string, model: any, list: any[],
                      popupInfo: DeletePopupI, isWithRelatedData: boolean = false,
                      relatedDataModel?: RelatedDataI) {
        const config = this.getDeletePopupGeneralConfig(popupInfo);
        config.data.yesAction = this.onYesAction;
        config.data.yesArgs = [url, model, list, isWithRelatedData, relatedDataModel];
        this.dialog.open(DeletePopupComponent, config);
    }

    private getDeletePopupGeneralConfig(data: DeletePopupI): MatDialogConfig {
        return {
            disableClose: true,
            autoFocus: false,
            width: '400px',
            height: 'auto',
            data: {
                context: this,
                title: data.title,
                message: data.message
            }
        };
    }

    private onYesAction(url: string, model: any, list: any[],
                        isWithRelatedData: boolean = false,
                        relatedData?: RelatedDataI) {
        this.removeAction(url, model, list).pipe(
            switchMap((_) => {
                if (isWithRelatedData && relatedData) {
                    return this.removeRelatedData(relatedData);
                }
                return of(true);
            })
        ).subscribe({
            next: () => {
                this.dataCommunicationService.notify({isDeleted: true} as DataCommunicationModel)
            }
        })
    }

    private removeAction(url: string, model: any, list: any[]): Observable<boolean> {
        const index = list.indexOf(model);
        if (index > -1) {
            list.splice(index, 1);
            return this.crudService.removeItem(url, model).pipe(
                map(() => true)
            );
        }
        return of(false);
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

}
