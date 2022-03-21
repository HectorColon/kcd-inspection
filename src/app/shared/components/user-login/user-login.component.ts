import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { take } from 'rxjs/operators';
import { CarWashService } from 'src/app/services/carwash.service';
import { User } from '../../models/user.model';
import * as lzString from 'lz-string';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserLoginComponent implements OnInit {
  
  users: User[]=[];
  isPasswordIncorrect: boolean = false;
  passwordFormControl: FormControl = new FormControl('');

  constructor(private _carWashService: CarWashService,
              public dialogRef: MatDialogRef<UserLoginComponent>) { }

  ngOnInit() {
    this._carWashService.getUsers().pipe(take(1)).subscribe(res => {
      this.users = res;
    });
  }

  login(): void {
    let existUser = this.users.find(u => lzString.decompressFromBase64(u.password) === this.passwordFormControl.value);

    if (existUser) {
      this.dialogRef.close(existUser);
      this.isPasswordIncorrect = false;
    } else {
      this.isPasswordIncorrect = true;
    }
  }

  createPin(number: string): void {
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
