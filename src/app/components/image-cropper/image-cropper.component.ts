import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { ImportsModule } from '@app/imports';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss'],
  standalone: true,
  imports: [CommonModule, ImportsModule, ImageCropperComponent],
})
export class ImageCropComponent {
  maintainAspectRatio = false;
  croppedImages!: any[];
  showCropper = false;
  @Input() imageChangedEvent: Event | null = null;
  @Output() croppedImage = new EventEmitter<SafeUrl | any>();
  onFileChange(event: any) {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage.emit(event);
  }
  imageLoaded() {
    this.showCropper = true;
    console.log('Image loaded');
  }
  cropperReady() {
    console.log('Cropper ready');
  }
  loadImageFailed() {
    console.log('Load failed');
  }
}
