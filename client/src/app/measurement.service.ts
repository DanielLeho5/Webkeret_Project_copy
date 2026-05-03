import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Measurement } from './models/measurement.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MeasurementService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    const baseUrl = (window as any).API_URL || environment.apiUrl;
    this.apiUrl = `${baseUrl}/measurements`;
  }

  getMeasurements(categoryId?: string, startDate?: string, endDate?: string): Observable<Measurement[]> {
    let params = new HttpParams();
    if (categoryId) params = params.set('categoryId', categoryId);
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get<Measurement[]>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  createMeasurement(measurement: { categoryId: string; value: number; date: string; unit: string }): Observable<Measurement> {
    return this.http.post<Measurement>(this.apiUrl, measurement)
      .pipe(catchError(this.handleError));
  }

  updateMeasurement(id: string, measurement: { categoryId?: string; value?: number; date?: string }): Observable<Measurement> {
    return this.http.patch<Measurement>(`${this.apiUrl}/${id}`, measurement)
      .pipe(catchError(this.handleError));
  }

  deleteMeasurement(id: string): Observable<{ message: string }> {
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