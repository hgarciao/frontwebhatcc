import {
    Component,
    OnInit,
	OnDestroy,
    HostListener,
    ViewChild
} from '@angular/core';
import {
    DatePipe
} from '@angular/common';
import {
    PostsService
} from '../../_services/posts.service';
import {
    GlobalService
} from '../../_services/global.service';
import {
    MdProgressSpinnerModule
} from '@angular/material';
import {
    MaterialModule
} from '@angular/material';
import {
    AuthenticationService
} from '../../_services/authentication.service';
import {
    IOption
} from 'ng-select';
import {
    PostComponent
} from './post/post.component';
import { environment } from '../../../environments/environment';
import { FlashMessagesService } from 'ngx-flash-messages';
import { StompService } from 'ng2-stomp-service';



@Component({
    selector: 'app-posts',
    templateUrl: './posts.component.html',
    styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

    variables: Array < any > = [];
    registros: Array < any > = [];
    @ViewChild('form') form;
    @ViewChild('modal') modal;
    submitted: boolean;
	pacienteSesion: string;
	isFormLoaded: boolean;
	isFormLoading:boolean;
	isPostsLoading:boolean;
	subscription:any;
	

    constructor(private postsService: PostsService, private authenticationService: AuthenticationService, private globalService: GlobalService,private flashMessagesService: FlashMessagesService,private stompService: StompService) {
		this.globalService.displayLoader();
		this.pacienteSesion = this.authenticationService.decodeToken()['sub'];
		this.stompService.after('init').then(()=>{
			this.subscription = this.stompService.subscribe('/topic/registros', this.procesaNotificacion ,{
                Authorization: this.authenticationService.getToken()
            });
		  });
		
		var parametros: any = {};
		parametros.paciente=this.pacienteSesion;
		parametros.pagesize=environment.postpagesize;
		// parametros.fechahora; No se setea por ser primera llamada
        this.postsService.getRegistrosWall(parametros).subscribe(
            res => {
				this.registros=res.json();
				this.globalService.hideLoader();
            },
			err =>{
				this.globalService.hideLoader();
				this.flashMessagesService.show('Error! No se pudieron cargar las publicaciones', {
						  classes: ['alert', 'alert-danger'], // You can pass as many classes as you need
						  timeout: 4000, // Default is 3000
						});
			}
        );
		  
	}



    ngOnInit() {
		this.isFormLoaded=false;
		this.isFormLoading=false;
		this.isPostsLoading=false;
    }

    guardaRegistroPost(form: any) {

        this.submitted = true;
        if (form.valid) {
            let value = form.value;
            var registro: any = {}
            registro.campos = [];
            let datePipe: DatePipe = new DatePipe('en-US');
            //registro.fechahora = datePipe.transform(Date.now(), 'yyyy-MM-ddTHH:mm:ss.sss') + 'Z';
            registro.paciente = this.pacienteSesion;
            for (var key in value) {
                switch (key) {
                    case "post":
                        {
                            registro.post = value[key]
                            break;
                        }
                    case "pensamiento":
                        {
                            registro.pensamiento = value[key]
                            break;
                        }
					case "oculto":
                        {
                            registro.oculto = value.oculto==""?false:true;
                            break;
                        }
                    default:
                        {
                            if (value[key] != "") {
                                if (value[key] instanceof Array) {
                                    registro.campos.push({
                                        nombreRegistroVariable: key,
                                        opciones: value[key]
                                    });
                                } else {
                                    registro.campos.push({
                                        nombreRegistroVariable: key,
                                        opciones: [value[key]]
                                    });
                                }
                            }
                            break;
                        }
                }

            }
			registro.eliminado=false;
			registro.notificar=false;
			registro.suscritos=[];
			registro.suscritos.push(this.pacienteSesion);
			registro.comentarios=[];
			registro.pacienteUpdate=this.pacienteSesion;
            this.isFormLoading=true;
            this.postsService.saveRegistroFormulario(JSON.stringify(registro)).subscribe(
                res => {
                    this.isFormLoading=false;
					this.modal.dismiss();
					this.flashMessagesService.show('Se realizó publicación', {
						  classes: ['alert', 'alert-success'], // You can pass as many classes as you need
						  timeout: 2000, // Default is 3000
					});
                },
				err =>{
					this.isFormLoading=false;
					this.modal.dismiss();
					this.flashMessagesService.show('Error! No se realizó la publicación', {
						  classes: ['alert', 'alert-danger'], // You can pass as many classes as you need
						  timeout: 4000, // Default is 3000
					});
				}
            );
			
        }
    }


    dismissPostModal() {
        this.form.reset();
        this.submitted = false;
		this.variables.forEach(function(p,i,vars) {
			vars[i].invalid=true;
		});
    }	
	
	onSelectedVariable(id: string){
		this.variables.filter(variable => variable.id == id)[0].invalid=false;
	}
	
	onDeselectedVariable(id: string){
		this.variables.filter(variable => variable.id == id)[0].invalid=true;
	}
	
	onScrollDown(){
	  if(window.pageYOffset+ window.innerHeight>=document.body.offsetHeight){
			this.isPostsLoading=true;
			var parametros: any = {};
			parametros.paciente=this.pacienteSesion;
			parametros.pagesize=environment.postpagesize;
			parametros.fechahora=this.registros[this.registros.length-1]?this.registros[this.registros.length-1].fechahora:null;
			this.postsService.getRegistrosWall(parametros).subscribe(
				res => {
					var registrosold =res.json();
					for(let registro of registrosold){
						this.registros.push(registro);
					}
					this.isPostsLoading=false;
				},
				err =>{
					this.isPostsLoading=false;
					this.flashMessagesService.show('Error! No se pudieron traer publicaciones antiguas', {
							  classes: ['alert', 'alert-danger'], // You can pass as many classes as you need
							  timeout: 4000, // Default is 3000
							});
				}
			);
	  }
	}
	
	cargaFormulario(){
		if(!this.isFormLoaded){
				this.isFormLoading=true;
				this.postsService.getVariablesFormulario().subscribe(
                    res1 => {
                        this.variables = res1.json();
                        this.variables.forEach(function(p,i,vars) {
                                vars[i].invalid=true;
								if (vars[i].opciones != null) {
                                    vars[i].opciones.forEach(function(part, index, theArray) {
                                        theArray[index] = {
                                            value: theArray[index],
                                            label: theArray[index].valor
                                        }
                                    });
                                }
                        });
						this.isFormLoading=false;
						this.isFormLoaded=true;
                    },
					err => {
						this.isFormLoading=false;
						this.isFormLoaded=false;
						this.modal.dismiss();
						this.flashMessagesService.show('Error! No se pudo cargar el formulario', {
						  classes: ['alert', 'alert-danger'], // You can pass as many classes as you need
						  timeout: 4000, // Default is 3000
						});
					}
                );
		}
	}
	
	ocultarPost(event:any){
		console.log("Ocultar "+event.id);
	}
	
	eliminarPost(event:any){
		//console.log(event.registro);
		this.postsService.updateRegistroPacienteDelete(event.registro).subscribe(
				res => {
					//console.log("eliminacion exitosa");
				},
				err =>{
					this.isPostsLoading=false;
					this.flashMessagesService.show('Error! no se pudo eliminar la publicación', {
							  classes: ['alert', 'alert-danger'], // You can pass as many classes as you need
							  timeout: 4000, // Default is 3000
							});
				}
			);
	}
	
	public procesaNotificacion = (objNotificacion) => {
		
	 if(objNotificacion.opUpdate=="crear"){
		  this.registros[this.registros.indexOf(this.registros.filter(registro => registro.id === objNotificacion.id)[0])]=objNotificacion;
	 }else if(objNotificacion.opUpdate=="eliminar"){
		 var index = this.registros.indexOf(this.registros.filter(registro => registro.id === objNotificacion.id)[0]);
		 if (index > -1) {
			this.registros.splice(index, 1);
		 }
	 }else{
		 this.registros.unshift(objNotificacion);
	 }
	  
	}
	
	ngOnDestroy (){
		this.subscription.unsubscribe();
	}

}