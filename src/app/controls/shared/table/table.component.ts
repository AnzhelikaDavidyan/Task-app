import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {BookModel} from "../../books-table/model/book.model";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {DataCommunicationModel, DataCommunicationService} from "../../services/data-communication.service";

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnChanges {

    @Input() public list!: any;
    @Input() public displayedColumns!: string[];
    @Input() public columns: ColumnModel[] = [];

    @Output() public add: EventEmitter<void> = new EventEmitter<void>();
    @Output() public edit: EventEmitter<[MouseEvent, any]> = new EventEmitter<[MouseEvent, any]>();
    @Output() public delete: EventEmitter<any> = new EventEmitter<any>();


    @ViewChild(MatPaginator) paginator!: MatPaginator | null;
    @ViewChild(MatSort) sort!: MatSort | null;
    @ViewChild(MatTable) table!: MatTable<any>;

    public dataSource!: MatTableDataSource<any>;

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
        this.dataCommunicationService.getNotifier().subscribe(
            {
                next: (res: any) => {
                    if (res.isDeleted || res.isCreated || res.isEdited) {
                        this.table.renderRows();
                        this.dataSource._updateChangeSubscription();
                    }
                }
            }
        )
    }

    public onAdd() {
        this.add.emit();
    }

    public onEdit(event: MouseEvent, model: any) {
        this.edit.emit([event, model]);
    }

    public onDelete(model: any) {
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

export interface ColumnModel {
    id: number;
    systemName: string;
    title: string;
}