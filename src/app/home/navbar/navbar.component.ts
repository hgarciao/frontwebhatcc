import {
    Component,
    OnInit,
	OnDestroy
} from '@angular/core';
import {
    AuthenticationService
} from '../../_services/authentication.service';
import {
    PostsService
} from '../../_services/posts.service';
import {
    StompService
} from 'ng2-stomp-service';
import {
    FlashMessagesService
} from 'ngx-flash-messages';
import {
    Router,
    ActivatedRoute,
    Params
} from '@angular/router';


@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

    pacienteSesion: string;
    registros: Array < any > = [];
	contadorNotificaciones:number;
	subscription:any;
	inputBuscar:string='';


    constructor(private authenticationService: AuthenticationService, private stompService: StompService, private postsService: PostsService, private flashMessagesService: FlashMessagesService
	,private router: Router,private activatedRoute: ActivatedRoute) {
        this.pacienteSesion = this.authenticationService.decodeToken()['sub'];
		
        //TRAE NOTIFICACIONES LA PRIMERA VEZ
        this.postsService.getRegistrosPacientesSuscrito(this.pacienteSesion).subscribe(
            res => {
                this.registros = res.json();
                //console.log(this.registros);
				this.valorContNotificaciones();
            },
            err => {
				if(!this.authenticationService.isLoggedIn()){
							window.location.reload();
						}else{
                this.flashMessagesService.show('Error! No se pudieron cargar las notificaciones', {
                    classes: ['alert', 'alert-danger'], // You can pass as many classes as you need
                    timeout: 2000, // Default is 3000
						});}
            }
        );
		
		this.activatedRoute.queryParams.subscribe(qparams => {
			let pacienteParam = this.activatedRoute.snapshot.queryParams['paciente'];
			if(pacienteParam){
				console.log('hace filtro');
				this.inputBuscar=pacienteParam
			}	
			
        });
    }

    ngOnInit() {
		if(this.authenticationService.isLoggedIn()){
			this.stompService.after('init').then(() => {
            //console.log("suscribiendo navbar");
            this.subscription= this.stompService.subscribe('/topic/registros', this.procesaNotificacion, {
                Authorization: this.authenticationService.getToken()
            });
        });
		}else{
			window.location.reload();
		}
        
    }

    logout(): void {
        //console.log("Colocar evento para cerrar socket madafaca");
        //console.log('Cerrar sesion')
        this.authenticationService.logout()
        //Redigir al login
    }

    public procesaNotificacion = (objNotificacion) => {

        //Verifica si tiene suscritos y tipo de operacion añadir
        if (objNotificacion.suscritos.filter(suscrito => suscrito === this.pacienteSesion)[0]) {
                //Verifica si tiene comentarios
                if ((objNotificacion.comentarios[objNotificacion.comentarios.length - 1] && objNotificacion.pacienteUpdate!=this.pacienteSesion) || objNotificacion.opUpdate=='eliminar.comentario') {
                    
						this.postsService.getRegistrosPacientesSuscrito(this.pacienteSesion).subscribe(
							res => {
								this.registros = res.json();
								console.log("Trae notificaciones");
								console.log(this.registros);
								this.valorContNotificaciones();
								console.log(this.contadorNotificaciones);
								if(this.contadorNotificaciones>0){
									this.flashMessagesService.show('Tienes una nueva notificacion', {
									classes: ['alert', 'alert-success'], // You can pass as many classes as you need
									timeout: 2000, // Default is 3000
									});
								}
							},
							err => {
								if(!this.authenticationService.isLoggedIn()){
							window.location.reload();
						}else{
								this.flashMessagesService.show('Error! No se pudieron cargar las notificaciones', {
									classes: ['alert', 'alert-danger'], // You can pass as many classes as you need
									timeout: 2000, // Default is 3000
						});}
							}
						);
                    //}
                }
				
        }
		
		

    }
    //ids: Array < string > = []
    vioNotificaciones() {
        if (this.contadorNotificaciones>0) {
            this.authenticationService.updateClickDate(this.pacienteSesion).subscribe(
                res => {
                    //console.log("actualiza click date");
                    localStorage.setItem('clickdate', res.json());
					this.valorContNotificaciones();
                },
                err => {
					if(!this.authenticationService.isLoggedIn()){
						window.location.reload();
					}
					else{
						this.flashMessagesService.show('Error durante actualizacion de notificaciones', {
                        classes: ['alert', 'alert-danger'], // You can pass as many classes as you need
                        timeout: 2000, // Default is 3000
						});
					}
                   
                }
            );
        }
    }

	valorContNotificaciones(){
		this.contadorNotificaciones = this.registros.filter(registro => 
		new Date(this.registros[0].fechahoraUpdate)>new Date(localStorage.getItem('clickdate')) && registro.opUpdate=="crear.comentario" && registro.pacienteUpdate!=this.pacienteSesion).length;
		//console.log(this.contadorNotificaciones);
	}

	ngOnDestroy (){
		console.log('destruyendo navbar');
		this.subscription.unsubscribe();
	}
	
	redirectHome(event:any){
		event.preventDefault();
		this.router.navigateByUrl("/home/paciente/(contenido:posts)");
	}
	
	keyUpFunction(event) {
	  if(event.keyCode == 13) {
		this.router.navigateByUrl("/home/paciente/(contenido:posts)?paciente="+this.inputBuscar);
	  }else if(this.inputBuscar==''){
		this.router.navigateByUrl("/home/paciente/(contenido:posts)");
	  }
	}
	
		
	
}