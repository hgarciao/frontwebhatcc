import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { AuthHttp,tokenNotExpired,JwtHelper} from 'angular2-jwt';
import {URLSearchParams} from '@angular/http';


@Injectable()
export class AuthenticationService {
  
  public token: string;
  jwtHelper: JwtHelper;
  
  constructor(private http : Http, private authHttp: AuthHttp) { 
 	this.jwtHelper = new JwtHelper();
  }
  
  	login(username: string, password: string, rememberMe: boolean): Observable<boolean> {
		let headers = new Headers({ 'Content-Type': 'application/json'});
		let options = new RequestOptions({ headers: headers });
        return this.http.post('http://localhost:8080/api/authenticate', JSON.stringify({ username: username, password: password , rememberMe:rememberMe }),options)
            .map((res: Response) => {
				
				let body = res.json();
				let token = body.id_token;
				if (token) {
					this.token = token;
					localStorage.setItem('token',token );
					localStorage.setItem('user',JSON.stringify({ username: username}));
					console.log(token)
					return true;
				} else {
					return false;
				}
			})
			//Aqui debe lanzar un error y ser manejado por un manejador aparte 
			//Debe devolver falso
			//Falta modificar
			.catch(this.handleAuthException);
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
	
	getUsuario():Observable<boolean>{
		let user = JSON.parse(localStorage.getItem('user'));
		if(!user.role){
			return this.authHttp.get('http://localhost:8080/api/users/'+user.username ).map((res: Response) => {console.log(res.json());return false;})		
		}
		
	}
	
	isLoggedIn() {
	  return tokenNotExpired('token');
	}
	
	private handleAuthException(res: Response | any){
		return Observable.throw('Error en autenticacion');
	}	
	
	
  
	
}
