import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
  <main>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <header>
      <nav class="header d-flex justify-content-between align-items-center">
          <div>
              <a [routerLink]="['']" class="btn btn-outline-primary me-2">Livros</a>
              <a [routerLink]="['movies-search']" class="btn btn-outline-success me-2">Filmes</a>
              <!--<a [routerLink]="['']" class="btn btn-outline-success">Nerdologia</a>-->
          </div>
          
          <!-- Botão com Submenus -->
          <div class="dropdown">
            <a [routerLink]="['/user-register']"  class="btn btn-warning">Contribuir</a>
            <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" [attr.aria-expanded]="isExpanded ? 'true' : 'false'" 
            (click)="toggleDropDown()">
              Menu
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton" [class.show]="isExpanded">
              <li><a class="dropdown-item">Notificações</a></li>
              <li><a class="dropdown-item">Salvos</a></li>
              <li><a [routerLink]="['/submit-book']" class="dropdown-item">Enviar livro</a></li>
              <li><a [routerLink]="['/submit-movie']" class="dropdown-item">Enviar filme</a></li>
              <li><a class="dropdown-item">Sair</a></li>
            </ul>
          </div> 
          <div>
            
          </div>         
      </nav>
    </header>
    <section>
      <router-outlet></router-outlet>
    </section>
  </main>
  `,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'JNDB-front';
  isLogged = false;
  isExpanded = false;

  constructor(){

  }

  funcIsLogged(){

  }

  toggleDropDown() {
    this.isExpanded = !this.isExpanded;
  }

   // Fecha o dropdown
   closeDropdown(): void {
    this.isExpanded = false;
  }

  // Detecta cliques fora do elemento
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    const isDropdownElement = target.closest('.dropdown') || target.closest('.dropdown-button');
    const isDropDownItemClicked = target.closest('.dropdown-item') 
    if (!isDropdownElement || isDropDownItemClicked) {
      this.closeDropdown();
    }
  }
}
