import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../core/auth/auth.service';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    FormsModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent implements OnInit {

  @Output() toggleSidebar = new EventEmitter<void>();

  search = '';

  userName = '';
  userEmail = '';
  userInitial = 'V';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  routes = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Usuários', path: '/usuarios' },
    { name: 'Clientes', path: '/clientes' },
    { name: 'Áreas', path: '/areas' },
    { name: 'Planejamento de versões', path: '/planejamento' },
    { name: 'Versões', path: '/versions' }
  ];

  ngOnInit() {

    const user = this.authService.getUser();

    console.log('User Token: ', user);

    if (user) {
      this.userName = user.name;
      this.userEmail = user.email;
      this.userInitial = user.name?.charAt(0).toUpperCase();
    }
  }

  getUser() {
    const token = localStorage.getItem('token');

    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));

    return {
      id: payload.sub,
      name: payload.name,
      email: payload.email
    };
  }



  searchPage() {

    if (!this.search) return;

    const term = this.search.toLowerCase();

    const result = this.routes.find(r =>
      r.name.toLowerCase().includes(term)
    );

    if (result) {

      this.router.navigate([result.path]);

      this.search = '';

    } else {

      console.warn('Tela não encontrada');

    }

  }

  goToProfile() {

    const userId = this.authService.getUserId();

    if (!userId) {
      console.error('Usuário não encontrado no token' + userId);
      return;
    }

    this.router.navigate(['/usuarios', userId]);

  }

  logout() {
    this.authService.logout();
  }


}
