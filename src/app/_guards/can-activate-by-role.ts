import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService} from '../_services/authentication.service';

@Injectable()
export class CanActivateByRole implements CanActivate {
	constructor(private router: Router,
				private authenticationService : AuthenticationService) { }
				
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		if (this.authenticationService.isLoggedIn()) {
			var roles = this.authenticationService.decodeToken()['auth'].split(',');
			if (roles.indexOf(route.data['role'])==-1){
				console.log('false')
				this.router.navigate(['/home']);
				return false
			}
			return true
        }else{
			this.router.navigate(['/login']);
			return false;
		}
		
		
    }
	
}

