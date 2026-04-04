import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-version-tasks',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  templateUrl: './version-tasks.html',
  styleUrl: './version-tasks.scss'
})
export class VersionTasksComponent {

  @Input() tasks: any[] = [];
  @Input() usuarios: any[] = [];
  @Input() version: any;

  @Output() editTask = new EventEmitter<any>();
  @Output() deleteTask = new EventEmitter<any>();
  @Output() addTask = new EventEmitter<void>();

  getQaNome(id: number | null) {
    if (!id) return '-';
    const user = this.usuarios.find(u => u.id === id);
    return user ? user.nome : '-';
  }

  getTipo(tipo: string) {
    const map: any = {
      0: 'Correção',
      1: 'Melhoria',
      2: 'Alteração'
    };
    return map[tipo] ?? '-';
  }

  onEdit(task: any) {

    if (this.version.statusVersao === 'Liberada') {
      alert('Versão já liberada não pode ser alterada');
      return;
    }
    this.editTask.emit(task);
  }

  onDelete(task: any) {
    if (this.version.statusVersao === 'Liberada') return;
    alert('Versão já liberada não pode ser alterada');
    this.deleteTask.emit(task);
  }
}
