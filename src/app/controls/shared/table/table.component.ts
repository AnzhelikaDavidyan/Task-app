import {
    Component,
    EventEmitter, Inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {DataCommunicationModel, DataCommunicationService} from "../../services/data-communication.service";
import {ColumnModel} from "../util/table.util";
import {TypeEnum} from "../enum/type.enum";
import {MaterialModule} from "../../../material.module";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {ReadClassifierPipe} from "../pipe/read-classifier.pipe";
import {EntityModel} from "../../model/entity.model";
import {Subject, takeUntil} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {BROADCAST_SERVICE} from "../../../app.token";
import {BroadcastService} from "../../services/broadcast.service";
import {Action} from "rxjs/internal/scheduler/Action";
import {ActionEnum} from "../../util/action.enum";

@Component({
    standalone: true,
    imports: [
        MaterialModule,
        CommonModule,
        ReactiveFormsModule,
        ReadClassifierPipe
    ],
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnChanges, OnDestroy {

    private destroy$ = new Subject();

    @Input() public list!: EntityModel[];
    @Input() public displayedColumns!: string[];
    @Input() public columns: ColumnModel[] = [];

    public readonly TYPES = TypeEnum;
    @Output() public add: EventEmitter<void> = new EventEmitter<void>();
    @Output() public edit: EventEmitter<[MouseEvent, EntityModel]> = new EventEmitter<[MouseEvent, EntityModel]>();
    @Output() public delete: EventEmitter<EntityModel> = new EventEmitter<EntityModel>();


    @ViewChild(MatPaginator) paginator!: MatPaginator | null;
    @ViewChild(MatSort) sort!: MatSort | null;
    @ViewChild(MatTable) table!: MatTable<any>;

    public dataSource!: MatTableDataSource<EntityModel[]>;

    constructor(private dataCommunicationService: DataCommunicationService,
                private snackBar: MatSnackBar,
                @Inject(BROADCAST_SERVICE) private broadCastService: BroadcastService) {
    }

    public ngOnDestroy(): void {
        this.destroy$.next(0);
        this.destroy$.complete();
    }

    ngOnChanges({list}: SimpleChanges): void {
        if (list && list.currentValue) {
            this.dataSource = new MatTableDataSource(list.currentValue);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        }
    }

    private listenCreateAction(): void {
        this.broadCastService.messagesOfType(ActionEnum.CREATE)
            .pipe(takeUntil(this.destroy$))
            .subscribe((message) => {
                this.list.push(message.payload);
                this.dataSource._updateChangeSubscription();
            });
    }

    private listenEditAction(): void {
        this.broadCastService.messagesOfType(ActionEnum.EDIT)
            .pipe(takeUntil(this.destroy$))
            .subscribe((message) => {
                const index = this.list.findIndex(item => item.id === message.payload.id);
                this.list[index] = message.payload;
                this.dataSource._updateChangeSubscription();
            });
    }

    private listenDeleteAction(): void {
        this.broadCastService.messagesOfType(ActionEnum.DELETE)
            .pipe(takeUntil(this.destroy$))
            .subscribe((message) => {
                const index = this.list.findIndex(item => item.id === message.payload.id);
                index > -1 ? this.list.splice(index) : null;
                this.dataSource._updateChangeSubscription();
            });
    }

    ngOnInit(): void {
        this.listenCreateAction();
        this.listenEditAction();
        this.listenDeleteAction();
        // this.dataCommunicationService?.getNotifier().pipe(takeUntil(this.destroy$))
        //     .subscribe(
        //         {
        //             next: (res: DataCommunicationModel) => {
        //                 if (res.isDeleted || res.isCreated || res.isEdited) {
        //                     if (res.isCreated) {
        //                         this.list.push(res.model);
        //                         this.openSnackBar('Data has been successfully added.');
        //                     }
        //                     if (res.isEdited) {
        //                         const index = this.list.findIndex(item => item.id === res.model.id);
        //                         this.list[index] = res.model;
        //                         this.openSnackBar('Data has been successfully edited.');
        //                     }
        //                     if (res.isDeleted) {
        //                         this.openSnackBar('Data has been successfully deleted.');
        //                     }
        //                     this.dataSource._updateChangeSubscription();
        //                 }
        //             }
        //         }
        //     )
    }

    private openSnackBar(message: string) {
        this.snackBar.open(message, '', {
            duration: 2000,
        });
    }

    public onAdd(): void {
        this.add.emit();
    }

    public onEdit(event: MouseEvent, model: EntityModel): void {
        this.edit.emit([event, model]);
    }

    public onDelete(model: EntityModel): void {
        this.delete.emit(model);
    }

    public applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
}
