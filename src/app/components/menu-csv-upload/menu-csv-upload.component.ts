import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ImportsModule } from '@app/imports';
import { MenuItem } from '@app/models/menu';
import { IonBadge } from '@ionic/angular/standalone';

@Component({
  selector: 'app-menu-csv-upload',
  templateUrl: './menu-csv-upload.component.html',
  styleUrls: ['./menu-csv-upload.component.scss'],
  standalone: true,
  imports: [IonBadge, CommonModule, ImportsModule],
})
export class MenuCsvUploadComponent {
  @Input() data: MenuItem[] = [];
}
