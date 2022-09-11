import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {map, Observable, of, Subject, takeUntil, zip} from 'rxjs';
import {DeletePopupComponent} from '../shared/delete-popup/delete-popup.component';
import {BooksPopupComponent} from './books-popup/books-popup.component';
import {BookModel} from './model/book.model';
import {CrudService} from "../services/crud.service";
import {AUTHORS_URL, BOOKS_URL, GENRES_URL} from "../util/url";
import {DataCommunicationModel, DataCommunicationService} from "../services/data-communication.service";
import {GenreModel} from "../genres-table/model/genre.model";
import {AuthorModel} from "../authors-table/model/author.model";
import {ColumnModel} from "../shared/table/table.component";

@Component({
    selector: 'app-books-table',
    templateUrl: './books-table.component.html',
    styleUrls: ['./books-table.component.css']
})
export class BooksTableComponent implements OnInit {

    private destroy$ = new Subject();
    public displayedColumns: string[] = ['id', 'title', 'actions'];
    public columns: ColumnModel[] = [];
    public list: BookModel [] = [];

    constructor(
        private crudService: CrudService,
        private dataCommunicationService: DataCommunicationService,
        public dialog: MatDialog) {
        this.columns = this.displayedColumns.map((item, index) => {
            return {id: index, systemName: item, title: item.toUpperCase()} as ColumnModel;
        });
        this.getLists()
            .subscribe(data => {
                this.list = data;
            });
    }

    private getLists(): Observable<BookModel[]> {
        return zip(this.crudService.getList(BOOKS_URL),
            this.crudService.getList(GENRES_URL),
            this.crudService.getList(AUTHORS_URL))
            .pipe(
                map(([books, genres, authors]: [any, any, any]) => {
                    const models: BookModel[] = [];
                    books.forEach((item: BookModel) => {
                        item.genreId = genres.find((genre: GenreModel) => genre.id === item.genreId);
                        item.authorId = authors.find((author: AuthorModel) => author.id === item.authorId);
                        models.push(new BookModel(item.id, item.title, item.genreId, item.publishedYear, item.authorId))
                    });
                    return models;
                }),
                takeUntil(this.destroy$)
            );
    }

    ngOnInit(): void {
    }

    public addBook() {
        const dialogRef = this.dialog.open(BooksPopupComponent, {
            data: {
                isNew: true,
                list: this.list,
                title: 'Add Book'
            },
            disableClose: true,
            autoFocus: false,
            width: '400px',
            height: 'auto'
        });
    }

    public editBook([event, model]: [MouseEvent, BookModel]) {
        const dialogRef = this.dialog.open(BooksPopupComponent, {
            data: {
                model,
                list: this.list,
                title: 'Edit Book'
            },
            disableClose: true,
            autoFocus: false,
            width: '400px',
            height: 'auto'
        });
    }

    public deleteBook(book: BookModel) {
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            data: {
                item: book
            }
        });
        dialogRef.afterClosed().subscribe(status => {
            if (status) {
                this.removeAction(book).subscribe({
                    next: () => {
                        this.dataCommunicationService.notify({isDeleted: true} as DataCommunicationModel)
                    }
                });
            }
        });
    }

    private removeAction(book: BookModel): Observable<boolean> {
        const data = this.list;
        const index = data.indexOf(book);
        if (index > -1) {
            this.list.splice(index, 1);
            return this.crudService.removeItem(BOOKS_URL, book).pipe(
                map(() => true)
            );
        }
        return of(false);
    }

    public ngOnDestroy(): void {
        this.destroy$.next(0);
        this.destroy$.complete();
    }

}
