import { Component, Input } from '@angular/core';
import { Book } from '../book';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-results',
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Resultados da Busca -->
     <section>
      <div class="row mt-4" id="searchResults">
              <!-- Card de Exemplo 1 -->
              <div class="col-md-100">
                  <div class="card">
                      <div class="card-body">
                          <h5 class="card-title">{{book.title}}</h5>
                          <p class="card-text">{{book.author}}</p>
                          <p class="card-text">{{book.isbn13}}</p>
                          <a [routerLink]="['/details', book.id]">Ver mais</a>
                      </div>
                  </div>
              </div>
      </div>
    </section>
  `,
  styleUrl: './results.component.css'
})
export class ResultsComponent {
    @Input() book!:Book;
}
