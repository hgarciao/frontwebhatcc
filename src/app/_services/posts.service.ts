import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions} from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class PostsService {
	
  
	
  constructor(private authHttp: AuthHttp) {}
  
  getOpcionesFormulario(): Observable<Response> {
    return this.authHttp.get('http://localhost:8080/mspostshatcc/api/opcions');
  }
  
  getVariablesFormulario(): Observable<Response> {
    return this.authHttp.get('http://localhost:8080/mspostshatcc/api/variables');
  }
  
  saveRegistroFormulario(post: any) : Observable<Response> {
	 return this.authHttp.post('http://localhost:8080/mspostshatcc/api/registros', post);
  }
  
  //Este metodo debe tener la logica de cargar otros registros de otras personas according to logica
  //Al inicio solo jalara los mas recientes
  getRegistrosPacientes(paciente:string): Observable<Response> {
	  return this.authHttp.get('http://localhost:8080/mspostshatcc/api/registros/pacientes/'+paciente);	  
  }

}
