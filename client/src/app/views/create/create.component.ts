import { Component, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Trip } from 'src/app/interfaces/trip';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnDestroy {
  constructor(private apiService: ApiService, private router: Router) { }

  errorMessageFromServer!: string;
  url: string = '/assets/images/default_image.png';
  selectedFile: any
  fileName: string = '';
  subscriptions: Subscription = new Subscription();

  loadFile(event: any): void {//for image upload

    if (event.target.files) {
      const reader = new FileReader();
      this.selectedFile = <File>event.target.files[0];
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.url = event.target?.result;
      }
    }
  }

  create(form: NgForm) {//create form
    if (form.invalid) {
      return;
    }

    if (new Date(form.value.startDate) > new Date(form.value.endDate)) {
      this.errorMessageFromServer = 'End date cannot be before start date';//insure end date is after start date
      return;
    }

    if (this.selectedFile) {//check if image is selected
      console.log(this.selectedFile);
      this.fileName = this.selectedFile.name;
    }

    form.value.img = this.selectedFile;
    console.log(form.value);

    const formData = new FormData();
    formData.append('startLocation', form.value.startLocation);
    formData.append('endLocation', form.value.endLocation);
    formData.append('startDate', form.value.startDate);
    formData.append('endDate', form.value.endDate);
    formData.append('description', form.value.description);
    formData.append('img', this.selectedFile);
    
    const newTrip$ = this.apiService.create(formData as unknown as Trip).subscribe({
      next: (newTrip) => {
        console.log(newTrip);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.log(error.error.message);
        this.errorMessageFromServer = error.error.message;
      }
    });
    this.subscriptions.add(newTrip$);
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
      console.log('unsubscribed');
      
    }
  }

  startLocations: string[] = ['Earth', 'Mars', 'Venus', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Moon', 'Mercury', 'Titan', 'Europa', 'Ganymede', 'Callisto', 'Io', 'Ceres', 'Eris', 'Haumea', 'Makemake'];
  endLocations: string[] = ['Earth', 'Mars', 'Venus', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Moon', 'Mercury', 'Titan', 'Europa', 'Ganymede', 'Callisto', 'Io', 'Ceres', 'Eris', 'Haumea', 'Makemake'];

}


