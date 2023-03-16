import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@core/services/config.service';
import { Observable } from 'rxjs';

export abstract class HttpService {

  protected http: HttpClient = inject<HttpClient>(HttpClient);
  protected config: ConfigService = inject<ConfigService>(ConfigService);

  private readonly gql: string = '/graphql';

  protected constructor() { }

  protected get<T>(url: string): Observable<T> {
    return this.http.get<T>(this.config.API + this.gql + url);
  }
}
