import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { AuthHttp,tokenNotExpired,JwtHelper} from 'angular2-jwt';
import {URLSearchParams} from '@angular/http';
import { environment } from '../../environments/environment';


@Injectable()
export class AuthenticationService {
  
  public token: string;
  jwtHelper: JwtHelper;
  
  constructor(private http : Http, private authHttp: AuthHttp) { 
 	this.jwtHelper = new JwtHelper();
  }
  
  	login(username: string, password: string, rememberMe: boolean): Observable<Response> {
		let headers = new Headers({ 'Content-Type': 'application/json'});
		let options = new RequestOptions({ headers: headers });
        return this.http.post( environment.urlgtw +'/authenticate', JSON.stringify({ username: username, password: password , rememberMe:rememberMe }),options);
    }
	
	logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('user');
        localStorage.removeItem('token');

    }
	
	decodeToken(): any{
		return this.jwtHelper.decodeToken(localStorage.getItem('token'));
	}
	
	getToken():string{
		return localStorage.getItem('token');
	}
	
	getUsuario():Observable<boolean>{
		let user = JSON.parse(localStorage.getItem('user'));
		if(!user.role){
			return this.authHttp.get( environment.urlgtw+'/users/'+user.username ).map((res: Response) => {console.log(res.json());return false;})		
		}
		
	}

		
	isLoggedIn() {
	  return tokenNotExpired('token');
	}
	
	private handleAuthException(res: Response | any){
		var resultado: any = {};
		resultado.mensaje = "Error durante el inicio de sesión comunicarse con el administrador";
		resultado.codigo=-1;
	}	
	
	
  
	
}
