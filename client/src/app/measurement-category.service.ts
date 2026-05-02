import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MeasurementCategory } from './models/measurement-category.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MeasurementCategoryService {
  private apiUrl = `${environment.apiUrl}/measurement-categories`;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<MeasurementCategory[]> {
    return this.http.get<MeasurementCategory[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  createCategory(category: { name: string; unit: string }): Observable<MeasurementCategory> {
    return this.http.post<MeasurementCategory>(this.apiUrl, category)
      .pipe(catchError(this.handleError));
  }

  updateCategory(id: string, category: { name?: string; unit?: string }): Observable<MeasurementCategory> {
    return this.http.patch<MeasurementCategory>(`${this.apiUrl}/${id}`, category)
      .pipe(catchError(this.handleError));
  }

  deleteCategory(id: string): Observable<{ message: string }> {
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