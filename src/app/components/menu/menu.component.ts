import { Component, OnInit } from '@angular/core';
import { IonContent, IonIcon, IonItem, IonList } from '@ionic/angular/standalone';
import { IonButton } from '@ionic/angular/standalone';

import {
  IonCol,
  IonGrid,
  IonRow,
  IonImg,
  IonSelect, IonSelectOption
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';


import { MenuUploadComponent } from '../menu-upload/menu-upload.component';
import { TranslateService } from '@app/services/translate';
import { ImageService } from '@app/services/imageService';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  imports: [IonList, IonItem, 
    CommonModule,
    IonContent,
    IonIcon,
    IonButton,
    IonCol,
    IonGrid,
    IonRow,
    IonImg,
    MenuUploadComponent,
    IonSelect, IonSelectOption
  ],
  providers: [TranslateService],
  standalone: true,
})
export class MenuComponent implements OnInit {
  constructor(
    public photoService: ImageService,
  ) {}

  ngOnInit() {}

  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }
}
