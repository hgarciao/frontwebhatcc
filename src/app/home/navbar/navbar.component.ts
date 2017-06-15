import { Component, OnInit } from '@angular/core';
import { AuthenticationService} from '../../_services/authentication.service';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private authenticationService : AuthenticationService) { }

  ngOnInit() {
  }

  logout(): void {
       console.log('Cerrar sesion')
	   this.authenticationService.logout()
	   //Redigir al login
  }
  
  
}
