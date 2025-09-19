import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ImportsModule } from '@app/imports';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
  standalone: true,
  imports: [ImportsModule, CommonModule],
})
export class MenuItemComponent {
  @Input() menus!: any;
}
