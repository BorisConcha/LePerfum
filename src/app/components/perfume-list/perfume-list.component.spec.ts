import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfumeListComponent } from './perfume-list.component';

describe('PerfumeListComponent', () => {
  let component: PerfumeListComponent;
  let fixture: ComponentFixture<PerfumeListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PerfumeListComponent]
    });
    fixture = TestBed.createComponent(PerfumeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
