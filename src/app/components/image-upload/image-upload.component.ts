import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ImportsModule } from '@app/imports';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
  standalone: true,
  imports: [CommonModule, ImportsModule],
})
export class ImageUploadComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  onFileChange(event: any) {}
}
