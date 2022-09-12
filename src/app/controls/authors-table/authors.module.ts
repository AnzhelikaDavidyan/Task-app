import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {AuthorRoutingModule} from "./authors-routing.module";
import {AuthorsTableComponent} from "./authors-table.component";
import {AuthorPopupComponent} from './author-popup/author-popup.component';
import {SharedModule} from "../shared/shared.module";
import {MaterialModule} from "../../material.module";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule,
        AuthorRoutingModule,
        ReactiveFormsModule,
        MaterialModule,
        SharedModule
    ],
    declarations: [AuthorsTableComponent, AuthorPopupComponent],
    exports: [AuthorsTableComponent]
})
export class AuthorsModule {
}
