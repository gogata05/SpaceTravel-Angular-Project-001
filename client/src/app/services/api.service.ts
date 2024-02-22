import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Trip } from '../interfaces/trip';
import { Post } from '../interfaces/post';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }
  appUrl = environment.appUrl;

  getCount() {
    return this.http.get<number>(`${this.appUrl}/trips/count`);
  }

  getTrips(page: number) {
    return this.http.get<Trip[]>(`${this.appUrl}/trips?page=${page}`);
  }

  getRecentTrips() {
    return this.http.get<Trip[]>(`${this.appUrl}/trips/recent`);
  }

  getDetails(id: any) {
    return this.http.get<any>(`${this.appUrl}/trips/${id}`);
  }

  getUserTrips(userId: string, page: number): Observable<any> {
    return this.http.get<any>(`${this.appUrl}/trips?where=_ownerId%3D%22${userId}%22&page=${page}`);
  }

  create(body: Trip) {
    return this.http.post<Trip>(`${this.appUrl}/trips`, body);
  }

  edit(id: string, body: Trip) {
    return this.http.put<any>(`${this.appUrl}/trips/${id}`, body);
  }

  deleteByTripId(id: string) {
    return this.http.delete<any>(`${this.appUrl}/trips/${id}`);
  }

  getSearchCount(searchParam: string) {
    return this.http.get<number>(`${this.appUrl}/trips/search?searchParam=${searchParam}`);
  }

  getSearchResult(searchParam: string, page: number) {
    return this.http.post<Trip[]>(`${this.appUrl}/trips/search`, {searchParam, page});
  }

  addComment(id: string, comment: FormData) {
    return this.http.post<any>(`${this.appUrl}/trips/${id}/comments`, comment);
  }

  addLike(id: string) {
    return this.http.get<Trip>(`${this.appUrl}/trips/${id}/likes`);
  }

  downloadImage(id: string) {
    return this.http.get<Trip>(`${this.appUrl}/trips/${id}/downloads`);
  }
}
