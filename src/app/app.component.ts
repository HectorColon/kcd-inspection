import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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

  constructor(private _carWashService: CarWashService) {}
  title = `Kathy's Car Was and Detailing`;

  ngOnInit(): void {
    this._carWashService.user.subscribe(res => {
      this.user = res;
    });
  }

  logout(): void {
    this._carWashService.logout.next();
    this.user = undefined;
  }
}
