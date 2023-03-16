import { APP_INITIALIZER, Injectable, Provider } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@Injectable({ providedIn: 'root' })
export class IconRegisterService {

  constructor(private iconRegistry: MatIconRegistry,
              private sanitizer: DomSanitizer) { }

  registerIcons(): void {
    this.iconRegistry.addSvgIcon('drone', this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/drone.svg'));
    this.iconRegistry.addSvgIcon('loading', this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/loading.svg'));
  }
}

export const ICONS_PROVIDER: Provider = {
  provide: APP_INITIALIZER,
  useFactory: (matIconService: IconRegisterService) => {
    return () => matIconService.registerIcons();
  },
  deps: [IconRegisterService],
  multi: true,
};
