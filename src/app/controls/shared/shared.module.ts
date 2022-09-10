import {NgModule} from '@angular/core';
import {MaterialModule} from 'src/app/material.module';
import {DeletePopupComponent} from './delete-popup/delete-popup.component';
import {ComboBoxComponent} from './combo-box/combo-box.component';
import {CommonModule} from "@angular/common";

@NgModule({
    declarations: [
        DeletePopupComponent,
        ComboBoxComponent
    ],
    imports: [
        MaterialModule,
        CommonModule
    ],
    providers: [],
    entryComponents: [DeletePopupComponent],
    exports: [DeletePopupComponent, ComboBoxComponent]
})
export class SharedModule {
}
