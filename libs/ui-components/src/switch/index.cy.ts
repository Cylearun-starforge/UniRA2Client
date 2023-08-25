import { UnwrapRef, ref } from 'vue';
import CySwitch from './index';
function useState<T>(value: T) {
  const refValue = ref(value);
  const actions = {
    update: (value: UnwrapRef<T>) => {
      refValue.value = value;
    },
  };
  cy.spy(actions, 'update').as('update');
  return [refValue, actions.update] as const;
}

describe('CySwitch', () => {
  it('renders', () => {
    const [checked, setChecked] = useState(false);
    cy.mount(CySwitch, {
      props: {
        checked: checked.value,
        text: 'checked',
        onChange: setChecked,
      },
    });
    cy.get('[role="button"]').click();
    cy.get('@update').should('be.calledWith', true);
  });
});
