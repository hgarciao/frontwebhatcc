import { ModuleWithProviders } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { NewsComponent } from './news/news.component';
import { NavbarComponent } from './home/navbar/navbar.component';
import { SidebarComponent } from './home/sidebar/sidebar.component';
import { PostsComponent } from './home/posts/posts.component'
import { PostsUnfvComponent } from './home/posts-unfv/posts-unfv.component'
import { PostsUnfv2Component } from './home/posts-unfv2/posts-unfv2.component'
import { SingleComponent } from './home/single/single.component'
import { ProfileComponent } from './home/profile/profile.component';
import { CanActivateHome} from './_guards/can-activate-home';
import { CanActivateLogin} from './_guards/can-activate-login';
import { CanActivateByRole} from './_guards/can-activate-by-role';
import { CanActivateNews} from './_guards/can-activate-news';


export const router: Routes = [
  { path: '',redirectTo:'login',pathMatch:'full'},
  { path: 'login', component: LoginComponent,canActivate: [CanActivateLogin]},
  { path: 'news', component: NewsComponent,canActivate: [CanActivateNews]},
  { path: 'home',canActivate: [CanActivateHome],
	children: [
			{ path: 'paciente',component: HomeComponent,canActivate: [CanActivateByRole],data: {
			  role: 'ROLE_PACIENTE'},children :
				[
					{ path: '', component: NavbarComponent, outlet: 'navbar'},
					{ path: 'postsold', component: PostsComponent, outlet: 'contenido'},
					{ path: 'posts', component: PostsUnfvComponent, outlet: 'contenido'},
					{ path: 'postsunfv2', component: PostsUnfv2Component, outlet: 'contenido'},
					{ path: 'single', component: SingleComponent, outlet: 'contenido'}
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