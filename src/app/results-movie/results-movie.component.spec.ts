import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsMovieComponent } from './results-movie.component';

describe('ResultsMovieComponent', () => {
  let component: ResultsMovieComponent;
  let fixture: ComponentFixture<ResultsMovieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultsMovieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultsMovieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
