import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Subject, takeUntil} from 'rxjs';
import {DeletePopupComponent, DeletePopupI} from '../shared/delete-popup/delete-popup.component';
import {BookPopupComponent} from './book-popup/book-popup.component';
import {BookModel} from './model/book.model';
import {BOOKS_URL} from "../util/url";
import {ColumnModel, popupGeneralConfig, PopupInfo, RelatedDataI, removeItemFromList} from "../shared/util/table.util";
import {TypeEnum} from "../shared/enum/type.enum";
import {DataService} from "../services/data.service";
import {EntityModel} from "../model/entity.model";
import {BROADCAST_SERVICE} from "../../app.token";
import {BroadcastService} from "../services/broadcast.service";
import {ActionEnum} from "../util/action.enum";

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
        private dataService: DataService,
        @Inject(BROADCAST_SERVICE) private broadCastService: BroadcastService) {
    }

    ngOnInit(): void {
        this.listenDeleteAction();
        this.dataService.getList(BOOKS_URL).pipe(
            takeUntil(this.destroy$)
        ).subscribe({
            next: (books: EntityModel[]) => {
                this.list = books as BookModel[];
            }
        });
    }

    private listenDeleteAction(): void {
        this.broadCastService.messagesOfType(ActionEnum.DELETE)
            .pipe(takeUntil(this.destroy$))
            .subscribe((message) => {
                removeItemFromList(this.list, message.payload);
                this.list = this.list.slice();
            });
    }

    public add(): void {
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

    public edit([event, model]: [MouseEvent, EntityModel]): void {
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

    public delete(model: EntityModel): void {
        const popupInfo = {
            title: 'Removing an Item',
            message: ' Are you sure you want to remove the selected Item(s) ?'
        } as DeletePopupI;
        const config = popupGeneralConfig(popupInfo);
        config.data.yesAction = this.onYesDeleteAction;
        config.data.yesArgs = [this, BOOKS_URL, model, popupInfo];
        this.dialog.open(DeletePopupComponent, config);
    }

    private onYesDeleteAction(context: any, url: string, model: BookModel, isWithRelatedData: boolean = false,
                              relatedData: RelatedDataI): void {
        removeItemFromList(context.list, model);
        context.list = context.list.slice();
        context.broadCastService.publish({
            type: ActionEnum.DELETE,
            payload: model
        });
        context.dataService.deleteItem(url, model, isWithRelatedData, relatedData)
            .subscribe()
    }

    public ngOnDestroy(): void {
        this.destroy$.next(0);
        this.destroy$.complete();
    }

}
