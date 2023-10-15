import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputFloatingLabelComponent } from './input-floating-label.component';

describe('InputFloatingLabelComponent', () => {
  let component: InputFloatingLabelComponent;
  let fixture: ComponentFixture<InputFloatingLabelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputFloatingLabelComponent]
    });
    fixture = TestBed.createComponent(InputFloatingLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
