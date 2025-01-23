import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DbService } from '../db.service';

@Component({
  selector: 'app-submit-movie',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  template: `

<section class ="listing-apply">
        <h2 class="section-heading">Enviar filme</h2>
        <h3>Aviso: Seu envio está sujeito a moderação.</h3>

        <form [formGroup]="applyForm" (ngSubmit)="submitMovie()">
          <div>
            <label for="videoSelected">Video:</label>
            <input 
              id="videoSelected"
              formControlName="videoSelected"
              autocomplete="off"
              [(ngModel)]="query" 
              (input)="onInputChange()" 
              type="text" 
              placeholder="Digite o nome do video..." 
              class="form-control" />
            
            <!-- Exibe sugestões apenas se houver sugestões -->
            <ul *ngIf="suggestions.length > 0" class="list-group mt-2">
              <li 
                *ngFor="let suggestion of suggestions" 
                class="list-group-item list-group-item-action" 
                (click)="selectSuggestion(suggestion)">
                {{ suggestion }}
              </li>
            </ul>
          </div>
        
          <div>
            <label for="title">Titulo do filme:</label>
            <input for="title" type="text" formControlName="title"><button type="button" (click)="getMovieOMDbAPI()">Procurar</button>
          </div>

          <img [src]="posterURL">
          <p>Titulo: {{ title }}</p>
          <p>Ano: {{ year }}</p>
          <p>Gênero: {{ genre }}</p>
          <p>Diretor: {{ director }}</p>
          <p>Plot: {{ plot }}</p>

          <button type="submit" class="primary">Enviar contribuição</button>
        </form>
      </section>
  `,
  styleUrl: './submit-movie.component.css'
})
export class SubmitMovieComponent {
  
    dbService: DbService = inject(DbService);
  
    applyForm = new FormGroup({
      title: new FormControl(''),
      description: new FormControl(''),
      genre: new FormControl(''),
      year: new FormControl(''),
      director: new FormControl(''),
      videoSelected: new FormControl(''),
    });
  
    query = ''; // Valor do campo de entrada
    suggestions: string[] = []; // Sugestões que serão exibidas
    allSuggestions: string[] = [];
    dicionario: Map<number, string> = new Map(); //o TypeScript exige que todas as propriedades de uma classe sejam inicializadas de alguma forma antes de serem usadas
    title: string = '';
    plot: string = '';
    posterURL: string = '';
    genre: string = '';
    director: string = '';
    year: number = 0;
  
    constructor(){
     this.getNerdOfficeVideos();
    }
  
    async submitMovie(){
      //primeiro cadastra o filme e depois cadastra a relação
      const videoId = this.getKeyByValue(this.dicionario, this.applyForm.value.videoSelected ?? '')
      const title = this.applyForm.value.title;
      const description = this.applyForm.value.description;
  
      const movieBody = {
        title: this.title,
        year: this.year,
        plot: this.plot,
        director: this.director,
        genre: this.genre,
        linkPoster: this.posterURL
      };

      //cadastro filme
      const movieID = await this.dbService.makeAuthenticatedPOST('/logged/movies/movies', movieBody)
      //cadastro relação
      const relationBody = {
        movieId: movieID,
        videoId: videoId
      }
      await this.dbService.makeAuthenticatedPOST('/logged/movies/movies/videos', relationBody)
  
    }
  
    async getMovieOMDbAPI(){
      //colocar a api key. Colocar em uma variavel do ambiente
      //documentation: https://www.omdbapi.com/
      const title = this.applyForm.value.title?.toString() ?? '';
  
      const url = 'http://www.omdbapi.com/?t=' + this.applyForm.value.title + '&apikey=82f4bfd1';
      const response = await fetch(url);
      const data = await response.json();

      this.title = data.Title
      this.year = data.Year
      this.plot = data.Plot
      this.director = data.Director
      this.genre = data.Genre
      this.posterURL = data.Poster
    
//colocar o codigo para pegar as informações do filme
    }
  
    async onInputChange() {
  
      if (this.query) {
        this.suggestions = this.allSuggestions.filter(item =>
          item.includes(this.query.toLowerCase())
        );      
      } else {
        this.suggestions = [];
      }
    }
  
    selectSuggestion(suggestion: string) {
      this.query = suggestion; // Preenche o campo com a sugestão selecionada
      this.suggestions = []; // Limpa as sugestões
    }
  
    async getNerdOfficeVideos(){
      const json = await this.dbService.getResponse('api/movies/videos');
      
      Object.values(json).forEach((item: any) => {
        this.dicionario.set(item.id, item.title);
        this.allSuggestions.push(item.title);
      });
    }
  
    // Função para buscar a chave pelo valor
    getKeyByValue(map: Map<number, string>, value: string): number | undefined {
      for (const [key, val] of map.entries()) {
        if (val === value) {
          return key; // Retorna a chave correspondente
        }
      }
      return undefined; // Retorna undefined se o valor não for encontrado
    }

}
