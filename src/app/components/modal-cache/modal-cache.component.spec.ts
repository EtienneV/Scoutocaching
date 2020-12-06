import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCacheComponent } from './modal-cache.component';

describe('ModalCacheComponent', () => {
  let component: ModalCacheComponent;
  let fixture: ComponentFixture<ModalCacheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCacheComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCacheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
