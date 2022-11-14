import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AppSettingsService {

    constructor(private http: HttpClient) {
        var obj;
        this.getJSON().subscribe(data => obj = data, error => console.log(error));
    }

    getJSON(): Observable<any> {
        return this.http.get('../data/APP11_editor.json')/* .pipe(
            map((res: any) => { console.log('res', res);
            return res.json() })
        ) *//* .catch((error:any) => console.log(error)); */

    }

}