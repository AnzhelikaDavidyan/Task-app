import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {noop, Subject, takeUntil} from "rxjs";
import {MatTable} from "@angular/material/table";
import {GenreModel} from "./model/genre.model";
import {MatDialog} from "@angular/material/dialog";
import {AUTHORS_URL, BOOKS_URL, GENRES_URL} from "../util/url";
import {
    ColumnModel,
    editItem,
    popupGeneralConfig,
    PopupInfo,
    RelatedDataI,
    removeItemFromList
} from "../shared/util/table.util";
import {DeletePopupComponent, DeletePopupI} from "../shared/delete-popup/delete-popup.component";
import {GenrePopupComponent} from "./genre-popup/genre-popup.component";
import {TypeEnum} from "../shared/enum/type.enum";
import {DataService} from "../services/data.service";
import {EntityModel} from "../model/entity.model";
import {BROADCAST_SERVICE} from "../../app.token";
import {BroadcastService} from "../services/broadcast.service";
import {ChannelEnum} from "../util/channel.enum";
import {DataCommunicationModel, DataCommunicationService} from "../services/data-communication.service";
import {MatSnackBar} from "@angular/material/snack-bar";

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
                @Inject(BROADCAST_SERVICE) private broadCastService: BroadcastService,
                private dataCommunicationService: DataCommunicationService,
                private snackBar: MatSnackBar,) {
    }

    public ngOnInit(): void {
        this.listenCreateAction(ChannelEnum.CREATE_GENRE);
        this.listenDeleteAction(ChannelEnum.DELETE_GENRE);
        this.listenEditAction(ChannelEnum.EDIT_GENRE);
        this.notifyData();
        this.dataService.getList(GENRES_URL).pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (genres: EntityModel[]) => {
                    this.list = genres as GenreModel[];
                },
                error: console.error
            });
    }

    private notifyData(): void {
        this.dataCommunicationService.getNotifier()
            .subscribe({
                next: (res: DataCommunicationModel) => {
                    if (res.isCreated) {
                        this.list.push(res.model as GenreModel);
                        this.openSnackBar('Data has been successfully added.');
                    }
                    if (res.isEdited) {
                        editItem(this.list, res.model as GenreModel);
                        this.openSnackBar('Data has been successfully edited.');
                    }
                    if (res.isDeleted) {
                        this.openSnackBar('Data has been successfully deleted.');
                    }
                    this.list = this.list.slice();
                },
                error: console.error
            });
    }

    private listenCreateAction(type: ChannelEnum): void {
        this.broadCastService.messagesOfType(type)
            .subscribe({
                next: (message) => {
                    this.list.push(message.payload as GenreModel);
                    this.list = this.list.slice();
                },
                error: console.error
            });
    }

    private listenDeleteAction(type: ChannelEnum): void {
        this.broadCastService.messagesOfType(type)
            .subscribe({
                next: (message) => {
                    removeItemFromList(this.list, message.payload);
                    this.list = this.list.slice();
                },
                error: console.error
            });
    }

    private listenEditAction(type: ChannelEnum): void {
        this.broadCastService.messagesOfType(type)
            .subscribe({
                next: (message) => {
                    editItem(this.list, message.payload as EntityModel);
                    this.list = this.list.slice();
                },
                error: console.error
            });
    }

    private openSnackBar(message: string) {
        this.snackBar.open(message, '', {
            duration: 2000,
        });
    }

    public add(): void {
        this.dialog.open(GenrePopupComponent, {
            data: {
                isNew: true,
                list: this.list,
                title: 'Add Genre',
                model: null,
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
            type: ChannelEnum.DELETE_GENRE,
            payload: model
        });
        context.dataService.deleteItem(url, model, isWithRelatedData, relatedData)
            .subscribe({
                next: noop,
                error: console.error
            })
    }


    public edit([event, model]: [MouseEvent, EntityModel]): void {
        this.dialog.open(GenrePopupComponent, {
            data: {
                model,
                list: this.list,
                title: 'Edit Genre',
                isNew: false
            } as PopupInfo,
            disableClose: true,
            autoFocus: false,
            width: '400px',
            height: 'auto'
        });
    }

}
