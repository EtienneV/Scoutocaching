import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MericourtComponent } from './main.component';

describe('MericourtComponent', () => {
  let component: MericourtComponent;
  let fixture: ComponentFixture<MericourtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MericourtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MericourtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
