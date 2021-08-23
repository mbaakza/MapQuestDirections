import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private http: HttpClient) { }

  getMap(origin:string, destination:string): Observable<any> {
    let url: string = 
    `https://open.mapquestapi.com/directions/v2/route?key=vZMCh8BbGZzktGzsXj7XLXigVRKSplfC&from=${origin}&to=${destination}`;
    //return this.http.jsonp(url, 'jsoncallback')  
    return this.http.get(url);
  }
}
