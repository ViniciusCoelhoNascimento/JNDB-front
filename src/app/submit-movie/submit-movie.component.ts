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
            <input for="title" type="text" formControlName="title"><button type="button" (click)="getMovieTMDbAPI()">Procurar</button>
          </div>

          <img height="300px" [src]="posterURL">
          <p>Titulo: {{ title }}</p>
          <p>Ano: {{ year }}</p>
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
      year: new FormControl(''),
      videoSelected: new FormControl(''),
    });
  
    query = ''; // Valor do campo de entrada
    suggestions: string[] = []; // Sugestões que serão exibidas
    allSuggestions: string[] = [];
    dicionario: Map<number, string> = new Map(); //o TypeScript exige que todas as propriedades de uma classe sejam inicializadas de alguma forma antes de serem usadas
    title: string = '';
    plot: string = '';
    posterURL: string = '';
    year: string = '';
  
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
        linkPoster: this.posterURL
      };

      //cadastro filme
      const movieID = await this.dbService.makeAuthenticatedPOST('logged/movies/movies', movieBody)
      //cadastro relação
      const relationBody = {
        movieId: movieID,
        videoId: videoId
      }
      await this.dbService.makeAuthenticatedPOST('logged/movies/movies/videos', relationBody)
  
    }
  
    async getMovieTMDbAPI(){
      const title = this.applyForm.value.title?.toString() ?? '';
      const url = 'http://localhost:8080/api/proxy/TMDB/' + encodeURIComponent(title)
      const token = localStorage.getItem('jndb-token');
      const response = await fetch(url,{
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      const data = await response.json();
      console.log(data)

      this.title = data.results[0].original_title
      this.year = data.results[0].release_date
      this.plot = data.results[0].overview
      //this.director = data.Director
      //this.genre = data.results[0].Genre
      this.posterURL = "https://image.tmdb.org/t/p/w500/" + data.results[0].poster_path
    
//colocar o codigo para pegar as informações do filme
    }
  
    async onInputChange() {
  
      if (this.query) {
        this.suggestions = this.allSuggestions.filter(item => {
          const words = this.query.toLowerCase().split(/\s+/); // Divide a query em palavras
          return words.every(word => item.toLowerCase().includes(word));
        });        
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

      console.log(this.allSuggestions)
    }
  
    // Função para buscar a chave pelo valor
    getKeyByValue(map: Map<number, string>, value: string): number | undefined {
      value = value.toLowerCase(); // Normaliza a entrada do usuário para evitar problemas com maiúsculas/minúsculas
    
      for (const [key, val] of map.entries()) {
        if (val.toLowerCase().includes(value)) { // Verifica se a string contém o valor buscado
          return key; // Retorna a primeira chave correspondente
        }
      }
      return undefined; // Retorna undefined se nenhum valor corresponder
    }    

}
