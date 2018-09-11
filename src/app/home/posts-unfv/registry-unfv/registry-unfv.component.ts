import {
    Component,
    OnInit,
    Input,
    Output,
	EventEmitter,
	ElementRef
	
} from '@angular/core';
import {
    PostsService
} from '../../../_services/posts.service';
import { FlashMessagesService } from 'ngx-flash-messages';
import {
    AuthenticationService
} from '../../../_services/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'registry-unfv',
  templateUrl: './registry-unfv.component.html',
  styleUrls: ['./registry-unfv.component.css']
})
export class RegistryUnfvComponent implements OnInit {

  @Input() registro: any;
  deleteConfirm:boolean;
  @Output() updated = new EventEmitter<string>();
  opened : boolean = false;

  constructor(private postsService: PostsService,private flashMessagesService: FlashMessagesService
	,private _el: ElementRef, private authenticationService: AuthenticationService,private router: Router) {
  		this.deleteConfirm=false;
	}

  ngOnInit() {
  }

  eliminarRegistro(event:any){
  	if(!this.deleteConfirm){
  		this.deleteConfirm=true;
  	}else{
  		event.preventDefault();
		this.postsService.updateRegistroPacienteDelete(this.registro).subscribe(
				res => {
					this.deleteConfirm=false;
					this.updated.emit('complete');
				},
				err =>{
					if(!this.authenticationService.isLoggedIn()){
							window.location.reload();
						}else{
					this.flashMessagesService.show('Error! no se pudo eliminar la publicación', {
							  classes: ['alert', 'alert-danger'], // You can pass as many classes as you need
							  timeout: 2000, // Default is 3000
						});}
				}
			);

  		}
		
	}

	panelOpened(){
		this.opened = true;
	}

	panelClosed(){
		this.opened = false;
	}
}
