import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitBookComponent } from './submit-book.component';

describe('SubmitBookComponent', () => {
  let component: SubmitBookComponent;
  let fixture: ComponentFixture<SubmitBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitBookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
