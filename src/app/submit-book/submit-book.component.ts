import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DbService } from '../db.service';

@Component({
  selector: 'app-submit-book',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  template: `
      <section class ="listing-apply">
        <h2 class="section-heading">Enviar livro</h2>
        <h3>Aviso: Seu envio está sujeito a moderação.</h3>

        <form [formGroup]="applyForm" (submit)="submitBook()">
          <div>
            <label for="videoSelected">Nerdologia:</label>
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
            <label for="isbn13">ISBN-13</label>
            <input for="isbn13" type="number" formControlName="isbn13" (input)="getBookOpenLibraryAPI()">
          </div>

          <img [src]="imgURL">
          <p>Titulo: {{ title }}</p>
          <p>Autor: {{ author }}</p>

          <button type="submit" class="primary">Enviar contribuição</button>

        </form>



      </section>
  `,
  styleUrl: './submit-book.component.css'
})
export class SubmitBookComponent {

  dbService: DbService = inject(DbService);

  applyForm = new FormGroup({
    isbn13: new FormControl(''),
    videoSelected: new FormControl(''),
  });

  query = ''; // Valor do campo de entrada
  suggestions: string[] = []; // Sugestões que serão exibidas
  allSuggestions: string[] = [];
  dicionario: Map<number, string> = new Map(); //o TypeScript exige que todas as propriedades de uma classe sejam inicializadas de alguma forma antes de serem usadas
  imgURL: string = ''
  title: string = '';
  author: string = '';

  constructor(){
   this.getNerdologiaVideos();
  }

  async submitBook(){
    //primeiro cadastra o livro e depois cadastra a relação
    const videoId = this.getKeyByValue(this.dicionario, this.applyForm.value.videoSelected ?? '')
    const isbn13 = this.applyForm.value.isbn13;

    const bookBody = {
      title: this.title,
      author: this.author,
      isbn_13: isbn13
    };
    //cadastro livro

    const bookID = await this.dbService.makeAuthenticatedPOST('api/books', bookBody)
    //cadastro relação
    const relationBody = {
      livroId: bookID,
      videoId: videoId
    }
    await this.dbService.makeAuthenticatedPOST('api/books/videos', relationBody)

  }

  async getBookOpenLibraryAPI(){
    //isbn de teste: 9780307474278
    //documentation: https://openlibrary.org/dev/docs/api/read
    const isbn = this.applyForm.value.isbn13?.toString() ?? '';
    if (isbn?.length < 13){
      //console.log('retornou')
      return;
    }

    const url = 'http://localhost:8080/api/proxy/openlibrary/' + this.applyForm.value.isbn13;
    const response = await fetch(url);
    const data = await response.json();
  
    // Pegando as chaves do objeto `records` (a chave aleatória como "/books/OL24091102M")
    const bookKeys = Object.keys(data.records);
  
    // Acessando o primeiro livro (chave dinâmica)
    if (bookKeys.length > 0) {
      const dynamicKey = bookKeys[0]; // Pega a primeira chave (por exemplo: "/books/OL24091102M")
      const book = data.records[dynamicKey]; // Acessa o livro pela chave dinâmica
      console.log(book.data.title); // Aqui você pode manipular os dados do livro como necessário

      this.title = book.data.title
      this.author = book.data.authors[0].name; //authors é um array de objetos
      this.imgURL = book.data.cover.medium;
    }
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

  async getNerdologiaVideos(){
    const json = await this.dbService.getResponse('api/videos');
    
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
