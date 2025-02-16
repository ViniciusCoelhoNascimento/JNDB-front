import { inject, Component } from '@angular/core';
import { ResultsMovieComponent } from "../results-movie/results-movie.component";
import { Movie } from '../movie';
import { DbService } from '../db.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movies-search',
  imports: [ResultsMovieComponent, CommonModule],
  template: `
  <section>
    <div class="container">
        <!-- Barra de Busca -->
        <div class="search-bar">
            <input type="text" id="searchInput" class="form-control" placeholder="Digite o titulo de um filme..." onkeyup="filterCards()">
        </div>
    </div>
  </section>
    <section class="">
      <app-results-movie *ngFor="let movieVariable of filteredMoviesList" [movie] = "movieVariable" ></app-results-movie>
    </section>
  
  `,
  styleUrl: './movies-search.component.css'
})
export class MoviesSearchComponent {
  moviesList: Movie[] = [];
  filteredMoviesList: Movie[] = [];
  dbService: DbService = inject(DbService);

  constructor(){
    this.dbService.getAllMovies().then((lmoviesList: Movie[]) => {
      this.moviesList = lmoviesList;
      this.filteredMoviesList = lmoviesList;
    });
  }
}
