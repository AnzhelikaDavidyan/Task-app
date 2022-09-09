import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material.module';
import { DeletePopupComponent } from './delete-popup/delete-popup.component';
@NgModule({
    declarations: [
        DeletePopupComponent
    ],
    imports: [
        MaterialModule
    ],
    providers: [],
    entryComponents: [DeletePopupComponent],
    exports: [DeletePopupComponent]
})
export class SharedModule { }
