import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { AreaService } from '../../../core/services/area.service';
import { NotificationService } from '../../../core/services/notifications/notification.service';

@Component({
  selector: 'app-area-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './area-form.html',
  styleUrl: './area-form.scss',
})
export class AreaFormComponent implements OnInit {

  id?: number;
  form!: ReturnType<FormBuilder['group']>;
  private notify = inject(NotificationService);

  constructor(
    private fb: FormBuilder,
    private service: AreaService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      descricao: ['', Validators.required],
      ativo: [true]
    });
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.id = +idParam;

      this.service.getById(this.id).subscribe(area => {
        this.form.patchValue({
          descricao: area.descricao,
          ativo: area.ativo
        });
      });
    }
  }

  salvar() {
    // 🔥 validação
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      this.notify.error('Preencha os campos obrigatórios!');
      return;
    }

    const dto = this.form.getRawValue();

    if (this.id) {
      this.service.update(this.id, dto).subscribe({
        next: () => {
          this.notify.success('Área atualizada com sucesso!');
          this.voltar();
        },
        error: () => {
          this.notify.error('Erro ao atualizar área!');
        }
      });
    } else {
      this.service.create(dto).subscribe({
        next: () => {
          this.notify.success('Área cadastrada com sucesso!');
          this.voltar();
        },
        error: () => {
          this.notify.error('Erro ao cadastrar área!');
        }
      });
    }
  }

  voltar() {
    this.router.navigate(['/areas']);
  }
}
