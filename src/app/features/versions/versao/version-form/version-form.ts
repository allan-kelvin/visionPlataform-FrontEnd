import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VersionService } from '../../../../core/services/versions/version.service';

@Component({
  selector: 'app-version-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './version-form.html',
  styleUrl: './version-form.scss',
})
export class VersionFormComponent {

  private fb = inject(FormBuilder);
  private service = inject(VersionService);
  private router = inject(Router);
  private route = inject(ActivatedRoute)

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

    if (this.form.invalid) return;

    const payload = this.form.value;

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {

      this.service.update(Number(id), payload)
        .subscribe(() => {

          this.router.navigate(['/versions']);

        });

    } else {

      this.service.create(payload)
        .subscribe(() => {

          this.router.navigate(['/versions']);

        });

    }

  }

  cancelar() {
    this.router.navigate(['/versions']);
  }
}
