import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material.module';
import { DeletePopupComponent } from './delete-popup/delete-popup.component';
import { ComboBoxComponent } from './combo-box/combo-box.component';
@NgModule({
    declarations: [
        DeletePopupComponent,
        ComboBoxComponent
    ],
    imports: [
        MaterialModule
    ],
    providers: [],
    entryComponents: [DeletePopupComponent],
    exports: [DeletePopupComponent, ComboBoxComponent]
})
export class SharedModule { }
