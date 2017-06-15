import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  
  private _opened: boolean = false;
  private _modeNum: number = 0;
  private _positionNum: number = 0;
  private _closeOnClickOutside: boolean = false;
  private _showBackdrop: boolean = false;
  private _animate: boolean = true;
  private _trapFocus: boolean = true;
  private _autoFocus: boolean = true;
  private _keyClose: boolean = false;

  private _MODES: Array<string> = ['over', 'push', 'dock'];
  private _POSITIONS: Array<string> = ['left', 'right', 'top', 'bottom'];


}
