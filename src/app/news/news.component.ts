import { Component, OnInit } from '@angular/core';
import {MatExpansionModule} from '@angular/material';
import {
    AuthenticationService
} from '../_services/authentication.service';
import {
    FlashMessagesService
} from 'ngx-flash-messages';
import {
    GlobalService
} from '../_services/global.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
	
  step = 0;
  contCancel=0;
  
	
  constructor(private flashMessagesService: FlashMessagesService, private authenticationService: AuthenticationService,private globalService: GlobalService,private router: Router,) { }

  ngOnInit() {
	  console.log('News!');
  }
   
  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
  
  
  cancelar(){
	 this.contCancel++;
	 if(this.contCancel==1){
		 this.flashMessagesService.show('Debes aceptar los terminos y normas para utilizar el servicio', {
                                classes: ['alert', 'alert-success'], // You can pass as many classes as you need
                                timeout: 2000, // Default is 3000
                            });
	 }else{
		 this.flashMessagesService.show('Hemos recibido tu repuesta.Vuelve pronto! ', {
                                classes: ['alert', 'alert-success'], // You can pass as many classes as you need
                                timeout: 2000, // Default is 3000
                            });
		 this.authenticationService.logout();   
		 location.reload();
	 }
	 
	
  }
  
  aceptar(){
	this.globalService.displayLoader();
	this.authenticationService.updateFirstTime(this.authenticationService.decodeToken()['sub']).subscribe(
                res => {
					this.globalService.hideLoader();
                    this.flashMessagesService.show('Se realizó confirmación', {
                        classes: ['alert', 'alert-success'], // You can pass as many classes as you need
                        timeout: 2000, // Default is 3000
                    });
					localStorage.setItem('firsttime',res.json());
					this.router.navigate(['/home']);
                },
                err => {
					this.globalService.hideLoader();
                    if (!this.authenticationService.isLoggedIn()) {
                        window.location.reload();
                    } else {
                        this.flashMessagesService.show('No se pudo guardar la confirmación de terminos y normas', {
                            classes: ['alert', 'alert-danger'], // You can pass as many classes as you need
                            timeout: 2000, // Default is 3000
                        });
                    }
                }
            );
  }
    
   	
}
