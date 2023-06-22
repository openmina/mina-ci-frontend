import { APP_INITIALIZER, Injectable, Provider } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@Injectable({ providedIn: 'root' })
export class IconRegisterService {

  constructor(private iconRegistry: MatIconRegistry,
              private sanitizer: DomSanitizer) { }

  registerIcons(): void {
    const icons = ['drone', 'loading', 'circle-dash', 'github'];
    icons.forEach(icon => {
      this.iconRegistry.addSvgIcon(icon, this.sanitizer.bypassSecurityTrustResourceUrl(`assets/images/icons/${icon}.svg`));
    });
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
