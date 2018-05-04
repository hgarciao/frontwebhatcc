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
  
  //Trae el registro de single
  getRegistroByIdByPaciente(id:string,paciente:string): Observable<Response> {
    return this.authHttp.get(environment.urlmsposts+'/registros/'+paciente+'/'+id);
  }	

  //Trae registros del muro  
  getRegistrosWall(parametros:any): Observable<Response> {
	  return this.authHttp.post(environment.urlmsposts+'/registros/pacientes/wall',parametros);	    
  }
  
  //Trae notificaciones
  getRegistrosPacientesSuscrito(paciente:string):Observable<Response> {
	  return this.authHttp.get(environment.urlmsposts+'/registros/pacientes/'+paciente);	  
  }
  
  updateRegistroPacienteAddComentario(post:any):Observable<Response> {
	 return this.authHttp.put(environment.urlmsposts+'/registros/1', post);
  }
  
  updateRegistroPacienteDeleteComentario(post:any):Observable<Response> {
	 return this.authHttp.put(environment.urlmsposts+'/registros/0', post);
  }
  
  updateRegistroPacienteDelete(post:any):Observable<Response> {
	 return this.authHttp.put(environment.urlmsposts+'/registros/2', post);
  }
  
  updateRegistroPacienteHide(post:any):Observable<Response> {
	 return this.authHttp.put(environment.urlmsposts+'/registros/3', post);
  }
  
  updateRegistroPacienteUnhide(post:any):Observable<Response> {
	 return this.authHttp.put(environment.urlmsposts+'/registros/4', post);
  }
  
  

}
