import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ImageService } from 'src/app/services/image.service';
import { Trip } from 'src/app/interfaces/trip';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit, OnDestroy{
  constructor(private apiService: ApiService, private authService: AuthService, private imageService: ImageService) { }
  
  subscriptions: Subscription = new Subscription();
  user: User | undefined;
  userId!: string;
  pages!: number;
  userTrips$!: any;
  profilePic: any;
  isLoading: boolean = true
  showPagination: boolean = false
  currentPage$ = new BehaviorSubject<number>(1);

  ngOnInit(): void {
    const currentUser$ = this.authService.getUserInfo().subscribe({
      next: (userInfo) => {
        this.user = userInfo;
        this.userId = this.user._id;
        this.profilePic = this.imageService.getImageAsBase64(this.user.img.data.data);
        console.log(this.user._id);
        this.currentPage$.subscribe((currentPage) => {
          this.subscriptions.add(this.currentPage$);
          const currentUserTrips$ = this.apiService.getUserTrips(this.userId, currentPage).subscribe({
            next: (result) => {
              this.userTrips$ = result.userTrips;
              this.pages = result.pageCount;
              this.isLoading = false;
              result.userTrips.length > 0
              ? this.showPagination = true
              : this.showPagination = false;
            },
            error: (error) => {
              console.log(error.error.message);
            }
          });
          this.subscriptions.add(currentUserTrips$);
        }); // <- Missing closing parenthesis for the inner subscribe block
      },
      error: (error) => {
        console.log(error.error.message);
      }
    });
    this.subscriptions.add(currentUser$);
  }

  // currentPageTrips$ = this.currentPage$.pipe(
  //   switchMap((currentPage) => this.apiService.getUserTrips(this.userId, currentPage))
  // );

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
      console.log('unsubscribed');
      
    }
  }
}
