import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Trip } from 'src/app/interfaces/trip';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy {
  constructor(private apiService: ApiService, private router: Router, private activatedRoute: ActivatedRoute, private datePipe: DatePipe) { }

  trip!: any //TODO: implement data validation !!!
  errorMessageFromServer!: string;
  image: any
  url: string = '';
  selectedFile: any
  fileName: string = '';
  id: string = this.activatedRoute.snapshot.params['tripId'];
  date: any;
  subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    const currentTrip$ = this.apiService.getDetails(this.id).subscribe(
      {
        next: (result) => {
          this.trip = result;
          this.image = this.getImageAsBase64();
          const parsedDate = new Date(this.trip.date);
          console.log(parsedDate);
          console.log(this.trip.date);
          
          this.date = this.datePipe.transform(parsedDate, 'yyyy-MM-dd');
          console.log(this.trip);
        },
        error: (error) => {
          console.log(error.error.message);
          this.errorMessageFromServer = error.error.message;
        }
      }
    );
    this.subscriptions.add(currentTrip$);
  }

  editHandler(editForm: NgForm) {
    if (editForm.invalid) {
      return;
    }
    if (new Date(editForm.value.startDate) > new Date(editForm.value.endDate)) {
      this.errorMessageFromServer = 'End date cannot be before start date';
      return;
    }
    console.log(editForm.value);

    const formData = new FormData();

    if (this.selectedFile) {
      this.fileName = this.selectedFile.name;
      formData.append('img', this.selectedFile);
    } else {
      this.selectedFile = this.convertToImageFile(this.getImageAsBase64(), editForm.value.name);
      formData.append('img', this.selectedFile);
    }

    formData.append('startLocation', editForm.value.startLocation);
    formData.append('endLocation', editForm.value.endLocation);
    formData.append('startDate', editForm.value.startDate);
    formData.append('endDate', editForm.value.endDate);
    formData.append('description', editForm.value.description);

    this.apiService.edit(this.id, formData as unknown as Trip).subscribe({
      next: (updatedTrip) => {
        console.log(updatedTrip);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.log(error.error.message);
        this.errorMessageFromServer = error.error.message;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
      console.log('unsubscribed');
      
    }
  }
  locations: string[] = ['Earth', 'Mars', 'Venus', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Moon', 'Mercury', 'Titan', 'Europa', 'Ganymede', 'Callisto', 'Io', 'Ceres', 'Eris', 'Haumea', 'Makemake'];
}