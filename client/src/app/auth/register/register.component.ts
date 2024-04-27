import { Component, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SessionService } from 'src/app/services/session.service';
import { createUserData } from 'src/app/interfaces/createUserData';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs'; 

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnDestroy {
  constructor( private authService: AuthService, private router: Router, private sessionServise: SessionService) { }
  
  subscriptions: Subscription = new Subscription();
  errorMessageFromServer!: string;
  validateEmail:boolean = true;
  url: string = '/assets/images/default_image.png';//upload image variable
  selectedFile: any
  fileName: string = '';

  loadFile(event: any): void {//method for image upload

    if (event.target.files) {
      const reader = new FileReader();
      this.selectedFile = <File>event.target.files[0];
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.url = event.target?.result;
      }
    }
  }


  registerHandler(registerForm: NgForm): void {//method for register

    if (registerForm.invalid) {
      return;
    }

    if (this.selectedFile) {
      console.log(this.selectedFile);
      this.fileName = this.selectedFile.name;
    }

    registerForm.value.img = this.selectedFile;
    console.log(registerForm.value);

    const formData = new FormData();
    formData.append('username', registerForm.value.username);
    formData.append('email', registerForm.value.email);
    formData.append('password', registerForm.value.password);
    formData.append('img', this.selectedFile);

    // const createdUser$ = this.authService.register(formData as unknown as createUserData).subscribe({

const createdUser$ = this.authService.register(formData as unknown as createUserData)
.pipe(
  catchError((error) => {
    console.error('Problem with processing the promise', error);
    this.errorMessageFromServer = error.error.message;
    return throwError(() => new Error('Problem with processing the promise')); 
    })
  )
  .subscribe({
      next: (newUser) => {
        console.log(newUser);
        this.sessionServise.createSession(newUser);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.log(error.error.message);
        this.errorMessageFromServer = error.error.message;
      }
    });
    this.subscriptions.add(createdUser$);
  }

  ngOnDestroy(): void {//for unsubscribed
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
      console.log('unsubscribed');
      
    }
  }
}


