import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DailyFoodList } from './models/daily-food-list.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DailyFoodListService {
  private apiUrl = `${environment.apiUrl}/daily-food-lists`;

  constructor(private http: HttpClient) {}

  getDailyFoodLists(startDate?: string, endDate?: string): Observable<DailyFoodList[]> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get<DailyFoodList[]>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  createDailyFoodList(dailyFoodList: { date: string; foods: any[] }): Observable<DailyFoodList> {
    return this.http.post<DailyFoodList>(this.apiUrl, dailyFoodList)
      .pipe(catchError(this.handleError));
  }

  updateDailyFoodList(id: string, dailyFoodList: { date?: string; foods?: any[] }): Observable<DailyFoodList> {
    return this.http.patch<DailyFoodList>(`${this.apiUrl}/${id}`, dailyFoodList)
      .pipe(catchError(this.handleError));
  }

  deleteDailyFoodList(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`)
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