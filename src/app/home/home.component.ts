import { Component, OnInit,OnDestroy } from '@angular/core';
import { StompService } from 'ng2-stomp-service';
import { AuthenticationService} from '../_services/authentication.service';




@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  pacienteSesion: string;
  
  
  constructor(private authenticationService : AuthenticationService,private stompService: StompService) { }

  ngOnInit() {
	   this.pacienteSesion = this.authenticationService.decodeToken()['sub'];
	  //configuration 
		  this.stompService.configure({
			host:'http://localhost:8081/ws',
			debug:false,
			queue:{'init':false},
			headers: {
                Authorization: this.authenticationService.getToken()
            }
		  });
		
		  this.stompService.startConnect().then(() => {
			this.stompService.done('init');
			//console.log('connected');
		  });
  }
  
   ngOnDestroy (){
		console.log('destruyendo HOMEEEEE');
	}
	
  
  private _opened: boolean = false;
  private _modeNum: number = 0;
  private _positionNum: number = 0;
  private _closeOnClickOutside: boolean = false;
  private _showBackdrop: boolean = false;
  private _animate: boolean = true;
  private _trapFocus: boolean = true;
  private _autoFocus: boolean = true;
  private _keyClose: boolean = false;

  private _MODES: Array<string> = ['over', 'push', 'dock'];
  private _POSITIONS: Array<string> = ['left', 'right', 'top', 'bottom'];


}
