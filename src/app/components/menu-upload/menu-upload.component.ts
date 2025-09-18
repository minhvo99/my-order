import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { Subject, takeUntil } from 'rxjs';
import { MenuItem } from '@app/models/menu';
import { VisionServices } from '@app/services/vision';
import { ImportsModule } from '@app/imports';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-upload',
  templateUrl: './menu-upload.component.html',
  styleUrls: ['./menu-upload.component.scss'],
  imports: [ ImportsModule, CommonModule],
  standalone: true,
})
export class MenuUploadComponent {
  parsedData: any[] = [];
  excelFormat = ['csv', 'xls', 'xlsx'];
  imageFormat = ['jpg', 'jpeg', 'png', 'bmp', 'webp'];
  isLoading = false;
  resultAnalyze!: any;
  destroy$: Subject<void> = new Subject<void>();
  selectedImage: string | ArrayBuffer | null = null;
  constructor(private visionService: VisionServices) {}
  onFileChange(event: any) {
    this.parsedData = [];
    this.resultAnalyze = null;
    this.selectedImage = null;

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
      reader.readAsBinaryString(file);
    } else if (this.imageFormat.includes(ext!)) {
      const formData = new FormData();
      formData.append('image', file);
       this.isLoading = true;

      this.visionService
        .analyzeImage(formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            this.resultAnalyze = data;
            if (file.type.startsWith('image/')) {
              const reader = new FileReader();
              reader.onload = () => {
                this.selectedImage = reader.result;
              };
              reader.readAsDataURL(file);
            }
          },
          error: (err) => {
            console.log(err);
            this.isLoading = false
          },
          complete: () => (this.isLoading = false),
        });
    } else {
      console.log('error');
      return;
    }
  }

  downloadJson() {
    const jsonStr = JSON.stringify(this.parsedData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'menu.json';
    a.click();

    window.URL.revokeObjectURL(url);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
