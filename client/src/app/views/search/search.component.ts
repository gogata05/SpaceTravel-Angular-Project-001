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

  ngOnInit() {
    const results = this.searchService.currentPage$.subscribe((currentPage) => {
       this.searchService.getSearch().subscribe({
        next: (trips: Trip[]) => {
          this.searchService.searchResult = trips;
        },
        error: (error: { error: { message: any; }; }) => {
        }
      });
    });
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
      console.log('unsubscribed');
      
    }
  }

}
