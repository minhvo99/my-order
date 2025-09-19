import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnalyzeImageService {
  private endpoint = environment.visionApi;
  constructor(private http: HttpClient) {}

  analyzeImage(formData: FormData): Observable<any> {
    return this.http
      .post<any>(`${this.endpoint}/vision/ocr/analyze-image`, formData)
      // .pipe(map((data) => data.result));
  }
  // analyzeImage(formData: FormData): Observable<any> {
  //   return this.http.post<any>(`${this.endpoint}/vision/ocr`, formData).pipe(map(data => data.result));
  // }
}
