import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DbService } from '../db.service';
import { inject } from '@angular/core';
import { comentario } from '../comentario';
import { ActivatedRoute } from '@angular/router';

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

        <div class="comment" *ngFor="let comentario of comments">
          <div class="comment-header">
            <span class="username">{{comentario.username}}</span>
            <span class="timestamp">{{comentario.data_hora | date:'dd/MM/yyyy HH:mm'}}</span>
          </div>
          <div class="comment-text">{{comentario.comentario}}</div>
        </div>

        </div>
      </div>
  `,
  styleUrl: './comments-session.component.css'
})
export class CommentsSessionComponent {
  @Input() itemType: string = '';
  @Input() itemId: number = 0;
  comment: string = '';
  comments: comentario[] = [];
  dbService: DbService = inject(DbService);
  

  ngOnInit() {
    // Agora as propriedades @Input() já estão definidas
    this.dbService.getComments(this.itemType, this.itemId).then((lcomments: comentario[]) => {
      this.comments = lcomments;
    });
    console.log('comentario: itemtype:' + this.itemType + '  ' + ' itemId:' + this.itemId);
  }

  postComment() {
    if (this.comment.trim()) {
      const newComment: comentario = {
        id: null,
        id_usuario: localStorage.getItem('userId') || "0",
        itemType: this.itemType,
        itemId: this.itemId,
        comentario: this.comment,
        data_hora: new Date(),
        username: localStorage.getItem('username')
      };

      console.log('Novo comentário:', newComment);
  
      this.dbService.postComment(newComment).then((savedComment) => {
        console.log('Comentário salvo:', savedComment);
        this.comments.push(savedComment); // Adiciona o comentário à lista
        this.comment = ''; // Limpa o campo de comentário
      }).catch((error) => {
        console.error('Erro ao salvar comentário:', error);
      });
    }
  }
}
