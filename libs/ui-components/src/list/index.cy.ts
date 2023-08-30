import { h } from 'vue';
import CyList from './index';

describe('CyList', () => {
  it('renders', () => {
    cy.mount(CyList, {
      props: {
        height: 170,
      },
      slots: {
        default: () => [
          h('div', {}, 1),
          h('div', {}, 2),
          h('div', {}, 3),
          h('div', {}, 4),
          h('div', {}, 5),
          h('div', {}, 6),
          h('div', {}, 7),
          h('div', {}, 8),
          h('div', {}, 9),
        ],
      },
    });
  });
});
