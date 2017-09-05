import {
    Component,
    OnInit
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



@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

    pacienteSesion: string;
    registros: Array < any > = [];
	contadorNotificaciones:number;


    constructor(private authenticationService: AuthenticationService, private stompService: StompService, private postsService: PostsService, private flashMessagesService: FlashMessagesService) {
        this.pacienteSesion = this.authenticationService.decodeToken()['sub'];

        // SE CONECTA AL WEBSOCKET
        this.stompService.after('init').then(() => {
            console.log("suscribiendo navbar");
            this.stompService.subscribe('/topic/registros', this.procesaNotificacion, {
                Authorization: this.authenticationService.getToken()
            });
        })


        //TRAE NOTIFICACIONES LA PRIMERA VEZ
        this.postsService.getRegistrosPacientesSuscrito(this.pacienteSesion).subscribe(
            res => {
                this.registros = res.json();
                console.log(this.registros);
				this.valorContNotificaciones();
            },
            err => {
                this.flashMessagesService.show('Error! No se pudieron cargar las notificaciones', {
                    classes: ['alert', 'alert-danger'], // You can pass as many classes as you need
                    timeout: 4000, // Default is 3000
                });
            }
        );
    }

    ngOnInit() {

    }

    logout(): void {
        console.log("Colocar evento para cerrar socket madafaca");
        console.log('Cerrar sesion')
        this.authenticationService.logout()
        //Redigir al login
    }

    public procesaNotificacion = (objNotificacion) => {

        //Verifica si tiene suscritos y tipo de operacion añadir
        if (objNotificacion.suscritos.filter(suscrito => suscrito === this.pacienteSesion)[0]) {
                //Verifica si tiene comentarios
                if (objNotificacion.comentarios[objNotificacion.comentarios.length - 1] && objNotificacion.pacienteUpdate!=this.pacienteSesion) {
                    
						this.postsService.getRegistrosPacientesSuscrito(this.pacienteSesion).subscribe(
							res => {
								this.registros = res.json();
								console.log("Trae notificaciones");
								this.valorContNotificaciones();
							},
							err => {
								this.flashMessagesService.show('Error! No se pudieron cargar las notificaciones', {
									classes: ['alert', 'alert-danger'], // You can pass as many classes as you need
									timeout: 4000, // Default is 3000
								});
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
                    console.log("actualiza click date");
                    localStorage.setItem('clickdate', res.json());
					this.valorContNotificaciones();
                },
                err => {
                    this.flashMessagesService.show('Error! Durante actualizacion de alertas', {
                        classes: ['alert', 'alert-danger'], // You can pass as many classes as you need
                        timeout: 4000, // Default is 3000
                    });
                }
            );
        }
    }

	valorContNotificaciones(){
		this.contadorNotificaciones = this.registros.filter(registro => registro.fechahoraUpdate > localStorage.getItem('clickdate') && registro.opUpdate=="añadir.comentario" && registro.pacienteUpdate!=this.pacienteSesion).length;
	}


}