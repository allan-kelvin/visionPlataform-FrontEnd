import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from '../../../core/models/role.model';
import { RoleService } from '../../../core/services/role.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(UserService);
  private roleService = inject(RoleService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  roles: Role[] = [];

  isEdit = false;
  userId?: number;

  form = this.fb.nonNullable.group({
    nome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    senha: [''],
    confirmarSenha: [''],
    roleId: [0, Validators.required],
    ativo: [true]
  });

  ngOnInit(): void {
    this.loadRoles();

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEdit = true;
      this.userId = +id;
      this.loadUser(this.userId);
    }
  }

  loadRoles() {
    this.roleService.getAll().subscribe({
      next: (roles) => {
        this.roles = roles;
        console.log('Roles carregadas:', this.roles);
      },
      error: (err) => console.error(err)
    });
  }

  loadUser(id: number) {
    this.service.getById(id).subscribe(user => {
      this.form.patchValue({
        nome: user.nome,
        email: user.email,
        roleId: user.roleId,
        ativo: user.ativo
      });
    });
  }

  salvar() {
    if (this.form.invalid) return;

    const dto = this.form.getRawValue();

    if (this.isEdit && this.userId) {
      this.service.update(this.userId, dto).subscribe(() => {
        this.router.navigate(['/usuarios']);
      });
    } else {
      this.service.create(dto).subscribe(() => {
        this.router.navigate(['/usuarios']);
      });
    }
  }

  voltar() {
    this.router.navigate(['/usuarios']);
  }
}
