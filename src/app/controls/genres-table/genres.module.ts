import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {GenreRoutingModule} from "./genre-routing.module";
import {GenresTableComponent} from "./genres-table.component";
import {GenrePopupComponent} from './genre-popup/genre-popup.component';
import {MaterialModule} from "../../material.module";

@NgModule({
    imports: [
        CommonModule,
        GenreRoutingModule,
        MaterialModule
    ],
    declarations: [GenresTableComponent, GenrePopupComponent],
    exports: [GenresTableComponent]
})
export class GenresModule {
}
