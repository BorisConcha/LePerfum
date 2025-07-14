import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfumeDetailComponent } from './perfume-detail.component';

describe('PerfumeDetailComponent', () => {
  let component: PerfumeDetailComponent;
  let fixture: ComponentFixture<PerfumeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PerfumeDetailComponent]
    });
    fixture = TestBed.createComponent(PerfumeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});