import { NgModule } from "@angular/core";

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    imports: [
        MatButtonModule,
        MatTableModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatDialogModule,
    ],
    exports: [
        MatButtonModule,
        MatTableModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatDialogModule
    ],
})
export class MaterialModule { }