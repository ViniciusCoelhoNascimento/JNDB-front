import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Video } from '../video';
import { Movie } from '../movie';
import { DbService } from '../db.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommentsSessionComponent } from '../comments-session/comments-session.component';

@Component({
  selector: 'app-details-movie',
  imports: [CommonModule, FormsModule, CommentsSessionComponent],
  template: `

<article>
          <div class="container">
        <!-- Conteúdo do Livro -->
        <div class="content">
          <div class="title-row">
            <h1 class="title">{{Movie?.title}}</h1>
            <!-- Botão de Favoritar -->
            <img title="Favoritar" alt="favoritar" (click)="favorite()" class="save-button" [src]="imageSaveMovie" [ngClass]="{'favorited': isFavorited}"/>
            <img title="Retirar dos favoritos" (click)="unfavorite()" class="save-button" [src]="imageSavedMovie" [ngClass]="{'favorited': !isFavorited}"/>
          </div>
          <p class="author">{{Movie?.date}}</p>
          <p>Aparece em:</p>
          <a [href]="'https://www.youtube.com/watch?v=' + item.link" *ngFor="let item of videoList">{{item.title}}</a>
        </div>

        <!-- Imagem do Livro -->
        <div class="image-container">
          <img [src]="Movie?.linkPoster" alt="Capa do Filme" class="Movie-image">
        </div>
</div>

<app-comments-session [itemType]="'details-movie'" [itemId]="itemId"></app-comments-session>

  </article>
  `,
  styleUrl: './details-movie.component.css'
})
export class DetailsMovieComponent {
  route: ActivatedRoute = inject(ActivatedRoute)
  itemId: number = Number(this.route.snapshot.params['id'])
  videoList: Video[] = [];
  dbService: DbService = inject(DbService)
  imageSaveMovie = 'assets/saveBook.png'
  imageSavedMovie = 'assets/savedBook.png'
  isFavorited = false;
  Movie?: Movie;

  constructor(){
    this.dbService.getMoviesRelatedVideos(this.itemId).then((lVideoList: Video[]) => {
      this.videoList = lVideoList;
    });

    console.log(this.videoList)

    this.dbService.getMovieById(this.itemId).then((lMovie: Movie) => {
      this.Movie = lMovie;
    });
  }

  favorite(){
    this.isFavorited= true;
    
  }

  unfavorite(){
    this.isFavorited = false;
  }
}
