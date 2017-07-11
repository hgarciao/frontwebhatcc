import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions} from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environments/environment';


@Injectable()
export class PostsService {
	
  
	
  constructor(private authHttp: AuthHttp) {}
  
  getOpcionesFormulario(): Observable<Response> {
    return this.authHttp.get(environment.urlmsposts+'/api/opcions');
  }
  
  getVariablesFormulario(): Observable<Response> {
    return this.authHttp.get(environment.urlmsposts+'/variables');
  }
  
  saveRegistroFormulario(post: any) : Observable<Response> {
	 return this.authHttp.post(environment.urlmsposts+'/registros', post);
  }
  
  //Este metodo debe tener la logica de cargar otros registros de otras personas according to logica
  //Al inicio solo jalara los mas recientes
  getRegistrosPacientes(paciente:string): Observable<Response> {
	  return this.authHttp.get(environment.urlmsposts+'/registros/pacientes/'+paciente);	  
  }

}