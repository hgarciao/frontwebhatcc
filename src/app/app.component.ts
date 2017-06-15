import { Component } from '@angular/core';
import {
    GlobalService
} from './_services/global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  
  constructor(public globalService: GlobalService) {
  }
}
