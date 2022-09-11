import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {EntityModel} from "../../model/entity.model";
import {FormControl, FormGroup, FormGroupDirective} from "@angular/forms";

@Component({
    selector: 'app-combo-box',
    templateUrl: './combo-box.component.html',
    styleUrls: ['./combo-box.component.css']
})
export class ComboBoxComponent implements OnInit, OnChanges {

    @Input() label!: string;
    @Input() list: any[] | null = [];
    @Input() errorMessages!: string[];
    @Input() nameField: string = 'name';
    @Input() parentGroup!: FormGroup;
    @Input() formControlName!: string;
    @Input() selectedValue: any;

    @Output() onModelChange = new EventEmitter<any>();


    constructor(private rootFormGroup: FormGroupDirective) {
        console.log('sd')
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['list']) {
            this.list = changes['list'].currentValue;
        }
        if (changes['selectedValue']) {
            console.log(this.selectedValue)
        }
    }

    ngOnInit(): void {
        console.log(this.parentGroup)
    }

    public onComboChange(model: EntityModel) {
        this.onModelChange.emit(model);
    }
}
