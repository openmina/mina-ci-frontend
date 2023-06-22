import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { stateSliceAsPromise } from '../../../support/commands';
import { ReportingCompareState } from '@reporting/compare/reporting-compare.state';

const condition = (state: ReportingCompareState) => state && state.reports.length === 2 && !!state.reports[0] && !!state.reports[1];
const getBuilds = (store: Store<MinaState>) => stateSliceAsPromise<ReportingCompareState>(store, condition, 'reporting', 'compare');

describe('REPORTING COMPARE FIRST SECTION', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl + '/compare');
  });

  it('display two builds to compare', () => {
    cy.window()
      .its('store')
      .then(getBuilds)
      .then((state: ReportingCompareState) => {
        if (condition(state)) {
          expect(state.reports.length).to.equals(2);
          cy.get('mina-reporting-compare-first-section .build')
            .should('have.length', 2);
        }
      });
  });

  it('display correct name of the 2 builds', () => {
    cy.window()
      .its('store')
      .then(getBuilds)
      .then((state: ReportingCompareState) => {
        if (condition(state)) {
          cy.get('mina-reporting-compare-first-section .build')
            .find('> div:nth-child(1) a')
            .each((a: any, i: number) => expect(a.text().trim()).equals(state.reports[i].message));
        }
      });
  });

  it('display correct build number of the 2 builds', () => {
    cy.window()
      .its('store')
      .then(getBuilds)
      .then((state: ReportingCompareState) => {
        if (condition(state)) {
          cy.get('mina-reporting-compare-first-section .build')
            .find('> div:nth-child(1) button div span:nth-child(1)')
            .each((span: any, i: number) => expect(span.text().trim()).contains(state.reports[i].number));
        }
      });
  });

  it('display 3 delta graphs', () => {
    cy.window()
      .its('store')
      .then(getBuilds)
      .then((state: ReportingCompareState) => {
        if (condition(state)) {
          cy.get('mina-reporting-compare-first-section .border.border-rad-6 mina-reporting-graph svg')
            .should('have.length', 3);
        }
      });
  });

  it('display avg values', () => {
    cy.window()
      .its('store')
      .then(getBuilds)
      .then((state: ReportingCompareState) => {
        if (condition(state)) {
          const build1 = state.reports[0];
          const build2 = state.reports[1];
          cy.get('mina-reporting-compare-first-section .border.border-rad-6:nth-child(4) div:nth-child(3) > span:nth-child(1)')
            .each((span: any) => {
              expect(span.text().trim()).contains('Avg');
              expect(span.text().trim()).contains(build1.blockProductionAvgDelta.toString());
              expect(span).to.have.class((build1.blockProductionAvgDelta <= build2.blockProductionAvgDelta) ? 'ok' : 'not-ok');
            })
            .get('mina-reporting-compare-first-section .border.border-rad-6:nth-child(5) div:nth-child(3) > span:nth-child(1)')
            .each((span: any) => {
              expect(span.text().trim()).contains('Avg');
              expect(span.text().trim()).contains(build1.receiveLatencyAvgDelta.toString());
              expect(span).to.have.class((build1.receiveLatencyAvgDelta <= build2.receiveLatencyAvgDelta) ? 'ok' : 'not-ok');
            })
            .get('mina-reporting-compare-first-section .border.border-rad-6:nth-child(6) div:nth-child(3) > span:nth-child(1)')
            .each((span: any) => {
              expect(span.text().trim()).contains('Avg');
              expect(span.text().trim()).contains(build1.blockApplicationAvgDelta.toString());
              expect(span).to.have.class((build1.blockApplicationAvgDelta <= build2.blockApplicationAvgDelta) ? 'ok' : 'not-ok');
            });
        }
      });
  });

  it('display max values', () => {
    cy.window()
      .its('store')
      .then(getBuilds)
      .then((state: ReportingCompareState) => {
        if (condition(state)) {
          console.log(state.reports[0].status);
          const build1 = state.reports[0];
          const build2 = state.reports[1];
          cy.get('mina-reporting-compare-first-section .border.border-rad-6:nth-child(4) div:nth-child(3) > span:nth-child(2)')
            .each((span: any) => {
              expect(span.text().trim()).contains('Max');
              expect(span.text().trim()).contains(build1.blockProductionMaxDelta.toString());
              expect(span).to.have.class((build1.blockProductionMaxDelta <= build2.blockProductionMaxDelta) ? 'ok' : 'not-ok');
            })
            .get('mina-reporting-compare-first-section .border.border-rad-6:nth-child(5) div:nth-child(3) > span:nth-child(2)')
            .each((span: any) => {
              expect(span.text().trim()).contains('Max');
              expect(span.text().trim()).contains(build1.receiveLatencyMaxDelta.toString());
              expect(span).to.have.class((build1.receiveLatencyMaxDelta <= build2.receiveLatencyMaxDelta) ? 'ok' : 'not-ok');
            })
            .get('mina-reporting-compare-first-section .border.border-rad-6:nth-child(6) div:nth-child(3) > span:nth-child(2)')
            .each((span: any) => {
              expect(span.text().trim()).contains('Max');
              expect(span.text().trim()).contains(build1.blockApplicationMaxDelta.toString());
              expect(span).to.have.class((build1.blockApplicationMaxDelta <= build2.blockApplicationMaxDelta) ? 'ok' : 'not-ok');
            });
        }
      });
  });

  it('display 50 bars per graph', () => {
    cy.window()
      .its('store')
      .then(getBuilds)
      .then((state: ReportingCompareState) => {
        if (condition(state)) {
          cy.get('mina-reporting-compare-first-section .border.border-rad-6')
            .each((graph: any) => {
              expect(graph.find('mina-reporting-graph svg g g.bars-container rect.bar').length).to.equals(50);
              expect(graph.find('mina-reporting-graph svg g g.bars-container rect.bar').length).to.equals(50);
              expect(graph.find('mina-reporting-graph svg g g.bars-container rect.bar').length).to.equals(50);
            });
        }
      });
  });

  it('change first build', () => {
    cy.window()
      .its('store')
      .then(getBuilds)
      .then((state: ReportingCompareState) => {
        if (condition(state) && state.allReports.length > 2) {
          const initialBuild = state.reports[0].number;
          const secondBuild = state.reports[1].number;
          cy.get('mina-reporting-compare-first-section div:nth-child(1) .build div:nth-child(1) button')
            .click()
            .get('.dropdown div .dropdown-item:nth-child(3)')
            .click()
            .wait(2000)
            .window()
            .its('store')
            .then(getBuilds)
            .then((state: ReportingCompareState) => {
              expect(state.reports[0].number).not.to.equals(initialBuild);
              expect(state.reports[1].number).to.equals(secondBuild);
            });
        }
      });
  });

  it('change second build', () => {
    cy.window()
      .its('store')
      .then(getBuilds)
      .then((state: ReportingCompareState) => {
        if (condition(state) && state.allReports.length > 2) {
          const initialBuild = state.reports[0].number;
          const secondBuild = state.reports[1].number;
          cy.get('mina-reporting-compare-first-section div:nth-child(3) .build div:nth-child(1) button')
            .click()
            .get('.dropdown div .dropdown-item:nth-child(3)')
            .click()
            .wait(2000)
            .window()
            .its('store')
            .then(getBuilds)
            .then((state: ReportingCompareState) => {
              expect(state.reports[1].number).not.to.equals(secondBuild);
              expect(state.reports[0].number).to.equals(initialBuild);
            });
        }
      });
  });
});
