import { Component, OnInit,Input } from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';

@Component({
  selector: 'notificacion',
  templateUrl: './notificacion.component.html',
  styleUrls: ['./notificacion.component.css']
})
export class NotificacionComponent implements OnInit {
	
  @Input() registro: any;
  
  constructor(private router: Router,private route:ActivatedRoute) { }

  ngOnInit() {
	  //console.log("hola soy notificacion");
	  //console.log(this.registro);
  }
  
  redirect(){
	  this.router.navigateByUrl("/home/paciente/(contenido:single)?id="+this.registro.post);
  }
  

}
