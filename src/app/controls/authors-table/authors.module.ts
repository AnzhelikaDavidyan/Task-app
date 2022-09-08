import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AuthorRoutingModule } from "./authors-routing.module";
import { AuthorsTableComponent } from "./authors-table.component";

@NgModule({
    imports: [
        CommonModule,
        AuthorRoutingModule
    ],
    declarations: [AuthorsTableComponent],
    exports: [AuthorsTableComponent]
})
export class AuthorsModule { }