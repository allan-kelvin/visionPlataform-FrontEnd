import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout';

export const routes: Routes = [

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login')
        .then(m => m.LoginComponent)
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [

      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard/dashboard')
            .then(m => m.DashboardComponent)
      },

      //CLIENTE

      {
        path: 'clientes',
        loadComponent: () =>
          import('./features/clientes/cliente-list/cliente-list')
            .then(m => m.ClienteListComponent)
      },

      {
        path: 'clientes/novo',
        loadComponent: () =>
          import('./features/clientes/cliente-form/cliente-form')
            .then(m => m.ClienteFormComponent)
      },

      {
        path: 'clientes/:id',
        loadComponent: () =>
          import('./features/clientes/cliente-form/cliente-form')
            .then(m => m.ClienteFormComponent)
      },

      //AREA

      {
        path: 'areas',
        loadComponent: () =>
          import('./features/areas/area-list/area-list')
            .then(m => m.AreaListComponent)
      },
      {
        path: 'areas/nova',
        loadComponent: () =>
          import('./features/areas/area-form/area-form')
            .then(m => m.AreaFormComponent)
      },
      {
        path: 'areas/:id',
        loadComponent: () =>
          import('./features/areas/area-form/area-form')
            .then(m => m.AreaFormComponent)
      },

      //Users

      {
        path: 'usuarios',
        loadComponent: () =>
          import('./features/users/user-list/user-list')
            .then(m => m.UserListComponent)
      },

      {
        path: 'usuarios/novo',
        loadComponent: () =>
          import('./features/users/user-form/user-form')
            .then(m => m.UserFormComponent)
      },

      {
        path: 'usuarios/:id',
        loadComponent: () =>
          import('./features/users/user-form/user-form')
            .then(m => m.UserFormComponent)
      },

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];
