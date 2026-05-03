import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DailyList } from './models/daily-list.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DailyListService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    const baseUrl = (window as any).API_URL || environment.apiUrl;
    this.apiUrl = `${baseUrl}/daily-lists`;
  }

  getDailyList(): Observable<DailyList> {
    return this.http.get<DailyList>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  updateDailyList(dailyList: { categories: string[]; order?: number }): Observable<DailyList> {
    return this.http.put<DailyList>(this.apiUrl, dailyList)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (typeof ErrorEvent !== 'undefined' && error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error?.message || error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}