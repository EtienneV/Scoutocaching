import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalResolutionComponent } from './modal-resolve.component';

describe('ModalResolutionComponent', () => {
  let component: ModalResolutionComponent;
  let fixture: ComponentFixture<ModalResolutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalResolutionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalResolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
