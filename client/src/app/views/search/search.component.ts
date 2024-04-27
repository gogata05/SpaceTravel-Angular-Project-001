import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Trip } from 'src/app/interfaces/trip';
import { SearchService } from 'src/app/services/search.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit, OnDestroy {
  constructor(public searchService: SearchService, private apiService: ApiService) { }
  
  subscriptions: Subscription = new Subscription();

  ngOnInit() {//init method for search
    const results$ = this.searchService.currentPage$.subscribe((currentPage) => {
      console.log(this.searchService.currentPage$);
       this.searchService.getSearch().subscribe({
        next: (trips: Trip[]) => {
          this.searchService.searchResult = trips;
          console.log(trips);
        },
        error: (error: { error: { message: any; }; }) => {
          console.log(error.error.message);
        }
      });
    });
    this.subscriptions.add(results$);
  }

  //pagination
  nextPage() {
    this.searchService.currentPage$.next(this.searchService.currentPage$.value + 1);
  }

  previousPage() {
    if (this.searchService.currentPage$.value > 1) {
      this.searchService.currentPage$.next(this.searchService.currentPage$.value - 1);
    }
  }

  ngOnDestroy(): void {//method for unsubscribed
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
      console.log('unsubscribed');
      
    }
  }
}
