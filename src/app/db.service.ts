import { Injectable } from '@angular/core';
import { Book } from './book';
import { Movie } from './movie';
import { Video } from './video';
import { User } from './user';
import { comentario } from './comentario';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  url = 'http://localhost:8080/';

  constructor() { }

  async getResponse(endpoint: string) : Promise<JSON> {
    console.log(this.url + endpoint)
    const response = await fetch(this.url + endpoint,{
      method: 'GET'      
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }    

    return await response.json();
  }

  async getUser() : Promise<User> {
    const response = await fetch(this.url + 'auth/register');
    const json = await response.json();
    
    localStorage.setItem('userId',json.userId);
    localStorage.setItem('jndb-token',json.token);
    localStorage.setItem('username', json.username);
    
    return json as User;
  }

  async postComment(comentario : comentario) : Promise<comentario> {
    const token = localStorage.getItem('jndb-token');
    const response = await fetch(this.url + 'user-activity/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(comentario)
    });
    const json = await response.json();
    return json as comentario;
  }

  async getComments(itemType: string, itemId: number) : Promise<comentario[]> {
    const data = await fetch(this.url + 'user-activity/comentarios?itemType=' + itemType + '&itemId=' + itemId);
    return await data.json() ?? [];
  }

  async getAllBooks() : Promise<Book[]> {
    const data = await fetch(this.url + 'api/books');
    return await data.json() ?? [];
  }

  async getBookById(idBook : number) : Promise<Book> {
    const data = await fetch(this.url + 'api/book/'+idBook);
    const json = await data.json();
    return json ?? [];
  }

  async getAllMovies() : Promise<Movie[]> {
    const data = await fetch(this.url + 'api/movies/movies');
    return await data.json() ?? [];
  }

  async getMovieById(idMovie : number) : Promise<Movie> {
    const data = await fetch(this.url + 'api/movies/movieById/'+idMovie);
    const json = await data.json();
    return json ?? [];
  }

  async getRelatedVideos(bookId: number) : Promise<Video[]> {
    const data = await fetch(this.url + 'api/books/' + bookId + '/videos');
    const json = await data.json() ?? [];
    //console.log(json)
    //return json as Video[];
    return json;
  }

  async getMoviesRelatedVideos(movieId: number) : Promise<Video[]> {
    const data = await fetch(this.url + 'api/movies/' + movieId + '/videos');
    const json = await data.json() ?? [];
    //console.log(json)
    //return json as Video[];
    return json;
  }

  async makeAuthenticatedPOST(endpoint: string, body: object) {
    const token = localStorage.getItem('jndb-token');
    const url = this.url + endpoint;
    if (!token) {
        alert('You need to log in first!');
        return;
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    const response = await fetch(this.url + endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : null
    });

    if (!response.ok) {
        alert('Request failed. Please try again.');
        return null;
    }

    const json = await response.json();
    const id = json.id;
    return id;
  }

/*
  async postLogged(endpoint: string, body: string){
    const token = localStorage.getItem('jndb-token');
    const response = await fetch(this.url + endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: body ? JSON.stringify(body) : null
    });
  }*/
}
