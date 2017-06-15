import { ModuleWithProviders } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './home/navbar/navbar.component';
import { SidebarComponent } from './home/sidebar/sidebar.component';
import { PostsComponent } from './home/posts/posts.component'
import { HistorialComponent } from './home/historial/historial.component'
import { CanActivateHome} from './_guards/can-activate-home';
import { CanActivateLogin} from './_guards/can-activate-login';
import { CanActivateByRole} from './_guards/can-activate-by-role';



export const router: Routes = [
  { path: '',redirectTo:'login',pathMatch:'full'},
  { path: 'login', component: LoginComponent,canActivate: [CanActivateLogin]},
  { path: 'home',canActivate: [CanActivateHome],
	children: [
			{ path: 'paciente',component: HomeComponent,canActivate: [CanActivateByRole],data: {
			  role: 'ROLE_PACIENTE'},children :
				[
					{ path: '', redirectTo:'posts',pathMatch:'full' },
					{ path: '', component: NavbarComponent, outlet: 'navbar'},
					{ path: 'posts', component: PostsComponent}
				]
			},
            { path: 'terapeuta',component: HomeComponent,canActivate: [CanActivateByRole],data: {
			  role: 'ROLE_TERAPEUTA'}
			},
			{ path: 'admin', component: HomeComponent,canActivate: [CanActivateByRole],data: {
			  role: 'ROLE_ADMIN'}
			}
			]
  },
 {path: '**', redirectTo: 'home'}
  
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);