import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSiteComponent } from './page-site.component';

describe('PageSiteComponent', () => {
  let component: PageSiteComponent;
  let fixture: ComponentFixture<PageSiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageSiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
