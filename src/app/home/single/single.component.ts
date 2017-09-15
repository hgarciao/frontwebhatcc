import {
    Component,
    OnInit
} from '@angular/core';
import {
    Router,
    ActivatedRoute,
    Params
} from '@angular/router';
import {
    PostsService
} from '../../_services/posts.service';
import {
    FlashMessagesService
} from 'ngx-flash-messages';
import {
    GlobalService
} from '../../_services/global.service';
import {
    AuthenticationService
} from '../../_services/authentication.service';
import {
    StompService
} from 'ng2-stomp-service';
import {
    Observable
} from 'rxjs/Observable';


@Component({
    selector: 'app-single',
    templateUrl: './single.component.html',
    styleUrls: ['./single.component.css']
})
export class SingleComponent implements OnInit {

    registro: any;
    pacienteSesion: any;
	timersubs: any;
	subscription:any;

    constructor(private activatedRoute: ActivatedRoute, private router: Router,
        private postsService: PostsService, private flashMessagesService: FlashMessagesService, private globalService: GlobalService, private authenticationService: AuthenticationService, private stompService: StompService) {
        let registroId = this.activatedRoute.snapshot.queryParams['id'];
        this.pacienteSesion = this.authenticationService.decodeToken()['sub'];
        if (registroId) {
			
            this.activatedRoute.queryParams.subscribe(qparams => {

				
                this.globalService.displayLoader();
                this.postsService.getRegistroByIdByPaciente(qparams['id'], this.pacienteSesion).subscribe(
                    res => {
						this.registro = res.json();
                        this.globalService.hideLoader();
                    },
                    err => {
						console.log('hsey');
                        this.globalService.hideLoader();
                        if (!this.authenticationService.isLoggedIn()) {
                            window.location.reload();
                        } else {
                            if (err.status == 404) {
                                this.flashMessagesService.show('Publicacion ya no existe', {
                                    classes: ['alert', 'alert-danger'], // You can pass as many classes as you need
                                    timeout: 2000, // Default is 3000
                                });
								console.log('hoy');
                                let timer = Observable.timer(2000, 1000);
                                this.timersubs = timer.subscribe(t => this.router.navigateByUrl("/home/paciente/(contenido:posts)"));
                            } else {
                                this.flashMessagesService.show('Error! No se pudo cargar el registro', {
                                    classes: ['alert', 'alert-danger'], // You can pass as many classes as you need
                                    timeout: 2000, // Default is 3000
                                });
                            }
                        }
                    }
                );



            });
        } else {
			console.log('hey');
            this.router.navigateByUrl("/home/paciente/(contenido:posts)");
        }
    }
	
	ngOnDestroy(){
		//console.log('Destruyendo single');
		if(this.timersubs){
			this.timersubs.unsubscribe();
		}
		this.subscription.unsubscribe();
	}


    ngOnInit() {
        if (this.authenticationService.isLoggedIn()) {
            this.stompService.after('init').then(() => {
                let token = this.authenticationService.getToken();
                this.subscription = this.stompService.subscribe('/topic/registros', this.procesaNotificacion, {
                    Authorization: token
                });
            });
        } else {
            window.location.reload();
        }


    }

    public procesaNotificacion = (objNotificacion) => {

        if (this.registro.id == objNotificacion.id) {
            if ((objNotificacion.opUpdate == 'ocultar' && objNotificacion.paciente != this.pacienteSesion) ||
                (objNotificacion.opUpdate == 'eliminar')) {
                this.registro = null;
                this.flashMessagesService.show('Publicacion ya no existe', {
                    classes: ['alert', 'alert-danger'], // You can pass as many classes as you need
                    timeout: 2000, // Default is 3000
                });
				let timer = Observable.timer(2000, 1000);
                this.timersubs = timer.subscribe(t => this.router.navigateByUrl("/home/paciente/(contenido:posts)"));
            } else {
                this.registro = objNotificacion;
            }
        }

    }

}