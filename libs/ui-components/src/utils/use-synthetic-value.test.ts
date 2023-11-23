import { describe, expect, it } from 'vitest';
import { useSyntheticValue } from './use-synthetic-value';

describe('useSyntheticValue', () => {
  it('uses original value and onChange', () => {
    const data = {
      value: {},
    };
    const onChange = (value: {}) => {
      data.value = value;
    };
    const [value, setValue, useInnerValue] = useSyntheticValue(
      data.value,
      onChange
    );
    expect(value.value).toBe(data.value);
    expect(value.value).toBeTypeOf('object');
    expect(value.value).not.toHaveProperty('__v_isRef');
    expect(setValue).toBe(onChange);
    expect(useInnerValue).toBeFalsy();
    setValue({ a: 'foo' });
    expect(data.value).toMatchObject({ a: 'foo' });
  });

  it('uses original onChange', () => {
    const data = {
      value: undefined as unknown as {},
    };
    const onChange = (value: {}) => {
      data.value = value;
    };
    const [, setValue, useInnerValue] = useSyntheticValue(data.value, onChange);
    expect(setValue).toBe(onChange);
    expect(useInnerValue).toBeFalsy();
    setValue({ a: 'foo' });
    expect(data.value).toMatchObject({ a: 'foo' });
  });

  it('uses original value', () => {
    const data = {
      value: {},
    };

    const [value, setValue, useInnerValue] = useSyntheticValue(data.value);
    expect(value.value).toBe(data.value);
    expect(useInnerValue).toBeFalsy();
    setValue({ a: 'foo' });
    expect(data.value).toMatchObject({});
  });

  it('uses innerValue', () => {
    const [value, setValue, useInnerValue] = useSyntheticValue<string>();
    expect(value.value).toBeUndefined();
    expect(useInnerValue).toBeTruthy();
    setValue('test');
    expect(value.value).toMatch('test');
    expect(value.value).toBeTypeOf('string');
    expect(value.value).not.toHaveProperty('__v_isRef');
  });
});
