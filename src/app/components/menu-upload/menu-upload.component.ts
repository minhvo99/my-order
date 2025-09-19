import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { ImportsModule } from '@app/imports';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-upload',
  templateUrl: './menu-upload.component.html',
  styleUrls: ['./menu-upload.component.scss'],
  imports: [ImportsModule, CommonModule],
  standalone: true,
})
export class MenuUploadComponent {
  isLoading = false;
  @Output() imageChangedEvent = new EventEmitter<File | null>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileChange(event: any) {
    this.imageChangedEvent.emit(event);
  }
}
