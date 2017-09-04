import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService} from '../_services/authentication.service';


@Injectable()
export class CanActivateHome implements CanActivate {
	
	constructor(private router: Router,
				private authenticationService : AuthenticationService) { }
				
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        if (this.authenticationService.isLoggedIn()) {
			
			if(state.url=="/home"){
				var roles = this.authenticationService.decodeToken()['auth'].split(',');
				if (roles.indexOf('ROLE_ADMIN')!=-1){
					console.log('admin home');
					this.router.navigate(['/home/admin']);
				}
				if (roles.indexOf('ROLE_PACIENTE')!=-1){
					console.log('admin paciente');				
					this.router.navigate(['/home/paciente']);
				}
				if (roles.indexOf('ROLE_TERAPEUTA')!=-1){
					console.log('admin terapeuta');			
					this.router.navigate(['/home/terapeuta']);
				}
				return false;
			}else{
				console.log('ya no redirecciono solo dejo pasar')
				return true;
			}
			
        }else{
			console.log('No autenticado intenta acceder al home - redirijo');
			this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
			return false;
		}
        
    }
	
}

