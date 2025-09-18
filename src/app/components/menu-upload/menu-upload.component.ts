import { Component, inject } from '@angular/core';
import * as XLSX from 'xlsx';
import { Subject, takeUntil } from 'rxjs';
import { MenuItem } from '@app/models/menu';
import { AnalyzeImageService } from '@app/services/analyzeImageService';
import { ImportsModule } from '@app/imports';
import { CommonModule } from '@angular/common';
import { ToastService } from '@app/services/toastService';
import { ImageCropperComponent, ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-menu-upload',
  templateUrl: './menu-upload.component.html',
  styleUrls: ['./menu-upload.component.scss'],
  imports: [ImportsModule, CommonModule,ImageCropperComponent],
  standalone: true,
})
export class MenuUploadComponent {
   imageChangedEvent: Event | null = null;
  croppedImage: SafeUrl | any = '';
  parsedData: any[] = [];
  excelFormat = ['csv', 'xls', 'xlsx'];
  imageFormat = ['jpg', 'jpeg', 'png', 'bmp', 'webp'];
  isLoading = false;
  resultAnalyze!: any;
  destroy$: Subject<void> = new Subject<void>();
  selectedImage: string | ArrayBuffer | null = null;
  analyzeImageService = inject(AnalyzeImageService);

  scaleX = 1;
  scaleY = 1;
  transform: any = {};
  toastService = inject(ToastService);
  sanitizer = inject(DomSanitizer)
  onFileChange(event: any) {
    this.parsedData = [];
    this.resultAnalyze = null;
    this.selectedImage = null;
    this.imageChangedEvent = event;

    const file: File = event.target.files[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();

    if (this.excelFormat.includes(ext!)) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        const data = <any[]>XLSX.utils.sheet_to_json(ws, { header: 1 });
        const [header, ...rows] = data;

        this.parsedData = rows.map((row: any[]) => {
          return {
            nameSet: {
              kr: { name: row[1] || '', description: row[4] || '' },
              en: { name: row[1] || '', description: row[4] || '' },
              zh: { name: '', description: '' },
              ko: { name: '', description: '' },
              ja: { name: '', description: '' },
            },
            categoryID: row[0] || '',
            price_pickup: Number(row[2]) || 0,
            price_delivery: Number(row[2]) || 0,
            price_dinein: Number(row[2]) || 0,
            requirePrice: true,
            img: { path: '', url: row[5] || '' },
            imgthumb: { path: '', url: row[5] || '' },
            options: [],
            isActive: true,
          } as MenuItem;
        });

        console.log('Parsed CSV/Excel:', this.parsedData);
      };

      reader.readAsDataURL(file);
    } else if (this.imageFormat.includes(ext!)) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          this.selectedImage = reader.result;
        };
        reader.readAsDataURL(file);
      }
      const formData = new FormData();
      formData.append('image', file);
      // this.isLoading = true;

      // this.analyzeImageService
      //   .analyzeImage(formData)
      //   .pipe(takeUntil(this.destroy$))
      //   .subscribe({
      //     next: (data) => {
      //       this.resultAnalyze = data;
      //     },
      //     error: (err) => {
      //       console.log(err);
      //       this.isLoading = false;
      //       this.toastService.info(
      //         'Failed to analyze image. Please try again.'
      //       );
      //     },
      //     complete: () => (this.isLoading = false),
      //   });
    } else return;
  }
    imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl as string);
      // event.blob can be used to upload the cropped image
    }


  imageLoaded(image: LoadedImage) {
    console.log('Image loaded', image);
  }

  cropperReady() {
    console.log('Cropper ready');
  }

  loadImageFailed() {
    console.error('Load failed');
  }

  rotateLeft() {
    this.transform = { ...this.transform, rotate: (this.transform.rotate || 0) - 90 };
  }

  rotateRight() {
    this.transform = { ...this.transform, rotate: (this.transform.rotate || 0) + 90 };
  }

  flipHorizontal() {
    this.scaleX = this.scaleX * -1;
    this.transform = { ...this.transform, flipH: this.scaleX === -1 };
  }

  flipVertical() {
    this.scaleY = this.scaleY * -1;
    this.transform = { ...this.transform, flipV: this.scaleY === -1 };
  }

  confirmCrop() {
    this.selectedImage = this.croppedImage; // Lưu vào preview
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
