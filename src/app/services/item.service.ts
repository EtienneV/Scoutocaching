import {Injectable,Inject} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Item} from "@content/model/item";
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ItemService {

http: HttpClient;
BASE_URL : string;
items : Observable<Item[]>;
  constructor( @Inject(HttpClient) http: HttpClient) {
    this.http = http;
  }

  read(BASE_URL : string) {
    this.BASE_URL=BASE_URL;
    this.items = this.http.get<Item[]>(BASE_URL)
    return this.items
  }
  all(){
    if(this.BASE_URL != null){
      return this.read(this.BASE_URL)
    }else{
      return null  
    }
  }
  public fileExists(url: string): Observable<boolean> {
    return this.http.get(url).pipe(
      map(response => {
        return true;
    }),
    catchError(error => {
        return of(false);
    })
    );
}
  clear() {
    this.items = new Observable<Item[]>();
    return this.items;
  }
}
