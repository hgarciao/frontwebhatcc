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
  
  getRegistroById(id:string): Observable<Response> {
    return this.authHttp.get(environment.urlmsposts+'/registros/'+id);
  }
  
  saveRegistroFormulario(post: any) : Observable<Response> {
	 return this.authHttp.post(environment.urlmsposts+'/registros', post);
  }
  
  //Este metodo debe tener la logica de cargar otros registros de otras personas according to logica
  //Al inicio solo jalara los mas recientes de todos
  getRegistrosWall(parametros:any): Observable<Response> {
	  //return this.authHttp.get(environment.urlmsposts+'/registros/pacientes/'+paciente+"/"+ page +"/"+pagesize);
	  return this.authHttp.post(environment.urlmsposts+'/registros/pacientes/wall',parametros);	    
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
  
  getRegistrosPacientesSuscrito(paciente:string):Observable<Response> {
	  return this.authHttp.get(environment.urlmsposts+'/registros/pacientes/'+paciente);	  
  }

}
