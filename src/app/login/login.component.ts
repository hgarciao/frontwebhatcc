import {
    Component,
    OnInit,
	Input 
} from '@angular/core';
import {
    AuthenticationService
} from '../_services/authentication.service';
import {
    GlobalService
} from '../_services/global.service';
import {
    Router,
    ActivatedRoute
} from '@angular/router';
import { SlicePipe } from '@angular/common';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    usuario: string;
    password: string;
    rememberMe: boolean;
    returnUrl: string;
	returnUrlParams:  any;
    resultado: boolean;
	msgAlert: string;
	hideAlert: boolean;
	levelAlert: number;

    constructor(private authenticationService: AuthenticationService, private router: Router, private route: ActivatedRoute,private globalService: GlobalService) {
    }

    ngOnInit() {

        // Esto es para cuando no este autenticado y es redirigido al login
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
		/*if(this.returnUrl.indexOf('?')!=-1){
			this.returnUrlParams ={};
			let tmp = this.returnUrl.substring(this.returnUrl.indexOf('?')+1,this.returnUrl.length).split('&');
			for (var i = 0; i < tmp.length; i++) {
				this.returnUrlParams[tmp[i].split('=')[0]] = tmp[i].split('=')[1];
			}
			this.returnUrl = this.returnUrl.substring(0,this.returnUrl.indexOf('?'));
			console.log(this.returnUrl);
			console.log(this.returnUrlParams);
		}*/
		//console.log(this.returnUrl);
		this.msgAlert = "";

    }

    login() {
		this.globalService.displayLoader();
        this.authenticationService.login(this.usuario, this.password, this.rememberMe).subscribe(
				res => { 
					this.globalService.hideLoader();
					let body = res.json();
					let token = body.id_token;
					let clickdate = body.clickdate;
					let firsttime = body.firsttime;
					if (token) {
						localStorage.setItem('token',token );
						if(!clickdate){
							clickdate = new Date('1968-11-16T00:00:00');
						}
						localStorage.setItem('clickdate',clickdate);
						localStorage.setItem('firsttime',firsttime);
						//console.log(firsttime);
						this.msgAlert = "";
						this.router.navigateByUrl(this.returnUrl);
					} else {
						this.msgAlert = "Contraseña y/o Usuario incorrectos";
					}
				},
				err => { 
					console.log(err);
					if(err.status==401){
						this.msgAlert = "Contraseña y/o Usuario incorrectos";
					}
					else{
						this.msgAlert = "Error conectando al servidor. \n Comunicarse con el administrador ";
					}
					this.globalService.hideLoader();
				}
		);

    }
}