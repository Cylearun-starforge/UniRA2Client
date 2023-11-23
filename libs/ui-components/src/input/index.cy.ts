import CyInput from './index';

describe('CyInput', () => {
  it('can input value', () => {
    // see: https://on.cypress.io/mounting-vue
    const onChange = cy.spy().as('onChangeSpy');
    cy.mount(CyInput, {
      props: {
        value: 'hello world',
        onChange,
        width: 200,
      },
    });
    cy.get('input').type('!');
    cy.get('@onChangeSpy').should('be.calledWith', 'hello world!');
  });

  it('supports input type', () => {
    const a = cy.mount(CyInput, {
      props: {
        type: 'email',
      },
    });
  });

  it('supports placeholder', () => {
    cy.mount(CyInput, {
      props: {
        placeholder: 'test',
        style: {
          width: '240px',
        },
      },
    });

    cy.get('[role="placeholder"]')
      .should('exist')
      .should('contain.text', 'test');
  });
});
