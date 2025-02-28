import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comments-session',
  imports: [CommonModule, FormsModule],
  template: `
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
  `,
  styleUrl: './comments-session.component.css'
})
export class CommentsSessionComponent {
  comment: string = '';
  comments: string[] = ['comentário 1', 'comentário 2'];

  postComment() {
    if (this.comment.trim()){
      this.comment = '';
    }
  }
}
