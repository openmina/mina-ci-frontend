import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { stateSliceAsPromise } from '../../../support/commands';
import { ReportingBuildsState } from '@reporting/builds/reporting-builds.state';
import { Report } from '@shared/types/reporting/report.type';

const condition = (state: ReportingBuildsState) => state && state.reports.length > 1;
const getBuilds = (store: Store<MinaState>) => stateSliceAsPromise<ReportingBuildsState>(store, condition, 'reporting', 'builds');

describe('REPORTING BUILDS TABLE', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl + '/builds');
  });

  it('display builds in the table', () => {
    cy.window()
      .its('store')
      .then(getBuilds)
      .then((state: ReportingBuildsState) => {
        if (condition(state)) {
          expect(state.reports.length).to.be.greaterThan(1);
          cy.get('mina-reporting-builds-table .mina-table')
            .get('.c-row')
            .should('have.length.above', 1);
        }
      });
  });

  it('display correct number of transactions in the table', () => {
    cy.window()
      .its('store')
      .then(getBuilds)
      .then((state: ReportingBuildsState) => {
        if (condition(state)) {
          const build = state.reports[0];
          cy.get('mina-reporting-builds-table .mina-table')
            .get('.c-row')
            .first()
            .find('.c-row-content .info div:nth-child(4) div:nth-child(1) span')
            .first()
            .then((span: any) => expect(span.text()).equals(build.transactions.toString()));
        }
      });
  });

  it('display correct number of blocks in the table', () => {
    cy.window()
      .its('store')
      .then(getBuilds)
      .then((state: ReportingBuildsState) => {
        if (condition(state)) {
          const build = state.reports[0];
          cy.get('mina-reporting-builds-table .mina-table')
            .get('.c-row')
            .first()
            .find('.c-row-content .info div:nth-child(4) div:nth-child(1) span')
            .last()
            .then((span: any) => expect(span.text()).equals(build.blockCount.toString()));
        }
      });
  });

  it('display correct status in the table', () => {
    cy.window()
      .its('store')
      .then(getBuilds)
      .then((state: ReportingBuildsState) => {
        if (condition(state)) {
          const build = state.reports[0];
          cy.get('mina-reporting-builds-table .mina-table')
            .get('.c-row')
            .first()
            .find('.c-row-content .info div:nth-child(3) span:nth-child(2)')
            .then((span: any) => expect(span.text().trim()).equals(build.status.toString()));
        }
      });
  });

  it('display correct regression status in the table', () => {
    cy.window()
      .its('store')
      .then(getBuilds)
      .then((state: ReportingBuildsState) => {
        if (condition(state)) {
          const build = state.reports[0];
          const regressionText = build.status === 'success'
            ? (build.isRegression ? 'regression' : 'passed')
            : 'no verdict';
          cy.get('mina-reporting-builds-table .mina-table')
            .get('.c-row')
            .first()
            .find('.c-row-content .info div:nth-child(3) span:nth-child(5)')
            .then((span: any) => expect(span.text().trim().toLowerCase()).equals(regressionText));
        }
      });
  });

  it('display correct commit number in the table', () => {
    cy.window()
      .its('store')
      .then(getBuilds)
      .then((state: ReportingBuildsState) => {
        if (condition(state)) {
          const build = state.reports[0];
          cy.get('mina-reporting-builds-table .mina-table')
            .get('.c-row')
            .first()
            .find('.c-row-content .info span:nth-child(2) a')
            .then((span: any) => expect(span.text().trim()).equals(build.commit.slice(0, 7)));
        }
      });
  });

  it('display correct branch name in the table', () => {
    cy.window()
      .its('store')
      .then(getBuilds)
      .then((state: ReportingBuildsState) => {
        if (condition(state)) {
          const build = state.reports[0];
          cy.get('mina-reporting-builds-table .mina-table')
            .get('.c-row')
            .first()
            .find('.c-row-content .info span:nth-child(2) span:nth-child(3)')
            .then((span: any) => expect(span.text().trim()).equals('to ' + build.branch));
        }
      });
  });

  it('display correct date in the table', () => {
    cy.window()
      .its('store')
      .then(getBuilds)
      .then((state: ReportingBuildsState) => {
        if (condition(state)) {
          const build = state.reports[0];
          cy.get('mina-reporting-builds-table .mina-table')
            .get('.c-row')
            .first()
            .find('.c-row-content .info span:nth-child(2) span:nth-child(4)')
            .then((span: any) => expect(span.text().trim()).equals(build.timeAgo + ' ago · ' + build.started));
        }
      });
  });

  it('display 3 graphs per row', () => {
    cy.window()
      .its('store')
      .then(getBuilds)
      .then((state: ReportingBuildsState) => {
        if (condition(state)) {
          cy.get('mina-reporting-builds-table .mina-table')
            .get('.c-row .c-row-content .graphs')
            .each((graph: any) => {
              expect(graph.find('> div mina-reporting-graph').length).to.equals(3);
            });
        }
      });
  });

  it('display 50 bars per graph and check correct color of each bar', () => {
    cy.window()
      .its('store')
      .then(getBuilds)
      .then((state: ReportingBuildsState) => {
        if (condition(state)) {
          cy.get('mina-reporting-builds-table .mina-table')
            .get('.c-row .c-row-content .graphs')
            .each((graph: any) => {
              expect(graph.find('> div:nth-child(1) mina-reporting-graph svg g g.bars-container rect.bar').length).to.equals(50);
              expect(graph.find('> div:nth-child(2) mina-reporting-graph svg g g.bars-container rect.bar').length).to.equals(50);
              expect(graph.find('> div:nth-child(3) mina-reporting-graph svg g g.bars-container rect.bar').length).to.equals(50);
              expect(graph.find('> div:nth-child(1) mina-reporting-graph svg g g.bars-container rect.bar')).has.attr('fill', 'var(--special-selected-alt-2-primary)');
              expect(graph.find('> div:nth-child(2) mina-reporting-graph svg g g.bars-container rect.bar')).has.attr('fill', 'var(--special-selected-alt-1-primary)');
              expect(graph.find('> div:nth-child(3) mina-reporting-graph svg g g.bars-container rect.bar')).has.attr('fill', 'var(--special-selected-alt-3-primary)');
            });
        }
      });
  });

  it('display correct avg values', () => {
    cy.window()
      .its('store')
      .then(getBuilds)
      .then((state: ReportingBuildsState) => {
        if (condition(state)) {
          cy.get('mina-reporting-builds-table .mina-table .c-row')
            .then((rows: any) => {
              state.reports.slice(0, rows.length).forEach((build: Report, i: number) => {
                cy.get('mina-reporting-builds-table .mina-table')
                  .get('.c-row')
                  .eq(i)
                  .find('.c-row-content .graphs > div:nth-child(1) > div:nth-child(1) > div > span:nth-child(1)')
                  .each((span: any) => {
                    expect(span.text().trim()).contains('Avg');
                    expect(span.text().trim()).contains(build.blockProductionAvg.toString());
                    expect(span).to.have.class((i < state.reports.length - 1 && build.blockProductionAvg <= state.reports[i + 1].blockProductionAvg) ? 'ok' : 'not-ok');
                  })
                  .get('mina-reporting-builds-table .mina-table')
                  .get('.c-row')
                  .eq(i)
                  .find('.c-row-content .graphs > div:nth-child(2) > div:nth-child(1) > div > span:nth-child(1)')
                  .each((span: any) => {
                    expect(span.text().trim()).contains('Avg');
                    expect(span.text().trim()).contains(build.latencyAvg.toString());
                    expect(span).to.have.class((i < state.reports.length - 1 && build.latencyAvg <= state.reports[i + 1].latencyAvg) ? 'ok' : 'not-ok');
                  })
                  .get('mina-reporting-builds-table .mina-table')
                  .get('.c-row')
                  .eq(i)
                  .find('.c-row-content .graphs > div:nth-child(3) > div:nth-child(1) > div > span:nth-child(1)')
                  .each((span: any) => {
                    expect(span.text().trim()).contains('Avg');
                    expect(span.text().trim()).contains(build.blockApplicationAvg.toString());
                    expect(span).to.have.class((i < state.reports.length - 1 && build.blockApplicationAvg <= state.reports[i + 1].blockApplicationAvg) ? 'ok' : 'not-ok');
                  });
              });
            });
        }
      });
  });

  it('display correct max values', () => {
    cy.window()
      .its('store')
      .then(getBuilds)
      .then((state: ReportingBuildsState) => {
        if (condition(state)) {
          cy.get('mina-reporting-builds-table .mina-table .c-row')
            .then((rows: any) => {
              state.reports.slice(0, rows.length).forEach((build: Report, i: number) => {
                cy.get('mina-reporting-builds-table .mina-table')
                  .get('.c-row')
                  .eq(i)
                  .find('.c-row-content .graphs > div:nth-child(1) > div:nth-child(1) > div > span:nth-child(2)')
                  .each((span: any) => {
                    expect(span.text().trim()).contains('Max');
                    expect(span.text().trim()).contains(build.blockProductionMax.toString());
                    expect(span).to.have.class((i < state.reports.length - 1 && build.blockProductionMax <= state.reports[i + 1].blockProductionMax) ? 'ok' : 'not-ok');
                  })
                  .get('mina-reporting-builds-table .mina-table')
                  .get('.c-row')
                  .eq(i)
                  .find('.c-row-content .graphs > div:nth-child(2) > div:nth-child(1) > div > span:nth-child(2)')
                  .each((span: any) => {
                    expect(span.text().trim()).contains('Max');
                    expect(span.text().trim()).contains(build.latencyMax.toString());
                    expect(span).to.have.class((i < state.reports.length - 1 && build.latencyMax <= state.reports[i + 1].latencyMax) ? 'ok' : 'not-ok');
                  })
                  .get('mina-reporting-builds-table .mina-table')
                  .get('.c-row')
                  .eq(i)
                  .find('.c-row-content .graphs > div:nth-child(3) > div:nth-child(1) > div > span:nth-child(2)')
                  .each((span: any) => {
                    expect(span.text().trim()).contains('Max');
                    expect(span.text().trim()).contains(build.blockApplicationMax.toString());
                    expect(span).to.have.class((i < state.reports.length - 1 && build.blockApplicationMax <= state.reports[i + 1].blockApplicationMax) ? 'ok' : 'not-ok');
                  });
              });
            });
        }
      });
  });

  it('open side panel', () => {
    cy.window()
      .its('store')
      .then(getBuilds)
      .then((state: ReportingBuildsState) => {
        if (condition(state)) {
          cy.get('mina-reporting-builds mina-reporting-builds-side-panel mina-reporting-detail')
            .should('not.be.visible')
            .get('mina-reporting-builds-table .mina-table .c-row')
            .eq(0)
            .click()
            .wait(1000)
            .get('mina-reporting-builds mina-reporting-builds-side-panel mina-reporting-detail')
            .should('be.visible');
        }
      });
  });

  it('close side panel', () => {
    cy.window()
      .its('store')
      .then(getBuilds)
      .then((state: ReportingBuildsState) => {
        if (condition(state)) {
          cy.get('mina-reporting-builds mina-reporting-builds-side-panel mina-reporting-detail')
            .should('not.be.visible')
            .get('mina-reporting-builds-table .mina-table .c-row')
            .eq(0)
            .click()
            .wait(1000)
            .get('mina-reporting-builds mina-reporting-builds-side-panel mina-reporting-detail')
            .should('be.visible')
            .get('mina-reporting-builds mina-reporting-builds-side-panel > div > div > .mina-icon')
            .click()
            .wait(1000)
            .get('mina-reporting-builds mina-reporting-builds-side-panel mina-reporting-detail')
            .should('not.be.visible')
        }
      });
  });

});
