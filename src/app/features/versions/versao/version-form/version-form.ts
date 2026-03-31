import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../../core/services/notifications/notification.service';
import { VersionService } from '../../../../core/services/versions/version.service';

@Component({
  selector: 'app-version-form',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './version-form.html',
  styleUrl: './version-form.scss',
})
export class VersionFormComponent {

  private fb = inject(FormBuilder);
  private service = inject(VersionService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private notify = inject(NotificationService);

  form = this.fb.group({

    numeroVersao: ['', Validators.required],

    statusVersao: ['Planejamento', Validators.required],

    dataLimiteTarefas: ['', Validators.required],

    dataPrevistaLiberacao: ['', Validators.required],

    observacoes: ['']

  });

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {

      this.service.getById(Number(id))
        .subscribe(v => {

          this.form.patchValue(v);

        });

    }

  }

  salvar() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();

      this.notify.error('Preencha todos os campos obrigatórios!');
      return;
    }

    const payload = this.form.getRawValue();

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.service.update(Number(id), payload).subscribe({
        next: () => {
          this.notify.success('Versão atualizada com sucesso!');
          this.router.navigate(['/versions']);
        },
        error: () => {
          this.notify.error('Erro ao atualizar versão!');
        }
      });
    } else {
      this.service.create(payload).subscribe({
        next: () => {
          this.notify.success('Versão cadastrada com sucesso!');
          this.router.navigate(['/versions']);
        },
        error: () => {
          this.notify.error('Erro ao cadastrar versão!');
        }
      });
    }

  }
  cancelar() {
    this.router.navigate(['/versions']);
  }

  voltar() {
    this.router.navigate(['/versions']);
  }
}
