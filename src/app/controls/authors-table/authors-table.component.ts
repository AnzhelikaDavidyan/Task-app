import {Component, Inject, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {AuthorModel} from "./model/author.model";
import {ColumnModel, popupGeneralConfig, PopupInfo, RelatedDataI, removeItemFromList} from "../shared/util/table.util";
import {MatDialog} from "@angular/material/dialog";
import {AUTHORS_URL, BOOKS_URL, GENRES_URL} from "../util/url";
import {DeletePopupComponent, DeletePopupI} from "../shared/delete-popup/delete-popup.component";
import {AuthorPopupComponent} from "./author-popup/author-popup.component";
import {TypeEnum} from "../shared/enum/type.enum";
import {DataService} from "../services/data.service";
import {EntityModel} from "../model/entity.model";
import {BROADCAST_SERVICE} from "../../app.token";
import {BroadcastService} from "../services/broadcast.service";
import {ActionEnum} from "../util/action.enum";

@Component({
    selector: 'app-authors-table',
    templateUrl: './authors-table.component.html',
    styleUrls: ['./authors-table.component.css']
})
export class AuthorsTableComponent implements OnInit {

    private destroy$ = new Subject();
    public displayedColumns: string[] = ['id', 'firstName', 'lastName', 'genreId', 'actions'];
    public columns: ColumnModel[] = [
        new ColumnModel('id', TypeEnum.NUMBER, 'ID'),
        new ColumnModel('firstName', TypeEnum.STRING, 'First Name'),
        new ColumnModel('lastName', TypeEnum.STRING, 'Last Name'),
        new ColumnModel('genreId', TypeEnum.CLASSIFIER, 'Genre', GENRES_URL),
        new ColumnModel('actions', TypeEnum.ACTIONS, 'Actions'),
    ];
    public list: AuthorModel [] = [];

    constructor(public dialog: MatDialog,
                private dataService: DataService,
                @Inject(BROADCAST_SERVICE) private broadCastService: BroadcastService) {
    }

    public ngOnInit(): void {
        this.listenDeleteAction();
        this.dataService.getList(AUTHORS_URL).pipe(
            takeUntil(this.destroy$)
        ).subscribe({
            next: (authors: EntityModel[]) => {
                this.list = authors as AuthorModel[];
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
        this.dialog.open(AuthorPopupComponent, {
            data: {
                isNew: true,
                list: this.list,
                title: 'Add Author',
                saveAction: this.onSave,
                saveArgs: []
            },
            disableClose: true,
            autoFocus: false,
            width: '400px',
            height: 'auto'
        });
    }

    private onSave() {

    }

    public delete(model: EntityModel): void {
        const popupInfo = {
            title: 'Removing an Item',
            message: ' Are you sure you want to remove the selected Item(s) and Related Data?'
        } as DeletePopupI;
        const relatedDataModel = {
            filter: `authorId=${model.id}`,
            urls: [BOOKS_URL]
        } as RelatedDataI;
        const config = popupGeneralConfig(popupInfo);
        config.data.yesAction = this.onYesDeleteAction;
        config.data.yesArgs = [this, AUTHORS_URL, model, popupInfo, relatedDataModel];
        this.dialog.open(DeletePopupComponent, config);
    }

    private onYesDeleteAction(context: any, url: string, model: AuthorModel, isWithRelatedData: boolean, relatedData: RelatedDataI): void {
        removeItemFromList(context.list, model);
        context.list = context.list.slice();
        context.broadCastService.publish({
            type: ActionEnum.DELETE,
            payload: model
        });
        context.dataService.deleteItem(url, model, isWithRelatedData, relatedData)
            .subscribe()
    }

    public edit([event, model]: [MouseEvent, EntityModel]): void {
        this.dialog.open(AuthorPopupComponent, {
            data: {
                model,
                list: this.list,
                title: 'Edit Author',
            } as PopupInfo,
            disableClose: true,
            autoFocus: false,
            width: '400px',
            height: 'auto'
        });
    }

}
