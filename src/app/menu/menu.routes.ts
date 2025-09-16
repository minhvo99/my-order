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
          import('../menu/menu.component').then((m) => m.MenuComponent),
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
