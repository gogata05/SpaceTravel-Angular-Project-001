import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Trip } from 'src/app/interfaces/trip';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(private apiService: ApiService, private router: Router) { }

  recentTrips!: Trip[];
  subscriptions: Subscription = new Subscription();
  
  ngOnInit(): void {
    const trips$ = this.apiService.getRecentTrips().subscribe(
      {
        next: (trips) => {
          this.recentTrips = trips;//recentTrips added
          console.log(this.recentTrips);
        },
        error: (error) => {
          console.log(error.error.message);
        }
      }
    );
    this.subscriptions.add(trips$);
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
      console.log('unsubscribed');
      
    }
  }
}
