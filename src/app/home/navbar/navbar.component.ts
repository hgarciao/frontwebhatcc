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

        //Verifica si tiene suscritos
        if (objNotificacion.suscritos.filter(suscrito => suscrito === this.pacienteSesion)[0]) {
            //Verifica si tiene comentarios
            if (objNotificacion.comentarios[objNotificacion.comentarios.length - 1]) {
                //El que comento es el mismo paciente
                if (objNotificacion.comentarios[objNotificacion.comentarios.length - 1].paciente == this.pacienteSesion) {
                    console.log("NO NOTIFICA")
                    //El que comento es otro paciente
                } else {
                    console.log("NOTIFICA")
                }


            } else {
                console.log("NO NOTIFICA")
            }
            //Revisa otras interacciones
        }

    }
	//ids: Array < string > = []
	vioNotificaciones(){
		console.log(this.authenticationService.decodeToken());
	}
	
	


}