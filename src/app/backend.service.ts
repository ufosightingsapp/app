import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private API_LOCATION: string = 'https://api.ufosightings.app';
  private API_KEY: string = 'a8w9dzahAa8d';

  constructor(private http: HttpClient) {}

  public defaultHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  public buildUrl(url: string): string {
    if (url.indexOf('http') === -1) {
      url = `${this.API_LOCATION}${url}`;
    }

    if (url.indexOf('api_key=') !== -1) {
      return url;
    }

    if (url.indexOf('?') !== -1) {
      return `${url}&api_key=${this.API_KEY}`;
    }

    return `${url}?api_key=${this.API_KEY}`;
  }

  getJSON(url: string): Observable<any> {
    url = this.buildUrl(url);
    return this.http
      .get(url, {
        headers: this.defaultHeaders,
      })
      .pipe(
        tap((_) => {}),
        catchError(this.handleError<any>('getJSON', null, url))
      );
  }

  getText(url: string): Observable<any> {
    url = this.buildUrl(url);
    return this.http
      .get(url, {
        headers: new HttpHeaders({ 'Content-Type': 'text/plain' }),
        responseType: 'text',
      })
      .pipe(
        tap((_) => {}),
        catchError(this.handleError<any>('getText', null, url))
      );
  }

  post(url: string, data: any, options: any): Observable<any> {
    url = this.buildUrl(url);

    if (options == null) {
      options = {
        headers: this.defaultHeaders,
      };
    }

    return this.http.post(url, data, options).pipe(
      tap((_) => {}),
      catchError(this.handleError<any>('post', null, url, data, options))
    );
  }

  logTimeout: any = null;
  log(message: string, type: string, namespace: string) {
    let data = {
      message: message,
      type: type,
      namespace: namespace,
      device: 'app',
    };
    clearTimeout(this.logTimeout);
    this.logTimeout = setTimeout(() => {
      this.post('/log', data, null).subscribe((_) => {});
    }, 1000);
  }

  upload(files: any): Observable<any> {
    let url = this.buildUrl('/upload');
    let formData: FormData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i], files[i].name);
    }

    return this.http.post(`${url}`, formData); //.pipe(
    //   tap((_) => {}),
    //   catchError(this.handleError<any>('post'))
    //);
  }

  private handleError<T>(
    operation = 'operation',
    result?: T,
    url?: String,
    data?: any,
    ...args: any[]
  ) {
    return (error: any): Observable<T> => {
      this.log(
        `${operation} failed: ${error.message}`,
        'error',
        'backendService'
      );
      return of(result as T);
    };
  }
}
