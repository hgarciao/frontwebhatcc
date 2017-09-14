import {
    Component,
    OnInit,
    Input,
    Output,
	EventEmitter,
	ElementRef
	
} from '@angular/core';
import {
    MaterialModule
} from '@angular/material';
import {
    Registro
} from '../../../_domain/registro';
import {
    PostsService
} from '../../../_services/posts.service';
import { FlashMessagesService } from 'ngx-flash-messages';
import {
    AuthenticationService
} from '../../../_services/authentication.service';


@Component({
    selector: 'post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.css'],
})

export class PostComponent implements OnInit {

    @Input() registro: any;
    @Input() pacienteSesion: any;
    tags: Array < string > = [];
	isCommenting:boolean;
	mostrarComentarios:boolean;

    constructor(private postsService: PostsService,private flashMessagesService: FlashMessagesService,private _el: ElementRef, private authenticationService: AuthenticationService) {
	}
	
	

    ngOnInit() {
		this.mostrarComentarios=false;
        let tags = this.tags;
        if (this.registro.campos != null) {
            this.registro.campos.forEach(function(campo) {
                let opcs = '';
                campo.opciones.forEach(function(opcion) {
                    opcs = opcs + " " + opcion.valor
                })
                opcs = campo.nombreRegistroVariable + " :" + opcs;
                tags.push(opcs);
            });
        }
		this.isCommenting = false;
    }

	
    enviaComentario(comentario: any) {
        if (comentario.value != "") {
			let copia = <any> JSON.parse(JSON.stringify(this.registro));
            if (copia.comentarios == null) {
                copia.comentarios = new Array();
            }
            var comment: any = {};
            comment.contenido = comentario.value;
            comment.paciente = this.pacienteSesion;
			copia.comentarios.push(comment);
			copia.pacienteUpdate=this.pacienteSesion;
			this.isCommenting=true;
            this.postsService.updateRegistroPacienteAddComentario(JSON.stringify(copia)).subscribe(
                    res => {
						//this.registro = res.json();
						this.isCommenting=false;
						comentario.value="";
					},
					err=>{	
						this.isCommenting=false;
						if(!this.authenticationService.isLoggedIn()){
							window.location.reload();
						}else{
							this.flashMessagesService.show('Error realizando comentario', {
						  classes: ['alert', 'alert-danger'], // You can pass as many classes as you need
						  timeout: 3000, // Default is 3000
						});
						}
						
					}
            );
			
        }
    }

    saltoLinea(textarea: any) {
        textarea.value = textarea.value + '\n';
    }

	eliminarComentario(id:string,event:any){
		event.preventDefault();
		let copia = <any> JSON.parse(JSON.stringify(this.registro));
		let index = copia.comentarios.indexOf(copia.comentarios.filter(comentario => comentario.id == id)[0]);
		copia.comentarios.splice(index, 1);
		copia.pacienteUpdate=this.pacienteSesion;
		this.postsService.updateRegistroPacienteDeleteComentario(JSON.stringify(copia)).subscribe(
                    res => {
						//this.registro = res.json();
					},
					err=>{
						if(!this.authenticationService.isLoggedIn()){
							window.location.reload();
						}else{
							this.flashMessagesService.show('Error eliminando comentario', {
							  classes: ['alert', 'alert-danger'], // You can pass as many classes as you need
							  timeout: 3000, // Default is 3000
							});
						}
					}
            );
	}

	ocultarPost(){
		event.preventDefault();
		this.postsService.updateRegistroPacienteHide(this.registro).subscribe(
				res => {
					//console.log("ocultacion exitosa");
				},
				err =>{
					if(!this.authenticationService.isLoggedIn()){
							window.location.reload();
						}else{
					this.flashMessagesService.show('Error! no se pudo ocultar la publicación', {
							  classes: ['alert', 'alert-danger'], // You can pass as many classes as you need
							  timeout: 4000, // Default is 3000
						});}
				}
			);
	}
	
	eliminarPost(){
		event.preventDefault();
		this.postsService.updateRegistroPacienteDelete(this.registro).subscribe(
				res => {
					//console.log("eliminacion exitosa");
				},
				err =>{
					if(!this.authenticationService.isLoggedIn()){
							window.location.reload();
						}else{
					this.flashMessagesService.show('Error! no se pudo eliminar la publicación', {
							  classes: ['alert', 'alert-danger'], // You can pass as many classes as you need
							  timeout: 4000, // Default is 3000
						});}
				}
			);
	}
	
	onScrollDown(event:any){
				console.log("gow");

		var suma:number = this._el.nativeElement.getBoundingClientRect().top + this._el.nativeElement.offsetHeight;
		if(80>suma){
			console.log(this.registro.pensamiento +  " : desaparece")
		}else{
			console.log(this.registro.pensamiento + "  : viewport")
		}
		
	}
	
	devuelveComentariosFiltrados(comentarios: Array<any>):any[]{
		if(comentarios.length>10 && !this.mostrarComentarios){
			return comentarios.filter(comentario=> comentarios.indexOf(comentario)+1>(comentarios.length*0.8));
		}else{
			return comentarios;
		}
		
	}
	

}