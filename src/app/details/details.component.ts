import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Video } from '../video';
import { Book } from '../book';
import { DbService } from '../db.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-details',
  imports: [CommonModule, FormsModule],
  template: `
  <article>
          <div class="container">
        <!-- Conteúdo do Livro -->
        <div class="content">
          <div class="title-row">
            <h1 class="title">{{book?.title}}</h1>
            <!-- Botão de Favoritar -->
            <img title="Favoritar" alt="favoritar" (click)="favorite()" class="save-button" [src]="imageSaveBook" [ngClass]="{'favorited': isFavorited}"/>
            <img title="Retirar dos favoritos" (click)="unfavorite()" class="save-button" [src]="imageSavedBook" [ngClass]="{'favorited': !isFavorited}"/>
          </div>
          <p class="author">{{book?.author}}</p>
          <p>Aparece em:</p>
          <a [href]="'https://www.youtube.com/watch?v=' + item.link" *ngFor="let item of videoList">{{item.title}}</a>
        </div>

        <!-- Imagem do Livro -->
        <div class="image-container">
          <img [src]="book?.imgURL" alt="Capa do Livro" class="book-image">
        </div>
</div>

<div class="container">
  <div class="content">
  <h2>Comentários</h2>
  <div class="comment-box">
    <textarea
      [(ngModel)]="comment" 
      placeholder="Escreva seu comentário..."
      rows="4"
      maxlength="200">
    </textarea>
    <div class="comment-footer">
      <span>{{ comment.length }}/250</span>
      <button (click)="postComment()" [disabled]="!comment.trim()">Enviar</button>
    </div>
  </div>

  <textarea readonly *ngFor="let comentario of comments" >
    {{comentario}}
  </textarea>

  </div>
</div>


  </article>
  `,
  styleUrl: './details.component.css'
})
export class DetailsComponent {
  route: ActivatedRoute = inject(ActivatedRoute)
  videoList: Video[] = [];
  dbService: DbService = inject(DbService)
  imageSaveBook = 'assets/saveBook.png'
  imageSavedBook = 'assets/savedBook.png'
  isFavorited = false;
  book?: Book;
  comment: string = '';
  comments: string[] = ['comentario1','comentario2'];

  constructor(){
    const itemId = Number(this.route.snapshot.params['id'])
    this.dbService.getRelatedVideos(itemId).then((lVideoList: Video[]) => {
      this.videoList = lVideoList;
    });

    this.dbService.getBookById(itemId).then((lbook: Book) => {
      this.book = lbook;
    });
  }

  favorite(){
    this.isFavorited= true;
    
  }

  unfavorite(){
    this.isFavorited = false;
  }

  postComment() {
    if (this.comment.trim()) {
      console.log('Comentário enviado:', this.comment);
      this.comment = '';
    }
  }

}
