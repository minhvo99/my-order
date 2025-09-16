import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TranslateService {
 private apiUrl = 'http://localhost:5000/translate';

  constructor(private http: HttpClient) {}

  translateText(
    text: string,
    targetLang: string,
    sourceLang: string = 'auto'
  ): Observable<any> {
    const body = {
      q: text,
      source: sourceLang,
      target: targetLang,
      format: 'text',
    };

    return this.http.post<any>(this.apiUrl, body);
  }

   translateToAll(text: string): Observable<{
    en: string;
    zh: string;
    ko: string;
    ja: string;
  }> {
    return forkJoin({
      en: this.translateText(text, 'en'),
      zh: this.translateText(text, 'zh'),
      ko: this.translateText(text, 'ko'),
      ja: this.translateText(text, 'ja')
    }).pipe(
      map(res => ({
        en: res.en.translatedText,
        zh: res.zh.translatedText,
        ko: res.ko.translatedText,
        ja: res.ja.translatedText
      }))
    );
  }
}
