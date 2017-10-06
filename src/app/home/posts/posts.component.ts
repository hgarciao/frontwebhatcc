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
import {
    environment
} from '../../../environments/environment';
import {
    FlashMessagesService
} from 'ngx-flash-messages';
import {
    StompService
} from 'ng2-stomp-service';
import {
    Router,
    ActivatedRoute,
    Params
} from '@angular/router';
import {
    Observable
} from 'rxjs/Observable';


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
    isFormLoading: boolean;
    isPostsLoading: boolean;
    subscription: any;
	timersubs: any;
	pacienteParam:string;


    constructor(private postsService: PostsService, private authenticationService: AuthenticationService, private globalService: GlobalService, private flashMessagesService: FlashMessagesService, private stompService: StompService, private activatedRoute: ActivatedRoute, private router: Router) {
        this.pacienteSesion = this.authenticationService.decodeToken()['sub'];
        
		
		
        /**/
		
		
		
        this.activatedRoute.queryParams.subscribe(qparams => {
			
			this.globalService.displayLoader();
			this.pacienteParam = this.activatedRoute.snapshot.queryParams['paciente'];
			
			var parametros: any = {};
            parametros.paciente = this.pacienteSesion;
            parametros.pagesize = environment.postpagesize;
            
			if (this.pacienteParam) {
                parametros.pacientefiltro=this.pacienteParam;  
            }
			//console.log(parametros);

			// parametros.fechahora; No se setea por ser primera llamada PRIMERA LLAMADA!
            this.postsService.getRegistrosWall(parametros).subscribe(
                    res => {
                        this.registros = res.json();
                        this.globalService.hideLoader();
						if(this.pacienteParam && this.registros.length==0){
							this.flashMessagesService.show('El usuario "' + this.pacienteParam + '" no tiene publicaciones', {
                                classes: ['alert', 'alert-danger'], // You can pass as many classes as you need
                                timeout: 2000, // Default is 3000
                            });
							let timer = Observable.timer(2000, 1000);
                            this.timersubs = timer.subscribe(t => { this.timersubs.unsubscribe();this.router.navigateByUrl("/home/paciente/(contenido:posts)")});
						}
                    },
                    err => {
                        this.globalService.hideLoader();
                        if (!this.authenticationService.isLoggedIn()) {
                            window.location.reload();
                        } else {
                            this.flashMessagesService.show('Error! No se pudieron cargar las publicaciones', {
                                classes: ['alert', 'alert-danger'], // You can pass as many classes as you need
                                timeout: 2000, // Default is 3000
                            });
                        }
                    }
             );
			 window.scrollTo(0, 0)

        });

        /**/




    }



    ngOnInit() {
        this.isFormLoaded = false;
        this.isFormLoading = false;
        this.isPostsLoading = false;
        if (this.authenticationService.isLoggedIn()) {
            this.stompService.after('init').then(() => {
                this.subscription = this.stompService.subscribe('/topic/registros', this.procesaNotificacion, {
                    Authorization: this.authenticationService.getToken()
                });
            });
        } else {
            window.location.reload();
        }
    }

    guardaRegistroPost(form: any) {

        this.submitted = true;
        if (form.valid) {
			console.log(form.value);
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
					case "bpensamiento":
                        {
                            registro.bpensamiento = value[key]
                            break;
                        }	
                    case "oculto":
                        {
                            registro.oculto = value.oculto == "" ? false : true;
                            break;
                        }
                    default:
                        {
                            if (value[key] != "") {
                                if (value[key] instanceof Array) {
                                    registro.campos.push({
                                        nombreRegistroVariable: key,
                                        opciones: value[key],
										tipo: this.variables.filter(variable => variable.nombreRegistro == key)[0].tipo
                                    });
                                } else {
                                    registro.campos.push({
                                        nombreRegistroVariable: key,
                                        opciones: [value[key]],
										tipo: this.variables.filter(variable => variable.nombreRegistro == key)[0].tipo
                                    });
                                }
                            }
                            break;
                        }
                }

            }
            registro.eliminado = false;
            registro.notificar = false;
            registro.suscritos = [];
            registro.suscritos.push(this.pacienteSesion);
            registro.comentarios = [];
            registro.pacienteUpdate = this.pacienteSesion;
            this.isFormLoading = true;
            this.postsService.saveRegistroFormulario(JSON.stringify(registro)).subscribe(
                res => {
                    this.isFormLoading = false;
                    this.modal.dismiss();
                    this.flashMessagesService.show('Se realizó publicación', {
                        classes: ['alert', 'alert-success'], // You can pass as many classes as you need
                        timeout: 2000, // Default is 3000
                    });
                },
                err => {
                    this.isFormLoading = false;
                    this.modal.dismiss();
                    if (!this.authenticationService.isLoggedIn()) {
                        window.location.reload();
                    } else {
                        this.flashMessagesService.show('Error! No se realizó la publicación', {
                            classes: ['alert', 'alert-danger'], // You can pass as many classes as you need
                            timeout: 2000, // Default is 3000
                        });
                    }
                }
            );

        }
    }


    dismissPostModal() {
        this.form.reset();
        this.submitted = false;
        this.variables.forEach(function(p, i, vars) {
            vars[i].invalid = true;
        });
    }

    onSelectedVariable(id: string) {
        this.variables.filter(variable => variable.id == id)[0].invalid = false;
    }

    onDeselectedVariable(id: string) {
        this.variables.filter(variable => variable.id == id)[0].invalid = true;
    }

    onScrollDown() {
        /*if (window.pageYOffset + window.innerHeight >= document.body.offsetHeight && !this.isPostsLoading) {
            this.getOlderPosts();
        }*/
    }
	
	

	
	//Modificar
    getOlderPosts() {
        this.isPostsLoading = true;
        var parametros: any = {};
        parametros.paciente = this.pacienteSesion;
        parametros.pagesize = environment.postpagesize;
        parametros.fechahora = this.registros[this.registros.length - 1] ? this.registros[this.registros.length - 1].fechahora : null;
		if (this.pacienteParam) {
            parametros.pacientefiltro=this.pacienteParam;  
        }
        this.postsService.getRegistrosWall(parametros).subscribe(
            res => {
                var registrosold = res.json();
                for (let registro of registrosold) {
                    this.registros.push(registro);
                }
                this.isPostsLoading = false;
            },
            err => {
                this.isPostsLoading = false;
                if (!this.authenticationService.isLoggedIn()) {
                    window.location.reload();
                } else {
                    this.flashMessagesService.show('Error! No se pudieron traer publicaciones antiguas', {
                        classes: ['alert', 'alert-danger'], // You can pass as many classes as you need
                        timeout: 2000, // Default is 3000
                    });
                }
            }
        );
    }


    cargaFormulario() {
        if (!this.isFormLoaded) {
            this.isFormLoading = true;
            this.postsService.getVariablesFormulario().subscribe(
                res1 => {
                    this.variables = res1.json();
                    this.variables.forEach(function(p, i, vars) {
                        vars[i].invalid = true;
                        if (vars[i].opciones != null) {
                            vars[i].opciones.forEach(function(part, index, theArray) {
                                theArray[index] = {
                                    value: theArray[index],
                                    label: theArray[index].valor
                                }
                            });
                        }
                    });
                    this.isFormLoading = false;
                    this.isFormLoaded = true;
                },
                err => {
                    this.isFormLoading = false;
                    this.isFormLoaded = false;
                    this.modal.dismiss();
                    if (!this.authenticationService.isLoggedIn()) {
                        window.location.reload();
                    } else {
                        this.flashMessagesService.show('Error! No se pudo cargar el formulario', {
                            classes: ['alert', 'alert-danger'], // You can pass as many classes as you need
                            timeout: 2000, // Default is 3000
                        });
                    }
                }
            );
        }
    }


    public procesaNotificacion = (objNotificacion) => {

        if (objNotificacion.opUpdate == "crear" || (objNotificacion.opUpdate == "mostrar" && objNotificacion.paciente != this.pacienteSesion)) {
            this.registros.unshift(objNotificacion);
        } else if (objNotificacion.opUpdate == "eliminar" || (objNotificacion.opUpdate == "ocultar" && objNotificacion.paciente != this.pacienteSesion)) {
            var index = this.registros.indexOf(this.registros.filter(registro => registro.id === objNotificacion.id)[0]);
            if (index > -1) {
                this.registros.splice(index, 1);
            }
        } else {
            this.registros[this.registros.indexOf(this.registros.filter(registro => registro.id === objNotificacion.id)[0])] = objNotificacion;
        }

    }

    ngOnDestroy() {
		console.log('destroy posts');
        if(this.timersubs){
			this.timersubs.unsubscribe();
		}
        this.subscription.unsubscribe();
		
    }
	
	variablesFilterByType(type:string) {
		return this.variables.filter(variable => variable.tipo === type);
    }

}