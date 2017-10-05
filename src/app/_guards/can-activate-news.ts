import { Injectable } from '@angular/core';
import { Router,CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService} from '../_services/authentication.service';


@Injectable()
export class CanActivateNews implements CanActivate {
	
  constructor(private router: Router,
				private authenticationService : AuthenticationService){}
				
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
	  
		if (this.authenticationService.isLoggedIn())
		{
			
			if(localStorage.getItem('firsttime')=== '0') {
				return true;
			}else{
				this.router.navigate(['/home']);
				//return false;
			}
		
        }else{
			this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
			return false;
		}
		  
        
   }
}
