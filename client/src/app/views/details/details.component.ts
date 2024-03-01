import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Trip } from 'src/app/interfaces/trip';
import { SessionService } from 'src/app/services/session.service';
import { User } from 'src/app/interfaces/user';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import * as moment from 'moment';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  constructor(private apiService: ApiService, private router: Router, private activatedRoute: ActivatedRoute, private sessionService: SessionService, private authService: AuthService) { }
  

  get isLoggedIn(): boolean {
    return this.sessionService.hasUser;
  }

  trip: any;
  //trip!: Trip | null;
  subscriptions: Subscription = new Subscription();
  user!: User | null;
  avatar: string | undefined;
  image: string | undefined;
  isOwner: Boolean = false;
  tripId!: string;
  isShown: boolean = false;
  isLoading: boolean = true;
  showComments: boolean = false;
  name!: string;//?
  isLiked: boolean = false;

  ngOnInit(): void {
    this.user = this.sessionService.getUserData();

    if (this.user) {
      const currentUser$ = this.authService.getUserInfo().subscribe(
        {
          next: (userInfo) => {
            this.user = userInfo;
          },
          error: (error) => {
            console.log(error.error.message);
          }
        }
      );
      this.subscriptions.add(currentUser$);
    }
    
    this.tripId = this.activatedRoute.snapshot.params['tripId'];

    const currentLog$ = this.apiService.getDetails(this.tripId).subscribe(
      {
        next: (result) => {
          this.trip = result;
          this.trip.startDate = moment(this.trip.startDate).format('DD/MM/YYYY');
          this.trip.endDate = moment(this.trip.endDate).format('DD/MM/YYYY');
          this.isLoading = !this.isLoading;
          this.avatar = this.getImageAsBase64(this.trip?._ownerId.img.data.data);
          this.image = this.getImageAsBase64(this.trip?.img.data.data);
          this.isOwner = this.user?._id === this.trip?._ownerId._id;
          this.isLiked = this.trip.likes.map((x: { _id: { toString: () => any; }; }) => x._id.toString()).includes(this.user?._id.toString());
          console.log('isLiked ->', this.isLiked);
          console.log(this.isOwner);
          console.log(this.trip);
        },
        error: (error) => {
          console.log(error.error.message);
        }
      }
    );
    this.subscriptions.add(currentLog$);
  }

  getImageAsBase64(file: any): string {
    let binary = '';
    const bytes = new Uint8Array(file);

    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  onCloseModal(isShown: boolean) {
    this.isShown = isShown; // Update the isShown variable in the parent component
  }

  showDeleteModal() {
    this.isShown = !this.isShown;
  }

  onDeleteConfirmed() {
    console.log('Delete operation confirmed');

    const deleteLog$ = this.apiService.deleteByTripId(this.tripId).subscribe({
      error: (error) => {
        console.log(error.error.message);
      },
      complete: () => this.router.navigate(['home'])
    });
    this.subscriptions.add(deleteLog$);
  }

  showCommentSection(): void {
    this.showComments = !this.showComments;
  }

  like(): void {
    console.log('like');
    const likeLog$ = this.apiService.addLike(this.tripId).subscribe({
      next: () => {
        this.isLiked = true;
        this.apiService.getDetails(this.tripId).subscribe(
          {
            next: (result) => {
              this.trip.likes = result.likes;//!
            },
            error: (error) => {
              console.log(error.error.message);
            }
          }
        );
      },
      error: (error) => {
        console.log(error.error.message);
        //this.errorMessageFromServer = error.error.message;
      }
    });
    this.subscriptions.add(likeLog$);
  }

  addComment(commentForm: NgForm): void {
    if (commentForm.invalid) {
      return;
    }

    console.log(commentForm.value.comment);

    const formData = new FormData();
    formData.append('comment', commentForm.value.comment);

    const commentLog$ = this.apiService.addComment(this.tripId, formData).subscribe({
      next: () => {
        commentForm.resetForm();
        this.apiService.getDetails(this.tripId).subscribe(
          {
            next: (result) => {
              this.trip.commentList = result.commentList;//!
            },
            error: (error) => {
              console.log(error.error.message);
            }
          }
        );
      },
      error: (error) => {
        console.log(error.error.message);
        //this.errorMessageFromServer = error.error.message;
      }
    });
    this.subscriptions.add(commentLog$);
  }

  getCreatedAt(id: string): string {
    const timeStamp = id.toString().substring(0, 8);
    const date = new Date(parseInt(timeStamp, 16) * 1000);
    return moment(date).fromNow();
  }

  downloadImage(): void {
    if (this.image) {
      const byteCharacters = atob(this.image);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'image.jpg';
      a.click();

      const downloadLog$ = this.apiService.downloadImage(this.tripId).subscribe({
        next: () => {
          this.apiService.getDetails(this.tripId).subscribe(
            {
              next: (result) => {
                this.trip.downloads = result.downloads;
              },
              error: (error) => {
                console.log(error.error.message);
              }
            }
          );
        },
        error: (error) => {
          console.log(error.error.message);
          //this.errorMessageFromServer = error.error.message;
        }
      });
      this.subscriptions.add(downloadLog$);

      // Clean up the URL object
      window.URL.revokeObjectURL(url);
    }
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
      console.log('unsubscribed');      
    }
  }

}
