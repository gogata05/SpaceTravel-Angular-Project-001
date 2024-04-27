
//Card is Reuseable code template

import { Component, Input } from '@angular/core';
import { Trip } from 'src/app/interfaces/trip';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  constructor( ){}
  @Input() trip!: any;

  avatar:string | undefined;
  image:string | undefined;

  getImageAsBase64(): string {//convert trip.img from Uint8Array to Base64 string
    let binary = '';
    const bytes = new Uint8Array(this.trip.img.data.data);
    
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  getAvatarAsBase64(): string {//convert owner.img from Uint8Array to Base64 string
    
    let binary = '';
    const bytes = new Uint8Array(this.trip._ownerId.img.data.data);
    
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
}
