import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {MatTable} from "@angular/material/table";
import {GenreModel} from "./model/genre.model";
import {MatDialog} from "@angular/material/dialog";
import {AUTHORS_URL, BOOKS_URL, GENRES_URL} from "../util/url";
import {ColumnModel, popupGeneralConfig, PopupInfo, RelatedDataI, removeItemFromList} from "../shared/util/table.util";
import {DeletePopupComponent, DeletePopupI} from "../shared/delete-popup/delete-popup.component";
import {GenrePopupComponent} from "./genre-popup/genre-popup.component";
import {TypeEnum} from "../shared/enum/type.enum";
import {DataService} from "../services/data.service";
import {EntityModel} from "../model/entity.model";
import {ActionEnum} from "../util/action.enum";
import {BROADCAST_SERVICE} from "../../app.token";
import {BroadcastService} from "../services/broadcast.service";

@Component({
    selector: 'app-genres-table',
    templateUrl: './genres-table.component.html',
    styleUrls: ['./genres-table.component.css']
})
export class GenresTableComponent implements OnInit {

    private destroy$ = new Subject();
    public displayedColumns: string[] = ['id', 'name', 'actions'];
    public columns: ColumnModel[] = [
        new ColumnModel('id', TypeEnum.NUMBER, 'ID'),
        new ColumnModel('name', TypeEnum.STRING, 'Name'),
        new ColumnModel('actions', TypeEnum.ACTIONS, 'Actions'),];
    public list: GenreModel [] = [];

    @ViewChild(MatTable) table!: MatTable<any>;

    constructor(public dialog: MatDialog,
                private dataService: DataService,
                @Inject(BROADCAST_SERVICE) private broadCastService: BroadcastService) {
    }

    public ngOnInit(): void {
        this.listenDeleteAction();
        this.dataService.getList(GENRES_URL).pipe(
            takeUntil(this.destroy$)
        ).subscribe({
            next: (genres: EntityModel[]) => {
                this.list = genres as GenreModel[];
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
        this.dialog.open(GenrePopupComponent, {
            data: {
                isNew: true,
                list: this.list,
                title: 'Add Genre'
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
            message: ' Are you sure you want to remove the selected Item(s) and Related Data?'
        } as DeletePopupI;
        const relatedDataModel = {
            filter: `genreId=${model.id}`,
            urls: [AUTHORS_URL, BOOKS_URL]
        } as RelatedDataI;
        const config = popupGeneralConfig(popupInfo);
        config.data.yesAction = this.onYesDeleteAction;
        config.data.yesArgs = [this, GENRES_URL, model, popupInfo, relatedDataModel];
        this.dialog.open(DeletePopupComponent, config);
    }

    private onYesDeleteAction(context: any, url: string, model: GenreModel, isWithRelatedData: boolean,
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


    public edit([event, model]: [MouseEvent, EntityModel]): void {
        this.dialog.open(GenrePopupComponent, {
            data: {
                model,
                list: this.list,
                title: 'Edit Genre',
            } as PopupInfo,
            disableClose: true,
            autoFocus: false,
            width: '400px',
            height: 'auto'
        });
    }

}
