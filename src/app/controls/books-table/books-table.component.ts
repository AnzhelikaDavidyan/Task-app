import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {map, Observable, of, Subject, takeUntil} from 'rxjs';
import {DeletePopupComponent} from '../shared/delete-popup/delete-popup.component';
import {BooksPopupComponent} from './books-popup/books-popup.component';
import {BookModel} from './model/book.model';
import {CrudService} from "../services/crud.service";
import {BOOKS_URL} from "../util/url";
import {DataCommunicationModel, DataCommunicationService} from "../services/data-communication.service";
import {ColumnModel} from "../shared/table/table.component";
import {createColumnModels, PopupInfo} from "../shared/util/table.util";

@Component({
    selector: 'app-books-table',
    templateUrl: './books-table.component.html',
    styleUrls: ['./books-table.component.css']
})
export class BooksTableComponent implements OnInit {

    private destroy$ = new Subject();
    public displayedColumns: string[] = ['id', 'title', 'description', 'actions'];
    public columns: ColumnModel[] = [];
    public list: BookModel [] = [];

    constructor(
        private crudService: CrudService,
        private dataCommunicationService: DataCommunicationService,
        public dialog: MatDialog) {
        this.columns = createColumnModels(this.displayedColumns);
        this.getBooks()
            .subscribe(books => {
                this.list = books;
            });
    }

    private getBooks(): Observable<BookModel[]> {
        return this.crudService.getList(BOOKS_URL)
            .pipe(
                map((books: any) => {
                    const models: BookModel[] = [];
                    books.forEach((item: BookModel) => {
                        models.push(new BookModel(item.id, item.title, item.description,
                            item.genreId, item.publishedYear, item.authorId))
                    });
                    return models;
                }),
                takeUntil(this.destroy$)
            );
    }

    ngOnInit(): void {
    }

    public addBook() {
        this.dialog.open(BooksPopupComponent, {
            data: {
                isNew: true,
                list: this.list,
                title: 'Add Book'
            } as PopupInfo,
            disableClose: true,
            autoFocus: false,
            width: '400px',
            height: 'auto'
        });
    }

    public editBook([event, model]: [MouseEvent, BookModel]) {
        this.dialog.open(BooksPopupComponent, {
            data: {
                title: 'Edit Book',
                list: this.list,
                model,
            } as PopupInfo,
            disableClose: true,
            autoFocus: false,
            width: '400px',
            height: 'auto'
        });
    }

    public deleteBook(book: BookModel) {
        const dialogRef = this.dialog.open(DeletePopupComponent);
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
