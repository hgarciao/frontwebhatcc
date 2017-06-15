import {
    Component,
    OnInit,
	ElementRef,
	HostListener,
	ViewChild
} from '@angular/core';
import {
    DatePipe
} from '@angular/common';
import {
    PostsService
} from '../../_services/posts.service';
import {
    GlobalService
} from '../../_services/global.service';
import {
    MdProgressSpinnerModule
} from '@angular/material';
import {
    MaterialModule
} from '@angular/material';
import {
    AuthenticationService
} from '../../_services/authentication.service';
import {
    IOption
} from 'ng-select';
import {
    PostComponent
} from './post/post.component';

@Component({
    selector: 'app-posts',
    templateUrl: './posts.component.html',
    styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

    variables: Array < any > = [];
    registros: Array < any > = [];
	@ViewChild('form') form;

    constructor(private postsService: PostsService, private authenticationService: AuthenticationService, private globalService: GlobalService, private elementRef: ElementRef) {}



    ngOnInit() {

        this.globalService.displayLoader();


        this.postsService.getRegistrosPacientes(this.authenticationService.decodeToken()['sub']).subscribe(
            res => {
                this.registros = res.json();
                this.postsService.getVariablesFormulario().subscribe(
                    res1 => {
                        this.variables = res1.json();
                        for (let variable of this.variables) {
                            if (variable.opciones != null) {
                                variable.opciones.forEach(function(part, index, theArray) {
                                    theArray[index] = {
                                        value: theArray[index],
                                        label: theArray[index].valor
                                    }
                                });
                            }
                        }

                        this.globalService.hideLoader();

                    }
                );
            }
        );


    }

    guardaRegistroPost(form: any) {

        if (form.valid) {
            let value = form.value;
            var registro: any = {}
            registro.campos = [];
            let datePipe: DatePipe = new DatePipe('en-US');
            registro.fechahora = datePipe.transform(Date.now(), 'yyyy-MM-ddTHH:mm:ss.sss') + 'Z';
            registro.paciente = this.authenticationService.decodeToken()['sub'];
            for (var key in value) {
                switch (key) {
                    case "post":
                        {
                            registro.post = value[key]
                            break;
                        }
                    case "pensamiento":
                        {
                            registro.pensamiento = value[key]
                            break;
                        }
                    default:
                        {
                            if (value[key] != "") {
                                if (value[key] instanceof Array) {
                                    registro.campos.push({
                                        nombreRegistroVariable: key,
                                        opciones: value[key]
                                    });
                                } else {
                                    registro.campos.push({
                                        nombreRegistroVariable: key,
                                        opciones: [value[key]]
                                    });
                                }
                            }
                            break;
                        }
                }

            }
            console.log(JSON.stringify(registro));
            this.globalService.displayLoader();
            this.postsService.saveRegistroFormulario(JSON.stringify(registro)).subscribe(
                res => {
                    this.globalService.hideLoader();
                }
            );
        }
    }
	

	dismissPostModal(){
		this.form.reset();
	}

}