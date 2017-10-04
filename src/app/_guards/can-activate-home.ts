import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService} from '../_services/authentication.service';


@Injectable()
export class CanActivateHome implements CanActivate {
	
	constructor(private router: Router,
				private authenticationService : AuthenticationService) { }
				
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.authenticationService.isLoggedIn()) {
		  if (localStorage.getItem('firsttime')!=0) {
			let url = state.url.indexOf('/home?')!=-1?state.url.substring(0,state.url.indexOf('?')):state.url ;
			if( url=="/home" ){
				var roles = this.authenticationService.decodeToken()['auth'].split(',');
				if (roles.indexOf('ROLE_ADMIN')!=-1){
					//console.log('admin home');
					this.router.navigate(['/home/admin']);
				}
				if (roles.indexOf('ROLE_PACIENTE')!=-1){
					//console.log('admin paciente');		
					//console.log(route);
					this.router.navigate(['/home/paciente']);
					//this.router.navigateByUrl("/home/paciente(contenido:posts)");
				}
				if (roles.indexOf('ROLE_TERAPEUTA')!=-1){
					//console.log('admin terapeuta');			
					this.router.navigate(['/home/terapeuta']);
				}
				return false;
			}else{
				//console.log('ya no redirecciono solo dejo pasar : '+ url)
				return true;
			}
		  }else{
			  //Redirecciona a la pagina de firsttime
			  return false;
		  }
			
			
			
        }else{
			//console.log('No autenticado intenta acceder al home');
			//console.log(state);
			this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
			return false;
		}
        
    }
	
}

