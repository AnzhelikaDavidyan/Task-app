import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
    selector: 'app-delete-popup',
    templateUrl: './delete-popup.component.html',
    styleUrls: ['./delete-popup.component.css']
})
export class DeletePopupComponent implements OnInit {


    constructor(public dialogRef: MatDialogRef<DeletePopupComponent>,
                @Inject(MAT_DIALOG_DATA) public data: {
                    title: string,
                    message: string,
                    yesAction: Function,
                    yesArgs: any[],
                    noAction: Function,
                    noArgs: any[],
                    context: any,
                }) {

    }

    public ngOnInit(): void {
    }

    public noAction() {
        if (this.data.noAction) {
            this.data.noAction.apply(this.data.context, this.data.noArgs);
        }
        this.close(false);
    }

    public yesAction() {
        if (this.data.yesAction) {
            this.data.yesAction.apply(this.data.context, this.data.yesArgs);
        }
        this.close(true);
    }

    private close(yesNo: boolean): void {
        this.dialogRef.close(yesNo);
    }
}

export interface DeletePopupI {
    title: string;
    message: string;
}
