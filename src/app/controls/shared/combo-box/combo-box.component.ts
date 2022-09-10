import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {EntityModel} from "../../model/entity.model";

@Component({
    selector: 'app-combo-box',
    templateUrl: './combo-box.component.html',
    styleUrls: ['./combo-box.component.css']
})
export class ComboBoxComponent implements OnInit, OnChanges {

    @Input() label!: string;
    @Input() formControlName!: string;
    @Input() list: EntityModel[] | null = [];
    @Input() errorMessages!: string[];
    @Input() form!: FormGroup;

    constructor() {

    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['list']) {
            this.list = changes['list'].currentValue;
        }
    }

    ngOnInit(): void {
        console.log(this.form);
        this.form.valueChanges.subscribe(a => {
            console.log(a);
        })
        // this.form.addControl(this.formControlName, new FormControl(''))
    }

}
