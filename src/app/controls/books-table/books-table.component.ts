import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Subject, takeUntil} from 'rxjs';
import {DeletePopupI} from '../shared/delete-popup/delete-popup.component';
import {BookPopupComponent} from './book-popup/book-popup.component';
import {BookModel} from './model/book.model';
import {CrudService} from "../services/crud.service";
import {BOOKS_URL, GENRES_URL} from "../util/url";
import {DataCommunicationService} from "../services/data-communication.service";
import {ColumnModel, PopupInfo} from "../shared/util/table.util";
import {TypeEnum} from "../shared/enum/type.enum";
import {TableService} from "../shared/table/service/table.service";

@Component({
    selector: 'app-books-table',
    templateUrl: './books-table.component.html',
    styleUrls: ['./books-table.component.css']
})
export class BooksTableComponent implements OnInit {

    private destroy$ = new Subject();
    public columns: ColumnModel[] = [
        new ColumnModel('id', TypeEnum.NUMBER, 'ID'),
        new ColumnModel('title', TypeEnum.STRING, 'Title'),
        new ColumnModel('description', TypeEnum.STRING, 'Description'),
        new ColumnModel('actions', TypeEnum.ACTIONS, 'Actions'),
    ];
    public displayedColumns: string[] = ['id', 'title', 'description', 'actions'];
    public list: BookModel [] = [];

    constructor(
        public dialog: MatDialog,
        public tableService: TableService) {
    }

    ngOnInit(): void {
        this.tableService.getList(BOOKS_URL).pipe(
            takeUntil(this.destroy$)
        ).subscribe({
            next: (books: any[]) => {
                this.list = books;
            }
        });
    }

    public add() {
        this.dialog.open(BookPopupComponent, {
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

    public edit([event, model]: [MouseEvent, BookModel]) {
        this.dialog.open(BookPopupComponent, {
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

    public delete(model: BookModel) {
        const popupInfo = {
            title: 'Removing an Item',
            message: ' Are you sure you want to remove the selected Item(s) ?'
        } as DeletePopupI;
        this.tableService.deleteItem(BOOKS_URL, model, this.list, popupInfo);
    }

    public ngOnDestroy(): void {
        this.destroy$.next(0);
        this.destroy$.complete();
    }

}
