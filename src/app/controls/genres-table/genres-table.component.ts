import {Component, OnInit, ViewChild} from '@angular/core';
import {map, Observable, Subject, takeUntil} from "rxjs";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {GenreModel} from "./model/genre.model";
import {CrudService} from "../services/crud.service";
import {MatDialog} from "@angular/material/dialog";
import {GENRES_URL} from "../util/url";

@Component({
    selector: 'app-genres-table',
    templateUrl: './genres-table.component.html',
    styleUrls: ['./genres-table.component.css']
})
export class GenresTableComponent implements OnInit {
    private destroy$ = new Subject();
    public dataSource: MatTableDataSource<GenreModel> = new MatTableDataSource();
    public displayedColumns: string[] = ['id', 'name', 'actions'];

    @ViewChild(MatTable) table!: MatTable<any>;

    constructor(private crudService: CrudService, public dialog: MatDialog) {
        this.getGenres()
            .subscribe(data => {
                this.dataSource = new MatTableDataSource(data);
            });
    }

    private getGenres(): Observable<GenreModel[]> {
        return this.crudService.getList(GENRES_URL)
            .pipe(
                map((list: any[]) => {
                    const genres: GenreModel[] = [];
                    list.forEach((item) => {
                        genres.push(new GenreModel(item.id, item.name))
                    });
                    return genres;
                }),
                takeUntil(this.destroy$)
            );
    }

    ngOnInit(): void {
    }


    public add() {

    }

    public delete(model: GenreModel) {

    }

    public edit(event: MouseEvent, model: GenreModel) {

    }
}
