import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { AreaService } from '../../../../core/services/area.service';
import { ClienteService } from '../../../../core/services/cliente.service';
import { UserService } from '../../../../core/services/user.service';
import { VersionTaskService } from '../../../../core/services/versions/version-task.service';

@Component({
  selector: 'app-task-modal',
  imports: [CommonModule, ReactiveFormsModule, MatSlideToggleModule],
  templateUrl: './task-modal.html',
  styleUrl: './task-modal.scss',
})
export class TaskModalComponent implements OnInit {

  private fb = inject(FormBuilder);
  private taskService = inject(VersionTaskService);

  private clientService = inject(ClienteService);
  private areaService = inject(AreaService);
  private userService = inject(UserService);

  private dialogRef = inject(MatDialogRef<TaskModalComponent>);
  public data = inject(MAT_DIALOG_DATA);

  clientes: any[] = [];
  areas: any[] = [];
  usuarios: any[] = [];

  form = this.fb.group({

    azureTaskId: ['', Validators.required],

    azureTaskUrl: ['', Validators.required],

    titulo: ['', Validators.required],

    clienteId: ['', Validators.required],

    areaId: ['', Validators.required],

    tipo: ['', Validators.required],

    statusPlanejamento: ['Planejado', Validators.required],

    qaUserId: [''],

    mergeRealizado: [false],

    dataMerge: [''],

    possuiScript: [false],

    descricaoScript: [''],

    possuiTagVersao: [false],

    tagVersao: ['']

  });

  ngOnInit() {

    this.clientService.getAll().subscribe(res => this.clientes = res);
    this.areaService.getAll().subscribe(res => this.areas = res);
    this.userService.getAll().subscribe(res => this.usuarios = res);

    /* geração automática da URL Azure */

    this.form.get('azureTaskId')?.valueChanges.subscribe(id => {

      if (!id) return;

      const url =
        `https://dev.azure.com/datasystemsoftwares/USE/_workitems/edit/${id}`;

      this.form.patchValue({
        azureTaskUrl: url
      });

    });

    /* geração automática da tag */

    if (this.data?.version) {

      const numero = Math.floor(Math.random() * 20);

      this.form.patchValue({
        tagVersao: `${this.data.version}-${numero}`
      });

    }

  }

  salvar() {

    if (this.form.invalid) return;

    const formValue = this.form.value;

    const payload = {

      versionId: Number(this.data.versionId),

      azureTaskId: Number(formValue.azureTaskId),

      azureTaskUrl: formValue.azureTaskUrl ?? '',

      titulo: formValue.titulo ?? '',

      clienteId: Number(formValue.clienteId),

      areaId: Number(formValue.areaId),

      tipo: this.mapTipo(formValue.tipo ?? null),
      statusPlanejamento: this.mapStatus(formValue.statusPlanejamento ?? null),

      qaUserId: formValue.qaUserId
        ? Number(formValue.qaUserId)
        : null

    };

    this.taskService.create(payload).subscribe({

      next: () => {

        this.dialogRef.close(true);

      },

      error: (err) => {

        console.error("Erro API:", err.error);

      }

    });

  }

  fechar() {

    this.dialogRef.close();

  }

  abrirAzure() {

    const url = this.form.value.azureTaskUrl;

    if (url) {
      window.open(url, '_blank');
    }

  }

  getTipo(tipo: string) {

    const map: any = {
      Correcao: 'Correção',
      Melhoria: 'Melhoria',
      Alteracao: 'Alteração'
    };

    return map[tipo] ?? tipo;

  }

  /* ================================
     MAPEAMENTO ENUMS
     ================================ */

  mapTipo(tipo: string | null) {

    const map: any = {

      Correcao: 0,
      Melhoria: 1,
      Alteracao: 2

    };

    return map[tipo ?? 'Correcao'];

  }

  mapStatus(status: string | null) {

    const map: any = {

      Planejado: 0,
      Desejavel: 1,
      Confirmado: 2

    };

    return map[status ?? 'Planejado'];

  }

}
