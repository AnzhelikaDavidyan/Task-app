import {NgModule} from '@angular/core';
import {MaterialModule} from 'src/app/material.module';
import {DeletePopupComponent} from './delete-popup/delete-popup.component';
import {ComboBoxComponent} from './combo-box/combo-box.component';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
    declarations: [
        DeletePopupComponent,
        ComboBoxComponent
    ],
    imports: [
        MaterialModule,
        CommonModule,
        ReactiveFormsModule
    ],
    providers: [],
    entryComponents: [DeletePopupComponent],
    exports: [DeletePopupComponent, ComboBoxComponent]
})
export class SharedModule {
}
