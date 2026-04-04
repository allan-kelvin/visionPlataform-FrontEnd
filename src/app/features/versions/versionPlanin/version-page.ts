import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { VersionTask } from '../../../core/models/version-task.model';
import { Version } from '../../../core/models/version.model';
import { VersionTaskService } from '../../../core/services/versions/version-task.service';
import { VersionService } from '../../../core/services/versions/version.service';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog';
import { TaskModalComponent } from '../components/task-modal/task-modal';
import { VersionDetailsComponent } from '../components/version-details/version-details';
import { VersionTasksComponent } from '../components/version-tasks/version-tasks';
import { UserService } from './../../../core/services/user.service';

@Component({
  selector: 'app-version-page',
  imports: [CommonModule,
    FormsModule,
    VersionDetailsComponent,
    VersionTasksComponent],
  templateUrl: './version-page.html',
  styleUrl: './version-page.scss',
})

export class VersionPageComponent implements OnInit {

  private versionService = inject(VersionService);
  private taskService = inject(VersionTaskService);
  private dialog = inject(MatDialog);
  private userService = inject(UserService);

  versions: Version[] = [];
  filteredVersions: Version[] = [];
  selectedVersion: Version | null = null;

  tasks: VersionTask[] = [];

  search = '';
  startDate!: string;
  endDate!: string;

  usuarios: any[] = [];

  // ===============================
  // ENUM MAPS
  // ===============================

  getTipo(tipo: string) {

    const map: any = {
      0: 'Correção',
      1: 'Melhoria',
      2: 'Alteração'
    };

    return map[tipo] ?? '-';

  }

  getStatus(status: number) {

    const map: any = {
      0: 'Planejado',
      1: 'Desejável',
      2: 'Confirmado'
    };

    return map[status] ?? '-';

  }

  // ===============================
  // INIT
  // ===============================

  ngOnInit() {

    const today = new Date();
    const past = new Date();

    past.setDate(today.getDate() - 30);

    this.endDate = today.toISOString().substring(0, 10);
    this.startDate = past.toISOString().substring(0, 10);

    this.loadVersions();

    this.userService.getAll().subscribe(res => {
      this.usuarios = res;
      this.tasks = [...this.tasks];
    });

  }

  getQaNome(id: number | null) {
    if (!id) return '-';

    const user = this.usuarios.find(u => Number(u.id) === Number(id));

    return user ? user.nome : '-';
  }



  // ===============================
  // LOAD VERSIONS
  // ===============================

  loadVersions() {

    this.versionService.getAll().subscribe((res: Version[]) => {

      this.versions = res;

      this.applyFilters();

      if (this.filteredVersions.length > 0) {

        this.selectVersion(this.filteredVersions[0]);

      }

    });

  }

  // ===============================
  // LOAD TASKS
  // ===============================

  carregarTarefas() {

    if (!this.selectedVersion) return;

    this.taskService
      .getByVersion(this.selectedVersion.id)
      .subscribe(res => {

        this.tasks = res;

        this.calcularProgresso(this.selectedVersion!, res);

      });

  }

  // ===============================
  // CALCULAR PROGRESSO
  // ===============================

  calcularProgresso(version: Version, tasks: VersionTask[]) {

    const total = tasks.length;

    const confirmadas = tasks.filter(
      t => t.statusPlanejamento === 'Confirmado'
    ).length;

    const desejaveis = tasks.filter(
      t => t.statusPlanejamento === 'Desejavel'
    ).length;

    const planejadas = tasks.filter(
      t => t.statusPlanejamento === 'Planejado'
    ).length;

    version.totalTarefas = total;

    version.confirmadas = confirmadas;
    version.desejaveis = desejaveis;
    version.planejadas = planejadas;

    version.percentualConclusao =
      total > 0 ? Math.round((confirmadas / total) * 100) : 0;

  }
  // ===============================
  // FILTROS
  // ===============================

  applyFilters() {

    this.filteredVersions = this.versions.filter(v => {

      const searchMatch =
        !this.search ||
        v.numeroVersao.toLowerCase().includes(this.search.toLowerCase());

      const versionDate = v.dataPrevistaLiberacao
        ? new Date(v.dataPrevistaLiberacao)
        : null;

      const start = new Date(this.startDate);
      const end = new Date(this.endDate);

      const dateMatch =
        !versionDate ||
        (versionDate >= start && versionDate <= end);

      return searchMatch && dateMatch;

    });

  }

  // ===============================
  // SELECT VERSION
  // ===============================

  selectVersion(version: Version) {

    this.selectedVersion = version;

    this.taskService.getByVersion(version.id).subscribe(tasks => {

      this.tasks = tasks;

      this.calcularProgresso(version, tasks);
    });

  }
  // ===============================
  // ATUALIZAR
  // ===============================

  atualizar() {

    this.loadVersions();

  }

  // ===============================
  // MODAL NOVA TAREFA
  // ===============================

  abrirModal() {

    const dialogRef = this.dialog.open(TaskModalComponent, {

      width: '720px',

      data: {
        versionId: this.selectedVersion?.id,
        version: this.selectedVersion?.numeroVersao
      }

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.carregarTarefas();
      }
    });
  }

  //Editar || Excluir

  editarTask(task: any) {

    const dialogRef = this.dialog.open(TaskModalComponent, {
      width: '720px',
      data: {
        versionId: this.selectedVersion?.id,
        version: this.selectedVersion?.numeroVersao,
        task: task // 🔥 AQUI É O SEGREDO
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.carregarTarefas();
      }
    });

  }
  excluirTask(task: any) {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      panelClass: 'dialog-dark',
      data:
      {
        title: 'Excluir tarefa',
        message: 'Deseja Realmente Excluir essa tarefa',
        confirmText: 'Excluir',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {

      if (result) {

        this.taskService.delete(task.id)
          .subscribe(() => {
            this.carregarTarefas();
          });

      }

    });
  }
}
