import { inject, Component } from '@angular/core';
import { ResultsComponent } from "../results/results.component";
import { Book } from '../book';
import { DbService } from '../db.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  imports: [ResultsComponent, CommonModule],
  template: `
  <section>
    <div class="container">
        <!-- Barra de Busca -->
        <div class="search-bar">
            <input type="text" id="searchInput" class="form-control" placeholder="Digite o titulo de um livro..." (input)="filterCards($event)">
          </div>
    </div>
  </section>
    <section class="results">
      <app-results *ngFor="let bookVariable of filteredBooksList" [book] = "bookVariable" ></app-results>
    </section>
  `,
  styleUrl: './search.component.css'
})
export class SearchComponent {
  booksList: Book[] = [];
  filteredBooksList: Book[] = [];
  dbService: DbService = inject(DbService);

  constructor(){
    this.dbService.getAllBooks().then((lbooksList: Book[]) => {
      this.booksList = lbooksList;
      this.filteredBooksList = lbooksList;
    });
  }

  filterCards(event: Event) {
    const text: string = (event.target as HTMLInputElement).value
    if (!text) this.filteredBooksList = this.booksList;

    this.filteredBooksList = this.booksList.filter(
      book => book?.title.toLowerCase().includes(text.toLowerCase())
    );
  }
}
