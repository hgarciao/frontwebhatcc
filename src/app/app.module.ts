import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { routes } from './app.router'
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './home/navbar/navbar.component';
import { SidebarComponent } from './home/sidebar/sidebar.component';
import { PostsComponent } from './home/posts/posts.component';
import { HistorialComponent } from './home/historial/historial.component';
import { AuthenticationService} from './_services/authentication.service';
import { PostsService } from './_services/posts.service';
import { LoaderService } from './_services/loader.service';
import { GlobalService } from './_services/global.service';
import { CanActivateHome} from './_guards/can-activate-home';
import { CanActivateLogin} from './_guards/can-activate-login';
import { CanActivateByRole} from './_guards/can-activate-by-role';
import { MaterialModule } from '@angular/material';
import { ElasticModule } from 'angular2-elastic';
import { Http, RequestOptions } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import {SelectModule} from 'ng-select';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { PostComponent } from './home/posts/post/post.component';
import { TagInputModule } from 'ngx-chips';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { FlashMessagesModule } from 'ngx-flash-messages';
import { StompService } from 'ng2-stomp-service';
import { NotificacionComponent } from './home/navbar/notificacion/notificacion.component';
import { SingleComponent } from './home/single/single.component';
import { ProfileComponent } from './home/profile/profile.component';






export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
		tokenName: 'token',
		tokenGetter: (() => localStorage.getItem('token')),
		globalHeaders: [{'Content-Type':'application/json'}],
	}), http, options);
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    SidebarComponent,
    PostsComponent,
    HistorialComponent,
    PostComponent,
    NotificacionComponent,
    SingleComponent,
    ProfileComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpModule,
	routes,
	MaterialModule,
	ElasticModule,
	SelectModule,
	FormsModule,
	TagInputModule,
	Ng2Bs3ModalModule,
	FlashMessagesModule
	],
  providers: [AuthenticationService,PostsService ,{provide: AuthHttp,useFactory: authHttpServiceFactory,deps: [Http, RequestOptions]},CanActivateLogin,CanActivateHome,CanActivateByRole,LoaderService,GlobalService,StompService],
  bootstrap: [AppComponent]
})
export class AppModule { }
