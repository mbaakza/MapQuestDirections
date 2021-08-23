import { Component, OnInit } from '@angular/core';
import { MapService } from './services/map.service';
import { Observable, Subject} from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MapService]
})

/*    NOTE TO FAZIL:

I usually like to recycle code instead of repeating 
it in multiple places, but I haven't done that here 
because I want to use this assignment to study for 
the Final Exam and leaving all the 'subscribe' and 'pipe' 
stuff in place will help me remember what goes where.

THANKS.
-Mehreen

*/


export class AppComponent implements OnInit {

  title = 'hw5-part1';
  dataItems: any;
  route: any;
  origin:any;
  destination:any;
  errorMsg:any;

  // a subject to publish search terms
  private searchTerms1: Subject<string> = new Subject<string>();
  private searchTerms2: Subject<string> = new Subject<string>();

  constructor(private mapService: MapService){
    this.origin = "Boston, MA";
    this.destination = "Cambridge, MA";
  }

  // Push a search term into the observable stream.
	setOrigin(origin: string): void {
	  this.searchTerms1.next(origin);
	}

  setDestination(destination: string): void {
	  this.searchTerms2.next(destination);
	}

  search(){
    this.mapService.getMap(this.origin, this.destination)
      .subscribe(result => 
            {
              //console.log(result);
              if(!result.route.legs){
                this.dataItems = undefined;
                this.errorMsg = "No results found. Start or End point(s) absent or invalid.";
                //this.hideTable();
              }
              else{
                this.errorMsg = "";
                this.dataItems = result;
                this.route = result.route.legs[0].maneuvers;
              }
            });
  }


  
  ngOnInit() {

    let input1 = document.getElementById("origin");
    input1?.setAttribute("value",this.origin);

    let input2 = document.getElementById("destination");
    input2?.setAttribute("value",this.destination);

    // Remove this line if directions should only appear after button click
  	this.search();


    this.searchTerms1.pipe(
  		// wait 1000ms after each keystroke before considering the term
  		debounceTime(1000),

  		// ignore new term if same as previous term
      	distinctUntilChanged(),
		  
      	switchMap((origin: string) => {
          this.origin = origin;          
        	return this.mapService.getMap(origin, this.destination);
      	})
  	)

    .subscribe((result:any)=> {
      //console.log(result);
      if(!result.route.legs){
        this.dataItems = undefined;
        this.errorMsg = "No results found. Start or End point(s) absent or invalid.";
        
      }
      else{
        this.errorMsg = "";
        this.dataItems = result;
        this.route = result.route.legs[0].maneuvers;
      }
    });


    this.searchTerms2.pipe(
  		// wait 1000ms after each keystroke before considering the term
  		debounceTime(1000),

  		// ignore new term if same as previous term
      	distinctUntilChanged(),
		  
      	switchMap((destination: string) => {
          this.destination = destination;          
        	return this.mapService.getMap(this.origin, destination);
      	})
  	)

    .subscribe((result:any)=> {
      console.log(result);
      if(!result.route.legs){
        this.dataItems = undefined;
        this.errorMsg = "No results found. Start or End point(s) absent or invalid.";
       
      }
      else{
        this.errorMsg = "";
        this.dataItems = result;
        this.route = result.route.legs[0].maneuvers;
      }
    
    });



  } // end ngOnInit    
  
  
}
