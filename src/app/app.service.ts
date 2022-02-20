import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { contact } from './models/contact';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class AppService {
  GET_CONTACTS: string =
    'https://my-json-server.typicode.com/voramahavir/contacts-mock-response/contacts';

  constructor(private readonly http: HttpClient) {}

  getContacts() {
    return this.http
      .get<contact[]>(this.GET_CONTACTS, httpOptions)
      .pipe(catchError(this.handleError('getContacts()', [])));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      const pError = JSON.parse(error._body);
      console.error('handle error', error); // log to console instead
      if (error.status === 500 && pError.message === 'JWT Token is incorrect') {
        // this.auth.logout();
      }
      this.log(`${operation} failed: ${error.status}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  log(errMsg: string) {
    console.log(errMsg);
  }
}
