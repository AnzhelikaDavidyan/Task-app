import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
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
export class TableComponent implements OnInit, OnChanges {

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

    constructor(private dataCommunicationService: DataCommunicationService) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        const list = changes['list'];
        if (list && list.currentValue) {
            this.dataSource = new MatTableDataSource(list.currentValue);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        }
    }

    ngOnInit(): void {
        this.dataCommunicationService?.getNotifier()?.subscribe(
            {
                next: (res: DataCommunicationModel) => {
                    if (res.isDeleted || res.isCreated || res.isEdited) {
                        if (res.isCreated) {
                            this.list.push(res.model);
                        }
                        if (res.isEdited) {
                            const index = this.list.findIndex(item => item.id === res.model.id);
                            this.list[index] = res.model;
                        }
                        this.dataSource._updateChangeSubscription();
                    }
                }
            }
        )
    }

    public onAdd() {
        this.add.emit();
    }

    public onEdit(event: MouseEvent, model: EntityModel) {
        this.edit.emit([event, model]);
    }

    public onDelete(model: EntityModel) {
        this.delete.emit(model);
    }

    public applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
}
