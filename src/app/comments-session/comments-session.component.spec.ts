import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsSessionComponent } from './comments-session.component';

describe('CommentsSessionComponent', () => {
  let component: CommentsSessionComponent;
  let fixture: ComponentFixture<CommentsSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentsSessionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentsSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
