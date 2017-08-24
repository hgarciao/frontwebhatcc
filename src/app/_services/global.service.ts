import { Injectable } from '@angular/core';
import {
    LoaderService
} from '../_services/loader.service';

@Injectable()
export class GlobalService {
   
  objLoaderStatus: boolean;

  constructor(private loaderService: LoaderService) { 
          this.objLoaderStatus = false;

			this.loaderService.loaderStatus.subscribe((val: boolean) => {
            this.objLoaderStatus = val;

        });		  
  }
  
  displayLoader() {
      this.loaderService.displayLoader(true); // enable spinner
  }
  
  hideLoader(){
	  this.loaderService.displayLoader(false); // disable spinner
  }
	
  displayAlerta() {
      this.loaderService.displayLoader(true); // enable spinner
  }	
  

	
}
