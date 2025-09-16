import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';

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

  translateMulti(text: string, sourceLang: string = 'auto'): Observable<any> {
    const targets = ['en', 'zh', 'ko', 'ja'];
    const requests = targets.map((lang) =>
      this.translateText(text, lang, sourceLang)
    );

    return forkJoin(requests);
  }
}
