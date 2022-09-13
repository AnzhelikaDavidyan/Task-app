import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {AuthorRoutingModule} from "./authors-routing.module";
import {AuthorsTableComponent} from "./authors-table.component";
import {AuthorPopupComponent} from './author-popup/author-popup.component';
import {MaterialModule} from "../../material.module";
import {ReactiveFormsModule} from "@angular/forms";
import {DeletePopupComponent} from "../shared/delete-popup/delete-popup.component";
import {TableComponent} from "../shared/table/table.component";

@NgModule({
    imports: [
        CommonModule,
        AuthorRoutingModule,
        ReactiveFormsModule,
        MaterialModule,
        TableComponent,
        DeletePopupComponent
    ],
    declarations: [AuthorsTableComponent, AuthorPopupComponent],
    exports: [AuthorsTableComponent]
})
export class AuthorsModule {
}
