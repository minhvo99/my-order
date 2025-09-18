import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuUploadComponent } from '../menu-upload/menu-upload.component';
import { ImageService } from '@app/services/imageService';
import { ImportsModule } from '@app/imports';
import { Mockdataservice } from '@app/services/mockdataservice';
import { Subject, takeUntil } from 'rxjs';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { TakePhotoComponent } from "../take-photo/take-photo.component";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  imports: [
    CommonModule,
    ImportsModule,
    MenuUploadComponent,
    TakePhotoComponent
],
  standalone: true,
})
export class MenuComponent implements OnInit {
  photoService = inject(ImageService)
  mockDataService = inject(Mockdataservice)
  menu = signal<any[]>([]);
  destroy$: Subject<void> = new Subject<void>();

  ngOnInit() {

  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.destroy$.next();
    this.destroy$.complete();
  }
}
