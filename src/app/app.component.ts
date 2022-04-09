import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import * as lzString from 'lz-string';
import { take } from 'rxjs/operators';
import { CarWashService } from './services/carwash.service';
import { User } from './shared/models/user.model';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

    user: User;
    currentIP: string;

    private getIP(): any {
        return this._http.get("http://api.ipify.org/?format=json");
    }

    constructor(private _carWashService: CarWashService,
                private _http: HttpClient,
                private _route: Router) { }
    title = `Kathy's Car Was and Detailing`;

    ngOnInit(): void {
        this._carWashService.user.subscribe(res => {
            this.user = res;
        });

        // GET IP ADDRESS
        this.getIP().subscribe(res => {
            this.currentIP = res.ip;
        })

        // USER LOGGED
        this._carWashService.getUsers().pipe(take(1)).subscribe(res => {
            let userLogged = res.find(x => lzString.decompressFromBase64(x.ip) === this.currentIP && x.isLoggedIn === true);

            if (userLogged) {
                this.user = userLogged;
                this._carWashService.logged.next(true);
                this._carWashService.isLoggedIn = true;
                this._carWashService.setUserLogged = userLogged;
            } else {
                this._carWashService.logged.next(false);
                this._carWashService.isLoggedIn = false;
            }
        });
    }

    logout(): void {
        this._carWashService.logout.next();
        this.user.ip = '';
        this.user.isLoggedIn = false;
        this._carWashService.updateUserStatus(this.user);
        this.user = undefined;
    }
}
