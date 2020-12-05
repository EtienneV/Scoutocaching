import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RasJabelComponent } from './ras-jabel.component';

describe('RasJabelComponent', () => {
  let component: RasJabelComponent;
  let fixture: ComponentFixture<RasJabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RasJabelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RasJabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
