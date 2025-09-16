import { Routes } from '@angular/router';
import { MenuComponent } from './menu.component';

export const routes: Routes = [
  {
    path: '',
    component: MenuComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../../components/menu/menu.component').then((m) => m.MenuComponent),
      },
      {
        path: '',
        redirectTo: '/',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/',
    pathMatch: 'full',
  },
];
