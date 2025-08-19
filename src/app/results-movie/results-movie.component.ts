import { Component, Input } from '@angular/core';
import { Movie } from '../movie';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-results-movie',
  imports: [CommonModule, RouterModule],
  template: `
  <!-- Resultados da Busca -->
  <section>
   <div class="row mt-4" id="searchResults">
           <!-- Card de Exemplo 1 -->
           <div class="col-md-100">
               <div class="card" style="display: flex; flex-direction: row;">
                   <div class="card-body">
                       <h5 class="card-title">{{movie.title}}</h5>
                       <p class="card-text">{{movie.year}}</p>
                       <a [routerLink]="['/details-movie', movie.id]">Ver mais</a>
                   </div>
                   <div>
                       <img [src]="movie.linkPoster" height="150px">
                  </div>
               </div>
           </div>
   </div>
 </section>

  `,
  styleUrl: './results-movie.component.css'
})
export class ResultsMovieComponent {
  @Input() movie!:Movie;
}
