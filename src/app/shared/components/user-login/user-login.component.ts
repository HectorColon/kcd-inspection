import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import * as lzString from 'lz-string';
import { take } from 'rxjs/operators';
import { CarWashService } from 'src/app/services/carwash.service';
import { User } from '../../models/user.model';

@Component({
    selector: 'app-user-login',
    templateUrl: './user-login.component.html',
    styleUrls: ['./user-login.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UserLoginComponent implements OnInit {

    users: User[] = [];
    isPasswordIncorrect: boolean = false;
    passwordFormControl: FormControl = new FormControl('');
    remember: FormControl = new FormControl('');

    private getIP(): any {
        return this._http.get("https://api.ipify.org/?format=json");
    }

    constructor(private _carWashService: CarWashService,
        private _http: HttpClient,
        public dialogRef: MatDialogRef<UserLoginComponent>) { }

    ngOnInit() {
        this._carWashService.getUsers().pipe(take(1)).subscribe(res => {
            this.users = res;
        });
    }

    login(): void {
        let existUser = this.users.find(u => lzString.decompressFromBase64(u.password) === this.passwordFormControl.value);
        // GET IP ADDRESS TO STAY LOGGED
        this.getIP().subscribe(res => {
            if (existUser) {
                existUser.isLoggedIn = this.remember.value;
                existUser.ip = this.remember.value ? lzString.compressToBase64(res.ip) : '';
                this.dialogRef.close(existUser);
                this.isPasswordIncorrect = false;
            } else {
                this.isPasswordIncorrect = true;
            }
        });
    }

    createPin(number?: string): void {
        if (number) {
            let pin = this.passwordFormControl.value;
            pin += number;
            this.passwordFormControl.setValue(pin);
        } else {
            let pin = this.passwordFormControl.value;
            pin = pin.slice(0, -1);
            this.passwordFormControl.setValue(pin);
        }
    }
}
