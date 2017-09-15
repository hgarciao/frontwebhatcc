import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService} from '../_services/authentication.service';

@Injectable()
export class CanActivateLogin implements CanActivate {
	
	constructor(private router: Router,
				private authenticationService : AuthenticationService) { }
				
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.authenticationService.isLoggedIn()) {
			this.router.navigate(['/home']); 
            return false;
        }else{
			return true;
		}
        
    }
	
}

