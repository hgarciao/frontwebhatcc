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


@Component({
    selector: 'app-single',
    templateUrl: './single.component.html',
    styleUrls: ['./single.component.css']
})
export class SingleComponent implements OnInit {

    registro: any;
    pacienteSesion: any;

    constructor(private activatedRoute: ActivatedRoute, private router: Router,
        private postsService: PostsService, private flashMessagesService: FlashMessagesService, private globalService: GlobalService, private authenticationService: AuthenticationService, private stompService: StompService) {
        let registroId = this.activatedRoute.snapshot.queryParams['id'];
        if (registroId) {
            this.pacienteSesion = this.authenticationService.decodeToken()['sub'];
            this.globalService.displayLoader();
            this.postsService.getRegistroById(registroId).subscribe(
                res => {
                    this.registro = res.json();
					//SI NO TRAE NADA????????????
                    this.globalService.hideLoader();
                },
                err => {
                    this.globalService.hideLoader();
					if(!this.authenticationService.isLoggedIn()){
							window.location.reload();
						}else{
                    this.flashMessagesService.show('Error! No se pudo cargar el registro', {
                        classes: ['alert', 'alert-danger'], // You can pass as many classes as you need
                        timeout: 4000, // Default is 3000
						});}
                }
            );
        } else {
            this.router.navigateByUrl("/home/paciente/(contenido:posts)");
        }
    }



    ngOnInit() {
if(this.authenticationService.isLoggedIn()){
			this.stompService.after('init').then(() => {
                //console.log("suscribiendo single: " + this.authenticationService.getToken());
				let token = this.authenticationService.getToken();
                this.stompService.subscribe('/topic/registros', this.procesaNotificacion, {
                    Authorization: token
                });
            });
		}else{
			window.location.reload();
		}
	
			
			this.activatedRoute.queryParams.subscribe(qparams => {
		this.globalService.displayLoader();
            this.postsService.getRegistroById(qparams['id']).subscribe(
                res => {
                    this.registro = res.json();
					//SI NO TRAE NADA????????????
                    this.globalService.hideLoader();
                },
                err => {
                    this.globalService.hideLoader();
					if(!this.authenticationService.isLoggedIn()){
							window.location.reload();
						}else{
                    this.flashMessagesService.show('Error! No se pudo cargar el registro', {
                        classes: ['alert', 'alert-danger'], // You can pass as many classes as you need
                        timeout: 4000, // Default is 3000
						});}
                }
            );
	   });
    }

    public procesaNotificacion = (objNotificacion) => {

        if (this.registro.id == objNotificacion.id) {
            this.registro = objNotificacion;
        }

    }

}