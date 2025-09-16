import { Component } from '@angular/core';
import { MenuItem } from 'src/constant/menuItem';
import { CommonModule } from '@angular/common';
import {
  IonList,
  IonItem,
  IonLabel,
  IonThumbnail,
  IonButton,
} from '@ionic/angular/standalone';

import * as XLSX from 'xlsx';

import {  Subject, takeUntil } from 'rxjs';
import { TranslateService } from '@app/services/translate';

@Component({
  selector: 'app-menu-upload',
  templateUrl: './menu-upload.component.html',
  styleUrls: ['./menu-upload.component.scss'],
  imports: [CommonModule, IonList, IonItem, IonLabel, IonThumbnail, IonButton],
  standalone: true,
})
export class MenuUploadComponent {
  parsedData: any[] = [];
  destroy$: Subject<void> = new Subject<void>();
  constructor(private translateService: TranslateService) {}
  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>evt.target;

    if (target.files.length !== 1) {
      console.log('Upload only 1 file at a time!');
      return;
    }

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      const data = <any[]>XLSX.utils.sheet_to_json(ws, { header: 1 });

      const [header, ...rows] = data;
      // rows.forEach((row: any[]) => {
      //   const baseName = row[1] || '';
      //   const baseDesc = row[4] || '';

      //   const item: MenuItem = {
      //     nameSet: {
      //       kr: { name: baseName, description: baseDesc },
      //       en: { name: '', description: '' },
      //       zh: { name: '', description: '' },
      //       ko: { name: '', description: '' },
      //       ja: { name: '', description: '' },
      //     },
      //     categoryID: row[0] || '',
      //     price_pickup: Number(row[2]) || 0,
      //     price_delivery: Number(row[2]) || 0,
      //     price_dinein: Number(row[2]) || 0,
      //     requirePrice: true,
      //     img: { path: '', url: row[5] || '' },
      //     imgthumb: { path: '', url: row[5] || '' },
      //     options: [],
      //     isActive: true,
      //   };

      //   this.translateService
      //     .translateToAll(baseName)
      //     .pipe(takeUntil(this.destroy$))
      //     .subscribe((nameTranslations) => {
      //       item.nameSet.en.name = nameTranslations.en;
      //       item.nameSet.zh.name = nameTranslations.zh;
      //       item.nameSet.ko.name = nameTranslations.ko;
      //       item.nameSet.ja.name = nameTranslations.ja;
      //     });

      //   this.translateService
      //     .translateToAll(baseDesc)
      //     .pipe(takeUntil(this.destroy$))
      //     .subscribe((descTranslations) => {
      //       item.nameSet.en.description = descTranslations.en;
      //       item.nameSet.zh.description = descTranslations.zh;
      //       item.nameSet.ko.description = descTranslations.ko;
      //       item.nameSet.ja.description = descTranslations.ja;
      //     });

      //   this.parsedData.push(item);
      // });
      
       this.parsedData = rows.map((row: any[]) => {
        return {
          nameSet: {
            kr: { name: row[1] || '', description: row[4] || '' },
            en: { name: row[1], description: row[4] || '' },
            zh: { name: row[1], description: row[4] || '' },
            ko: { name: row[1], description: row[4] || '' },
            ja: { name: row[1], description: row[4] || '' },
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
    };

    reader.readAsBinaryString(target.files[0]);
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
