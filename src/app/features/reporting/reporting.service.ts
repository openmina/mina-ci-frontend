import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Report } from '@shared/types/reporting/report.type';
import { ciReportsMocks } from '@reporting/ci-reports-mocks';
import { ReportDetail } from '@shared/types/reporting/report-detail.type';
import { activeReportDetailsLvl1 } from '@reporting/active-report-details1';

@Injectable({
  providedIn: 'root',
})
export class ReportingService {

  constructor() { }

  getReports(): Observable<Report[]> {
    return of(ciReportsMocks).pipe(delay(150));
  }

  getReportDetail(id: any): Observable<ReportDetail> {
    return of(activeReportDetailsLvl1).pipe(delay(150));
  }
}

