import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ImportsModule } from '@app/imports';
import { ImageService } from '@app/services/imageService';

@Component({
  selector: 'app-take-photo',
  templateUrl: './take-photo.component.html',
  styleUrls: ['./take-photo.component.scss'],
  standalone: true,
  imports: [CommonModule, ImportsModule],
})
export class TakePhotoComponent implements OnInit {
  photoService = inject(ImageService);

  async ngOnInit() {
    await this.photoService.loadSaved();
  }
  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }
}
