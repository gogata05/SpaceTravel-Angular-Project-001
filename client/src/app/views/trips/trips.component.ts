import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription, switchMap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Trip } from 'src/app/interfaces/trip';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css']
})
export class TripsComponent implements OnInit, OnDestroy {
  constructor(private apiService: ApiService) { }

  trips!: Trip[];
  pages!: number;
  subscriptions: Subscription = new Subscription();
  isLoading: boolean = true;
  showPagination: boolean = false;

  ngOnInit(): void {
    const allTrips$ = this.apiService.getCount()(
      {
        next: (result) => {
          this.pages = result;
        },
        error: (error) => {
        }
      }
    );
    this.subscriptions.add(allTrips$);
  }


  currentPage$ = new BehaviorSubject<number>(1);

  currentPageTrips$ = this.currentPage$.pipe(
    switchMap((currentPage) => this.apiService.getTrips(currentPage))
  ).subscribe(
    {
      next: (result) => {
        this.trips = result;
      
        this.isLoading = false;
        this.showPagination = true;
        this.subscriptions.add(this.currentPageTrips$)
      },
      error: (error) => {
      }
    }
    )

  nextPage() {
    this.currentPage$.next(this.currentPage$.value + 1);
  }

  previousPage() {
    if (this.currentPage$.value > 1) {
      this.currentPage$.next(this.currentPage$.value - 1);
    }
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();    
    }
  }
  trackByFn(index: number, item: Trip): number {
    return Number(item._id); // for speed//delete later?
  }

}


