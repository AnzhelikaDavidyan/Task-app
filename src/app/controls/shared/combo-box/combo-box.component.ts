import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { GenreModel } from '../../genres-table/model/genre.model';

@Component({
  selector: 'app-combo-box',
  templateUrl: './combo-box.component.html',
  styleUrls: ['./combo-box.component.css']
})
export class ComboBoxComponent implements OnInit {

  @Input() label!: string;
  @Input() formControlName!: string;
  @Input() list: GenreModel[] = [];
  @Input() errorMessages!: string[];
  @Input() form!: FormGroup;

  constructor() {
    this.form.setControl(this.formControlName, new FormControl(''))
  }

  ngOnInit(): void {
  }

}
