import {
    Component,
    OnInit,
    Input,
    Output
} from '@angular/core';
import {
    MaterialModule
} from '@angular/material';
import {
    Registro
} from '../../../_domain/registro';


@Component({
    selector: 'post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.css']
})

export class PostComponent implements OnInit {

    @Input() registro: any;
	tags: Array<string> = [];

    constructor() {}

    ngOnInit() {
        
		let tags = this.tags;
        if (this.registro.campos != null) {
            this.registro.campos.forEach(function(campo) {
				let opcs = '';
				campo.opciones.forEach(function(opcion) {opcs = opcs + " " + opcion.valor})
				opcs = campo.nombreRegistroVariable + " :" + opcs;
				tags.push(opcs);
            });
        }
    }
}