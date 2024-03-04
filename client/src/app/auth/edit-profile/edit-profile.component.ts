import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ImageService } from 'src/app/services/image.service';
import { SessionService } from 'src/app/services/session.service';
import { createUserData } from 'src/app/interfaces/createUserData';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit, OnDestroy {
  constructor(private router: Router, private authService: AuthService, private sessionServise: SessionService, private imageService: ImageService) { }
  
  subscriptions: Subscription = new Subscription();
  errorMessageFromServer!: string;
  validateEmail: boolean = true;

  user: User | undefined;
  userId!: string;
  profilePic: any;

  url: string = '/assets/images/default_image.png';
  selectedFile: any
  fileName: string = '';

  editUserHandler(editUserForm: NgForm): void {

    if (editUserForm.invalid) {
      return;
    }

    const formData = new FormData();

    if (this.selectedFile) {
      this.fileName = this.selectedFile.name;
      formData.append('img', this.selectedFile);
    } else {
      this.selectedFile = this.convertToImageFile(this.imageService.getImageAsBase64(this.user?.img.data.data), editUserForm.value.username);
      formData.append('img', this.selectedFile);
    }

    console.log(editUserForm.value);

    formData.append('username', editUserForm.value.username);
    formData.append('email', editUserForm.value.email);
    formData.append('password', editUserForm.value.password);

    console.log(formData.get('img'));

    const editedUser$ = this.authService.updateUserData(formData as unknown as createUserData).subscribe({
      next: (updatedUser) => {
        console.log(updatedUser);
        this.sessionServise.createSession(updatedUser);
        this.router.navigate(['/user/profile']);
      },
      error: (error) => {
        console.log(error.error.message);
        this.errorMessageFromServer = error.error.message;
      }
    });
    this.subscriptions.add(editedUser$);
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
      console.log('unsubscribed');
      
    }
  }
}
