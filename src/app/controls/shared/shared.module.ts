import {NgModule} from '@angular/core';
import {MaterialModule} from 'src/app/material.module';
import {DeletePopupComponent} from './delete-popup/delete-popup.component';
import {ComboBoxComponent} from './combo-box/combo-box.component';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {TableComponent} from './table/table.component';
import { ReadClassifierPipe } from './pipe/read-classifier.pipe';

@NgModule({
    declarations: [
        DeletePopupComponent,
        ComboBoxComponent,
        TableComponent,
        ReadClassifierPipe
    ],
    imports: [
        MaterialModule,
        CommonModule,
        ReactiveFormsModule
    ],
    providers: [],
    exports: [DeletePopupComponent, ComboBoxComponent, TableComponent]
})
export class SharedModule {
}
