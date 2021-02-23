import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalOnBoardingComponent } from './modal-onboarding.component';

describe('ModalOnBoardingComponent', () => {
  let component: ModalOnBoardingComponent;
  let fixture: ComponentFixture<ModalOnBoardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalOnBoardingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalOnBoardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
