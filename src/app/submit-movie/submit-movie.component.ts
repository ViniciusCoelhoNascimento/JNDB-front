import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DbService } from '../db.service';
import { ToastrService } from 'ngx-toastr';
import { Movie } from '../movie';

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
              [(ngModel)]="queryVideo" 
              (input)="onInputChangeVideos()" 
              type="text" 
              placeholder="Digite o nome do video..." 
              class="form-control" />
            
            <!-- Exibe sugestões apenas se houver sugestões -->
            <ul *ngIf="VideosSuggestions.length > 0" class="list-group mt-2">
              <li 
                *ngFor="let suggestion of VideosSuggestions" 
                class="list-group-item list-group-item-action" 
                (click)="selectVideoSuggestion(suggestion)">
                {{ suggestion }}
              </li>
            </ul>
          </div>
        
          <div>
            <label for="title">Titulo do filme:</label>
            <div style="display:flex; gap: 5px; align-items: center;">
            <input 
              id="title"
              formControlName="title"
              autocomplete="off"
              [(ngModel)]="queryMovie" 
              (input)="onInputChangeMovies()" 
              type="text" 
              placeholder="Digite o nome do filme..." 
              class="form-control" />
              
            <!-- Exibe sugestões apenas se houver sugestões -->
            <ul *ngIf="moviesSuggestions.length > 0" class="list-group mt-2">
              <li 
                *ngFor="let moviesSuggestions of moviesSuggestions" 
                class="list-group-item list-group-item-action" 
                (click)="selectMovieSuggestion(moviesSuggestions)">
                {{ moviesSuggestions }}
              </li>
            </ul>

              <button type="button" (click)="getMovieTMDbAPI()">Procurar</button>
              <img class="invisible" src="assets/loading.gif" height="16px" width="16px" [ngClass]="{'invisible': !loadingBln}">
            </div>
          </div>

          <div style="display: flex; width: 700px; flex-direction: column;">
            <img height="300px" width="auto" [src]="posterURL">
            <p><strong>Titulo:</strong> {{ title }}</p>
            <p><strong>Ano:</strong> {{ year }}</p>
            <p><strong>Plot:</strong> {{ plot }}</p>
          </div>
          <button type="submit" class="primary">Enviar</button>
        </form>
      </section>
  `,
  styleUrl: './submit-movie.component.css'
})
export class SubmitMovieComponent {
  
    dbService: DbService = inject(DbService);
    loadingBln = false;
  
    applyForm = new FormGroup({
      title: new FormControl(''),
      description: new FormControl(''),
      year: new FormControl(''),
      videoSelected: new FormControl(''),
    });
  
    queryVideo = ''; // Valor do campo de entrada
    queryMovie = ''; // Valor do campo de entrada
    VideosSuggestions: string[] = []; // Sugestões que serão exibidas
    allVideosSuggestions: string[] = [];
    allMoviesSuggestions: string[] = [];
    moviesSuggestions: string[] = []; // Sugestões que serão exibidas
    dicionarioVideos: Map<number, string> = new Map(); //o TypeScript exige que todas as propriedades de uma classe sejam inicializadas de alguma forma antes de serem usadas
    dicionarioMovies: Map<string, Movie> = new Map(); //o TypeScript exige que todas as propriedades de uma classe sejam inicializadas de alguma forma antes de serem usadas
    title: string = '';
    plot: string = '';
    posterURL: string = '';
    year: string = '';
    movieIdSelected: number = 0;
  
    constructor(private toastr: ToastrService){
     this.getNerdOfficeVideos();
     this.getMoviesFromDB();
    }
  
    async submitMovie(){

      if (!this.applyForm.valid) {
        this.toastr.error('Erro','Favor completar as informações')
      }

      //primeiro cadastra o filme e depois cadastra a relação
      const videoId = this.getKeyByValue(this.dicionarioVideos, this.applyForm.value.videoSelected ?? '')
      const title = this.applyForm.value.title;
      const description = this.applyForm.value.description;
      const info = null;
  
      const movieBody = {
        title: this.title,
        year: this.year,
        plot: this.plot,
        linkPoster: this.posterURL
      };

      try{
        //cadastro filme
        let filmeId: number = 0;
        if (this.movieIdSelected == 0){
          filmeId = await this.dbService.makeAuthenticatedPOST('logged/movies/movies', movieBody)
        }else{
          filmeId = this.movieIdSelected
        }
        
        //cadastro relação
        const relationBody = {
          filmeId: filmeId,
          videoId: videoId
        }
        await this.dbService.makeAuthenticatedPOST('logged/movies/movies/videos', relationBody)
      } catch(error){
        this.toastr.error('Mensagem', 'Erro ao enviar.')
      } finally {
        this.toastr.success('Mensagem', 'Enviado com sucesso!')
      }

    }
  
    async getMovieTMDbAPI(){
      this.loadingBln = true;
      const title = this.applyForm.value.title?.toString() ?? '';
      const url = 'http://localhost:8080/api/proxy/TMDB/' + encodeURIComponent(title)
      const token = localStorage.getItem('jndb-token');

      try{
        const response = await fetch(url,{
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        })
        const data = await response.json()
        console.log(data)
  
        this.title = data.results[0].original_title
        this.year = data.results[0].release_date
        this.plot = data.results[0].overview
        //this.director = data.Director
        //this.genre = data.results[0].Genre
        this.posterURL = "https://image.tmdb.org/t/p/w500/" + data.results[0].poster_path

      } catch (error){
        console.log('Erro ao buscar os dados: ', error)
        this.toastr.info('','Filme não encontrado!')
      } finally {
        this.loadingBln = false;

        this.toastr.success("Enviado com sucesso!",'Feito!')
        this.applyForm.patchValue({
          title: '',
          description: '',
          year: ''
        })
      }
    }
  
    async onInputChangeVideos() {
  
      if (this.queryVideo) {
        this.VideosSuggestions = this.allVideosSuggestions.filter(item => {
          const words = this.queryVideo.toLowerCase().split(/\s+/); // Divide a query em palavras
          return words.every(word => item.toLowerCase().includes(word));
        });        
      } else {
        this.VideosSuggestions = [];
      }
    }

    async onInputChangeMovies() {
  
      if (this.queryMovie) {
        this.moviesSuggestions = this.allMoviesSuggestions.filter(item => {
          const words = this.queryMovie.toLowerCase().split(/\s+/); // Divide a query em palavras
          return words.every(word => item.toLowerCase().includes(word));
        });        
      } else {
        this.VideosSuggestions = [];
      }
    }

    selectVideoSuggestion(suggestion: string) {
      this.queryVideo = suggestion; // Preenche o campo com a sugestão selecionada
      this.VideosSuggestions = []; // Limpa as sugestões
    }
  
    selectMovieSuggestion(suggestion: string) {
      this.queryMovie = suggestion; // Preenche o campo com a sugestão selecionada

      this.moviesSuggestions = []; // Limpa as sugestões

      const movie = this.dicionarioMovies.get(suggestion);
      if(movie){
        this.movieIdSelected = movie.id;

        this.title = movie.title;
        this.year = movie.year;
        this.plot = movie.plot || '';
        this.posterURL = movie.linkPoster;
      }
    }
  
    async getNerdOfficeVideos(){
      const json = await this.dbService.getResponse('api/movies/videos');
      
      Object.values(json).forEach((item: any) => {
        this.dicionarioVideos.set(item.id, item.title);
        this.allVideosSuggestions.push(item.title);
      });
    }

    async getMoviesFromDB(){
      const json = await this.dbService.getResponse('api/movies/movies');
      
      Object.values(json).forEach((item: any) => {
        this.dicionarioMovies.set(item.title, item);
        this.allMoviesSuggestions.push(item.title);
      });

      console.log('all movies: ', this.dicionarioMovies);
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
