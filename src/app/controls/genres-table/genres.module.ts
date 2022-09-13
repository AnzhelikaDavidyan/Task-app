import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {GenreRoutingModule} from "./genre-routing.module";
import {GenresTableComponent} from "./genres-table.component";
import {GenrePopupComponent} from './genre-popup/genre-popup.component';
import {MaterialModule} from "../../material.module";
import {ReactiveFormsModule} from "@angular/forms";
import {DeletePopupComponent} from "../shared/delete-popup/delete-popup.component";
import {TableComponent} from "../shared/table/table.component";

@NgModule({
    imports: [
        CommonModule,
        GenreRoutingModule,
        MaterialModule,
        DeletePopupComponent,
        TableComponent,
        ReactiveFormsModule
    ],
    declarations: [GenresTableComponent, GenrePopupComponent],
    exports: [GenresTableComponent]
})
export class GenresModule {
}
