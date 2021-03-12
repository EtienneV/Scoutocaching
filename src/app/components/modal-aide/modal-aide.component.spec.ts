import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAideComponent } from './modal-aide.component';

describe('ModalAideComponent', () => {
  let component: ModalAideComponent;
  let fixture: ComponentFixture<ModalAideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
