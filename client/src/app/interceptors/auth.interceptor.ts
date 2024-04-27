import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionService } from '../services/session.service'; 

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private sessionService: SessionService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.sessionService.getToken();//get jwt token
    
    if (token) {
      request = request.clone({
        setHeaders: {
          'X-Authorization': token.accessToken,//set token in header
        }
      });
    }

    request = request.clone({
      setHeaders: {
        'enctype': 'multipart/form-data'
      }// Sets form data encoding. For file upload.
    });

    request = request.clone({
      withCredentials: true,//enable cookies
    });

    return next.handle(request);
  }
}