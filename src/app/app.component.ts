import { Component } from '@angular/core';
import { MinaState } from '@app/app.setup';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: { class: 'overflow-hidden flex-column h-100' },
})
export class AppComponent {

  constructor(private store: Store<MinaState>) {
    if ((window as any).Cypress) {
      (window as any).store = store;
    }
  }
}
