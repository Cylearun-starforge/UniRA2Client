import { h } from 'vue';
import Border from './index';

describe('<CyBorder />', () => {
  it('renders', () => {
    cy.mount(
      h(
        Border,
        {
          bottomCornerSize: {
            width: 40,
            height: 20,
          },
          borders: [
            {
              width: 2,
              color: 'rgb(1, 141, 177)',
            },
            {
              width: 2,
              color: 'transparent',
            },
            {
              width: 2,
              color: 'rgb(1, 141, 177)',
            },
          ],
        },
        [
          h('div', {
            style: {
              width: '300px',
              height: '300px',
              background: 'black',
            },
          }),
        ]
      )
    );
  });
});
