import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  api = 'http://localhost:3000';
  username: string;

  constructor(private http: HttpClient) {}

  // Returns all members
  getMembers() {
    return this.http
      .get(`${this.api}/members`)
      .pipe(catchError(this.handleError));
  }

  setUsername(name: string): void {
    this.username = name;
  }

  addMember(memberForm) {
    return this.http.post(`${this.api}/members`, memberForm).pipe(catchError(this.handleError));
    console.log("post");
  }

  getTeams() {
    return this.http
      .get(`${this.api}/teams`)
      .pipe(catchError(this.handleError));
  }

  getMembersByID(id: string) { 
    return this.http.get(`${this.api}/members/${id}`).pipe(catchError(this.handleError));
  }

  updateMember(memberForm) {
    return this.http.put(`${this.api}/members/${memberForm.id}`, memberForm).pipe(catchError(this.handleError));
  }

  deleteMember(memberId: number) {
    return this.http.delete(`${this.api}/members/` + memberId).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return [];
  }
}
