import { UnwrapRef, computed, ref } from 'vue';

export function useSyntheticValue<T, V extends UnwrapRef<T> = UnwrapRef<T>>(
  value?: T,
  onChange?: (value: V) => void
) {
  const useInnerValue = !value && !onChange;
  const valueRef = ref<T | undefined>(value);
  const innerValue = ref(value);
  const syntheticValue = computed(() =>
    useInnerValue ? innerValue.value : value
  );

  const handleChange =
    onChange ??
    ((value: V) => {
      innerValue.value = value;
    });

  return [syntheticValue, handleChange, useInnerValue] as const;
}
