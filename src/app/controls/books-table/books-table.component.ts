import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {map, Observable, of, Subject, takeUntil} from 'rxjs';
import {DeletePopupComponent} from '../shared/delete-popup/delete-popup.component';
import {BooksPopupComponent} from './books-popup/books-popup.component';
import {BookModel} from './model/book.model';
import {CrudService} from "../services/crud.service";
import {URLS} from "../util/url";
import {MenuItem} from "../util/menu.enum";

@Component({
    selector: 'app-books-table',
    templateUrl: './books-table.component.html',
    styleUrls: ['./books-table.component.css']
})
export class BooksTableComponent implements OnInit {

    private destroy$ = new Subject();

    public dataSource: MatTableDataSource<BookModel> = new MatTableDataSource();
    public displayedColumns: string[] = ['id', 'title', 'actions'];
    public isReady: boolean = false;

    @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
    @ViewChild(MatSort) sort: MatSort | undefined;

    @ViewChild(MatTable)
    table!: MatTable<any>;

    constructor(
        private crudService: CrudService,
        public dialog: MatDialog) {

        this.crudService.getList(URLS.get(MenuItem.BOOKS) as string)
            .pipe(
                map((list: any[]) => {
                    const books: BookModel[] = [];
                    list.forEach((item) => {
                        books.push(new BookModel(item.id, item.title, item.genreId, item.publishYear, item.authorId))
                    });
                    return books;
                }),
                takeUntil(this.destroy$)
            )
            .subscribe(data => {
                this.isReady = true;
                this.dataSource = new MatTableDataSource(data);
            });
    }

    ngOnInit(): void {

    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    public addBook() {
        const dialogRef = this.dialog.open(BooksPopupComponent);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.table.renderRows();
            }
        });
    }

    public editBook(event: MouseEvent, model: BookModel) {
        const dialogRef = this.dialog.open(BooksPopupComponent, {
            data: {
                model,
                list: this.dataSource.data,
                table: this.table
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.table.renderRows();
            }
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
                        this.table.renderRows();
                    }
                });
            }
        });
    }

    private removeAction(book: BookModel): Observable<boolean> {
        const data = this.dataSource.data;
        const index = data.indexOf(book);
        if (index > -1) {
            this.dataSource.data.splice(index, 1);
            return this.crudService.removeItem(URLS.get(MenuItem.BOOKS) as string, book).pipe(
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
