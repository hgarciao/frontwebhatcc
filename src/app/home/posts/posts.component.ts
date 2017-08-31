import {
    Component,
    OnInit,
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
	currentPostPage: number;
	pacienteSesion: string;
	isFormLoaded: boolean;
	isFormLoading:boolean;
	isPostsLoading:boolean;
	

    constructor(private postsService: PostsService, private authenticationService: AuthenticationService, private globalService: GlobalService,private flashMessagesService: FlashMessagesService,private stompService: StompService) {
		this.pacienteSesion = this.authenticationService.decodeToken()['sub'];
		this.stompService.after('init').then(()=>{
			console.log("suscribiendo posts");
			this.stompService.subscribe('/topic/registros', this.procesaNotificacion ,{
                Authorization: this.authenticationService.getToken()
            });
		  })
	}



    ngOnInit() {
		
		this.currentPostPage=0;
		this.registros = new Array();
		//Arreglar
		this.getPostsBlock(true);
		//Traer ids de registros a los que esta suscrito
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
			registro.opUpdate='crear'
            this.isFormLoading=true;
            this.postsService.saveRegistroFormulario(JSON.stringify(registro)).subscribe(
                res => {
					this.registros.unshift(res.json());
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

	
	getPostsBlock(init:boolean){
		if(init){
			this.globalService.displayLoader();}
		else{
			this.isPostsLoading=true;
		}
        this.postsService.getRegistrosPacientes(this.pacienteSesion,this.currentPostPage,environment.postpagesize).subscribe(
            res => {
				for (let elemen of res.json()) {
					this.registros.push(elemen);
				}
				this.currentPostPage = this.currentPostPage + 1 ;
				if(init){this.globalService.hideLoader();}else{this.isPostsLoading=false;}	
            },
			err =>{
				if(init){this.globalService.hideLoader();}else{this.isPostsLoading=false;}	
				this.flashMessagesService.show('Error! No se pudieron cargar las publicaciones', {
						  classes: ['alert', 'alert-danger'], // You can pass as many classes as you need
						  timeout: 4000, // Default is 3000
						});
			}
        );
		
	}
	
	
	onSelectedVariable(id: string){
		this.variables.filter(variable => variable.id == id)[0].invalid=false;
	}
	
	onDeselectedVariable(id: string){
		this.variables.filter(variable => variable.id == id)[0].invalid=true;
	}
	
	reloadPosts(){
		this.registros = new Array();
		this.currentPostPage=0;
		this.getPostsBlock(false);
	}
	
	onScrollDown(){
	  if(window.pageYOffset+ window.innerHeight>=document.body.offsetHeight){
		  this.getPostsBlock(false);
	  }
	}
	
	onScrollUp(){
	  if(window.pageYOffset==0){
		console.log("actualizar");
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
		console.log("Eliminar "+ event.id);
	}
	
	public procesaNotificacion = (objNotificacion) => {
	 
	 this.registros[this.registros.indexOf(this.registros.filter(registro => registro.id === objNotificacion.id)[0])]=objNotificacion;

	  
	}

}