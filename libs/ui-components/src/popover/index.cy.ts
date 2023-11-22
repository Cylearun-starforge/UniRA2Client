import { h } from 'vue';
import Popover from './index';

describe('<CyPopover />', () => {
  it('renders', () => {
    cy.mount(
      h(
        Popover,
        { forceVisible: false },
        {
          default: () =>
            h(
              'div',
              { style: { width: '150px', height: '80px', background: 'red' } },
              'content'
            ),
          trigger: () =>
            h(
              'button',
              { style: { width: '100px', height: '100px' } },
              'trigger'
            ),
        }
      )
    );
  });
});
