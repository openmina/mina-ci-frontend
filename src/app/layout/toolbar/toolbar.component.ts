import { ChangeDetectionStrategy, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { delay, filter, map } from 'rxjs';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { selectAppMenu } from '@app/app.state';
import { LoadingService } from '@core/services/loading.service';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { AppMenu } from '@shared/types/app/app-menu.type';
import { DOCUMENT } from '@angular/common';
import { ThemeType } from '@shared/types/core/theme/theme-types.type';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { ReportingGetReports } from '@reporting/reporting.actions';

@Component({
  selector: 'mina-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-row align-center border-bottom bg-surface' },
})
export class ToolbarComponent extends StoreDispatcher implements OnInit {

  title: string = 'Reports';
  isMobile: boolean;
  currentTheme: ThemeType;

  @ViewChild('loadingRef') private loadingRef: ElementRef<HTMLDivElement>;

  constructor(@Inject(DOCUMENT) private readonly document: Document,
              private router: Router,
              private loadingService: LoadingService) { super(); }

  ngOnInit(): void {
    this.currentTheme = localStorage.getItem('theme') as ThemeType;
    this.listenToTitleChange();
    this.listenToMenuChange();
    this.listenToLoading();
  }

  changeTheme(): void {
    const theme: ThemeType = this.document.body.classList.contains(ThemeType.LIGHT) ? ThemeType.DARK : ThemeType.LIGHT;
    this.currentTheme = theme;
    const transitionToken: string = 'theme-transition';

    this.document.body.classList.add(transitionToken);
    this.document.body.classList.remove(ThemeType.DARK, ThemeType.LIGHT);
    this.document.body.classList.add(theme);

    localStorage.setItem('theme', theme);
    setTimeout(() => this.document.body.classList.remove(transitionToken), 700);
  }

  private listenToLoading(): void {
    const displayNone: string = 'd-none';
    const classList = this.loadingRef.nativeElement.classList;

    this.loadingService.countSub$
      .pipe(delay(0))
      .subscribe((count: number) => {
        if (count > 0) {
          classList.remove(displayNone);
        } else {
          classList.add(displayNone);
        }
      });
  }

  private listenToMenuChange(): void {
    this.select(selectAppMenu, (menu: AppMenu) => {
      this.isMobile = menu.isMobile;
      this.detect();
    }, filter(menu => menu.isMobile !== this.isMobile));
  }

  private listenToTitleChange(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route: ActivatedRoute = this.router.routerState.root;
          while (route!.firstChild) {
            route = route.firstChild;
          }
          return route.snapshot.data[Object.getOwnPropertySymbols(route.snapshot.data)[0]];
        }),
      )
      .subscribe((title: string) => {
        if (title) {
          this.title = title.split('- ')[1];
          this.detect();
        }
      });
  }

  refetchReports(): void {
    this.dispatch(ReportingGetReports);
  }
}
