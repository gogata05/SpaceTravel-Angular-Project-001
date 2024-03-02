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

  getImageAsBase64(): string {
    let binary = '';
    const bytes = new Uint8Array(this.trip.img.data.data);

    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  loadFile(event: any): void {

    if (event.target.files) {
      const reader = new FileReader();
      this.selectedFile = <File>event.target.files[0];
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.url = event.target?.result;
      }
    }
  }

  convertToImageFile(base64String: string, filename: string): File {
    const byteCharacters = atob(base64String);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: 'image/jpeg' });

    const file = new File([blob], filename, { type: 'image/jpeg' });
    return file;
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