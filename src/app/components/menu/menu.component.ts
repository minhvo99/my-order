import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuUploadComponent } from '../menu-upload/menu-upload.component';
import { ImageService } from '@app/services/imageService';
import { ImportsModule } from '@app/imports';
import { Mockdataservice } from '@app/services/mockdataservice';
import { defer, map, Observable, Subject, takeUntil } from 'rxjs';
import { TakePhotoComponent } from '../take-photo/take-photo.component';
import { ImageCropComponent } from '../image-cropper/image-cropper.component';
import { AnalyzeImageService } from '@app/services/analyzeImageService';
import { ToastService } from '@app/services/toastService';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import * as XLSX from 'xlsx';
import { MenuItem } from '@app/models/menu';
import { MenuCsvUploadComponent } from '../menu-csv-upload/menu-csv-upload.component';
import { MenuItemComponent } from '../menu-item/menu-item.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  imports: [
    CommonModule,
    ImportsModule,
    MenuUploadComponent,
    TakePhotoComponent,
    ImageCropComponent,
    MenuCsvUploadComponent,
    MenuItemComponent
  ],
  standalone: true,
})
export class MenuComponent implements OnInit {
  photoService = inject(ImageService);
  mockDataService = inject(Mockdataservice);
  menu = signal<any[]>([]);
  destroy$: Subject<void> = new Subject<void>();

  parsedData: any[] = [];
  excelFormat = ['csv', 'xls', 'xlsx'];
  imageFormat = ['jpg', 'jpeg', 'png', 'bmp', 'webp'];
  isLoading = false;
  resultAnalyze!: any;
  analyzeImageService = inject(AnalyzeImageService);
  toastService = inject(ToastService);
  sanitizer = inject(DomSanitizer);
  imageChangedEvent: Event | null = null;
  cropperImage: SafeUrl | any = '';
  previewImage: string | File | null = null;

  selectedImage: string | File | null = null;
  selectedFile: File | null = null;

  ngOnInit() {}

  startAnalyze() {
    if (!this.selectedImage) return;
    const formData = new FormData();
    formData.append('image', this.selectedImage);
    this.isLoading = true;

    this.analyzeImageService
      .analyzeImage(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.resultAnalyze = data;
          console.log(' this.resultAnalyze',  this.resultAnalyze);
          
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
          this.toastService.info('Failed to analyze image. Please try again.');
        },
        complete: () => (this.isLoading = false),
      });
  }
  cropImage() {
    this.imageChangedEvent = this.selectedImage as any;
  }

  readAsText$(file: File, encoding: string = 'utf-8'): Observable<string> {
    return new Observable<string>((observer) => {
      const reader = new FileReader();
      reader.onerror = (e) => observer.error(e);
      reader.onload = () => {
        observer.next(reader.result as string);
        observer.complete();
      };
      reader.readAsText(file, encoding);
      return () => reader.abort();
    });
  }
  readAsArrayBuffer$(file: File): Observable<ArrayBuffer> {
    return new Observable<ArrayBuffer>((observer) => {
      const reader = new FileReader();
      reader.onerror = (e) => observer.error(e);
      reader.onload = () => {
        observer.next(reader.result as ArrayBuffer);
        observer.complete();
      };
      reader.readAsArrayBuffer(file);
      return () => reader.abort();
    });
  }
  readSheetAsMatrix$(file: File): Observable<any[][]> {
    const name = file.name.toLowerCase();
    const ext = (name.split('.').pop() || '').trim();

    if (ext === 'csv') {
      // CSV: đọc text rồi parse bằng xlsx
      return defer(() => this.readAsText$(file)).pipe(
        map((text) => {
          const wb = XLSX.read(text, { type: 'string' });
          const ws = wb.Sheets[wb.SheetNames[0]];
          return XLSX.utils.sheet_to_json<any[]>(ws, {
            header: 1,
            defval: '',
          }) as any[][];
        }),
      );
    }

    if (ext === 'xls' || ext === 'xlsx') {
      // Excel: đọc ArrayBuffer rồi parse bằng xlsx
      return defer(() => this.readAsArrayBuffer$(file)).pipe(
        map((buf) => {
          const wb = XLSX.read(new Uint8Array(buf), { type: 'array' });
          const ws = wb.Sheets[wb.SheetNames[0]];
          return XLSX.utils.sheet_to_json<any[]>(ws, {
            header: 1,
            defval: '',
          }) as any[][];
        }),
      );
    }

    return new Observable<any[][]>((observer) => {
      observer.error(new Error(`Unsupported spreadsheet type: .${ext}`));
    });
  }
  parseMenuFile$(file: File): Observable<MenuItem[]> {
    return this.readSheetAsMatrix$(file).pipe(
      map((matrix) => {
        if (!matrix || matrix.length === 0) return [];
        const [, ...rows] = matrix; // bỏ header
        return rows
          .filter((row) => row && row.length)
          .map(
            (row: any[]) =>
              ({
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
              }) as MenuItem,
          );
      }),
    );
  }

  onFileChange(event: any) {
    this.parsedData = [];
    this.resultAnalyze = null;
    this.selectedImage = null;
    this.selectedFile = null;
    this.previewImage = null;
    const file = event.target.files[0];
    if (!file) return;

    const ext = (file.name.split('.').pop() || '').toLowerCase();

    if (this.excelFormat.includes(ext)) {
      this.parsedData = [];
      this.parseMenuFile$(file)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (items) => (this.parsedData = items),
          error: (err) => {
            console.error(err);
            this.toastService.info(err);
          },
        });
      return;
    }
    this.imageChangedEvent = event;
  }

  blobToFile(blob: Blob, fileName: string): File {
    return new File([blob], fileName, {
      type: blob.type,
      lastModified: Date.now(),
    });
  }

  croppedImage(event: any) {
    this.cropperImage = event;
  }
  confirmCrop() {
    this.imageChangedEvent = null;
    if (!this.cropperImage?.blob) return;
    this.selectedImage = this.blobToFile(this.cropperImage.blob, 'cropped.jpg');
    const reader = new FileReader();
    reader.onload = () => {
      this.previewImage = reader.result as string;
    };
    reader.readAsDataURL(this.cropperImage?.blob);
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.destroy$.next();
    this.destroy$.complete();
  }
}
