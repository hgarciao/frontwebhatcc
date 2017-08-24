import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'notificacion',
  templateUrl: './notificacion.component.html',
  styleUrls: ['./notificacion.component.css']
})
export class NotificacionComponent implements OnInit {
	
  @Input() registro: any;
  
  constructor() { }

  ngOnInit() {
	  //console.log("hola soy notificacion");
	  //console.log(this.registro);
  }

}
