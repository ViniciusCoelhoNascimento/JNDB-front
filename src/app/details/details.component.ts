import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Video } from '../video';
import { DbService } from '../db.service';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-details',
  imports: [CommonModule],
  template: `
  <article>
          <div class="container">
        <!-- Conteúdo do Livro -->
        <div class="content">
          <div class="title-row">
            <h1 class="title">TÍTULO</h1>
            <!-- Botão de Favoritar -->
            <img onclick="favorite()" class="save-button" [src]="imageSaveBook"/>
          </div>
          <p class="author">Autor</p>
          <p>Aparece em:</p>
          <a [href]="'https://www.youtube.com/watch?v=' + item.link" *ngFor="let item of videoList">{{item.title}}</a>
        </div>

        <!-- Imagem do Livro -->
        <div class="image-container">
          <img [src]="" alt="Capa do Livro" class="book-image">
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
  imageBookMark = this.imageSaveBook;

  constructor(){
    const itemId = Number(this.route.snapshot.params['id'])
    this.dbService.getRelatedVideos(itemId).then((lVideoList: Video[]) => {
      this.videoList = lVideoList;
    });
  }

  favorite(){
    console.log("chamou")
    if(this.imageBookMark == this.imageSaveBook){
      this.imageBookMark = this.imageSavedBook;
    }else{
      this.imageBookMark = this.imageSaveBook;
    }
  }

}
