import { ErrorHandler, Injectable } from '@angular/core';
import { filter, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandlerService {

  private readonly error$: Subject<string> = new Subject<string>();

  handleError(error: any) {
    const value = error?.message.toString();
    this.error$.next(value);
  }

  get errors$(): Observable<string> {
    return this.error$.asObservable().pipe(filter(Boolean));
  }
}

@Injectable()
export class AppGlobalErrorhandler implements ErrorHandler {
  constructor(private errorHandlerService: GlobalErrorHandlerService) {}

  handleError(error: any) {
    this.errorHandlerService.handleError(error);
    console.error(error);
  }
}
