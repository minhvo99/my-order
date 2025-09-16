import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { IonButton } from '@ionic/angular/standalone';
import { ImageService } from '../services/imageService';
import {
  IonCol,
  IonGrid,
  IonRow,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonThumbnail,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

import { TranslateService } from '../services/translate';
import { MenuUploadComponent } from '../menu-upload/menu-upload.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  imports: [
    CommonModule,
    IonContent,
    IonIcon,
    IonButton,
    IonCol,
    IonGrid,
    IonRow,
    IonImg,
    IonItem,
    IonLabel,
    IonList,
    IonThumbnail,
    MenuUploadComponent,
  ],
  providers: [TranslateService],
  standalone: true,
})
export class MenuComponent implements OnInit {
  constructor(
    public photoService: ImageService,
  ) {}

  async ngOnInit() {
    await this.photoService.loadSaved();
  }

  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }
}
