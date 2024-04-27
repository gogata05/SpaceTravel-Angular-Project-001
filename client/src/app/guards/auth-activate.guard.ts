import { Injectable, inject } from "@angular/core";
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateFn, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { SessionService } from "../services/session.service";

@Injectable({
  providedIn: 'root'
})// inject in root in body
class PermissionsService {

  constructor(private router: Router, private sessionService: SessionService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {//to check if the user is logged in or not
    if (this.sessionService.hasUser)  {
      return true;
    }
     return this.router.parseUrl('/user/login');
  }
}

export const AuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  return inject(PermissionsService).canActivate(next, state);//So we can use [AuthGuard] for profile,create,edit
}