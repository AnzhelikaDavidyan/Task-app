import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {GenreRoutingModule} from "./genre-routing.module";
import {GenresTableComponent} from "./genres-table.component";

@NgModule({
    imports: [
        CommonModule,
        GenreRoutingModule
    ],
    declarations: [GenresTableComponent],
    exports: [GenresTableComponent]
})
export class GenresModule {
}
