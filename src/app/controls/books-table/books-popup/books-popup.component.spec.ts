import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksPopupComponent } from './books-popup.component';

describe('BooksPopupComponent', () => {
  let component: BooksPopupComponent;
  let fixture: ComponentFixture<BooksPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BooksPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BooksPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
