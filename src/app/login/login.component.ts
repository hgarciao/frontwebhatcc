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
    resultado: boolean;

    constructor(private authenticationService: AuthenticationService, private router: Router, private route: ActivatedRoute,private globalService: GlobalService) {
    }

    ngOnInit() {

        // Esto es para cuando no este autenticado y es redirigido al login
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';

        console.log(this.returnUrl)

        if (this.authenticationService.isLoggedIn()) {
            console.log('Ya esta autenticado wey')
        } else {
            console.log('No esta autenticado wey')
        }
    }

    login() {
		this.globalService.displayLoader();
        this.authenticationService.login(this.usuario, this.password, this.rememberMe).subscribe(
            value => {
                if (!value) {
                    console.log('Implementar contraseña incorrecta');
                } else {
                    this.router.navigate([this.returnUrl]);
                }
				;
				this.globalService.hideLoader();
            }
        );

    }

}