import Index from './index';

describe('<Index />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(Index, {
      props: {
        value: '1',
        candidates: [{display: 'option-1', value: '1'}]
      }
    })
  })
})