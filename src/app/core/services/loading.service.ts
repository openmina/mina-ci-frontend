import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {

  count: number = 0;
  readonly countSub$: BehaviorSubject<number> = new BehaviorSubject<number>(this.count);

  addURL(): void {
    this.count++;
    this.countSub$.next(this.count);
  }

  removeURL(): void {
    this.count--;
    this.countSub$.next(this.count);
  }
}
