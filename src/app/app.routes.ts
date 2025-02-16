import { Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { SubmitBookComponent } from './submit-book/submit-book.component';
import { DetailsComponent } from './details/details.component';
import { SubmitMovieComponent } from './submit-movie/submit-movie.component';
import { MoviesSearchComponent } from './movies-search/movies-search.component';
import { DetailsMovieComponent } from './details-movie/details-movie.component';

export const routes: Routes = [
    {
        path: '',
        component: SearchComponent,
        title: 'Home Page'
    },
    {
        path: 'user-register',
        component: UserRegisterComponent,
        title: 'Login'
    },
    {
        path: 'submit-book',
        component: SubmitBookComponent,
        title: 'Submit Book'
    },
    {
        path: 'submit-movie',
        component: SubmitMovieComponent,
        title: 'Submit Movie'
    },
    {
        path: 'details/:id',
        component: DetailsComponent,
        title: 'Detalhes'
    },
    {
        path: 'details-movie/:id',
        component: DetailsMovieComponent,
        title: 'Detalhes'
    },
    {
        path: 'movies-search',
        component: MoviesSearchComponent,
        title: 'Movies'
    }
];

export default routes;