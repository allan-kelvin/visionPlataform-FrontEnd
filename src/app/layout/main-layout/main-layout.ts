import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { HeaderComponent } from '../header/header';
import { SidebarComponent } from '../sidebar/sidebar';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
  imports: [
    RouterOutlet,
    MatSidenavModule,
    SidebarComponent,
    HeaderComponent
  ],
})
export class MainLayoutComponent {


  constructor(private authService: AuthService) { }
  collapsed = false;
  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }
}
