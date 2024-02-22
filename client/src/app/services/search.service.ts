import { Injectable } from '@angular/core';
import { Trip } from '../interfaces/trip';
import { ApiService } from './api.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(private apiService: ApiService) { }

  currentPage$ = new BehaviorSubject<number>(1);
  searchParam!: string;
  itemsPerPage: number = 6;
  searchResult: Trip[] = [];
  pages!: number;
    
  getSearch(): any {
    return this.apiService.getSearchResult(this.searchParam, this.currentPage$.value);
  }
}
