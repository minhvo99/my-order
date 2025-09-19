import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('../app/components/menu/menu.routes').then((m) => m.routes),
  },
];
