import { Component, Input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, MatIconModule, MatExpansionModule, MatTooltipModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent {

  @Input() collapsed = false;
  cadastroOpen = false;

  toggleCadastro() {
    this.cadastroOpen = !this.cadastroOpen;
  }
}
