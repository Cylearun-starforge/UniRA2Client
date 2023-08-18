import {  ExtractPropTypes, ExtractPublicPropTypes, Prop, PropType, defineComponent, onMounted, ref } from "vue";

import style from './style.module.css';

const props = {
    value: {
        type: String,
        default: ''
    },
    onChange: {
        type: Function as PropType<(value: string) => void>,
        default: () => {}
    },
    width: {
        type: Number,
        default: 120,
    },
    type: {
        type: String,
        default: 'text'
    }
} satisfies Record<string, Prop<unknown>>


export type CyInputProps = ExtractPropTypes<typeof props>;

const CyInput = defineComponent({
    name: 'Input',
    props,
    setup({onChange, value, width, type}) {
        const inputRef = ref<HTMLInputElement>()
        const handleInput = () => {
            if (inputRef.value && onChange) {
                onChange(inputRef.value.value)
            }
        }
        return {
            inputRef,
            value,
            handleInput,
            width: `${width}px`,
            type
        }
    },
    render() {
        const {value, handleInput, width, type} = this
        return <input ref="inputRef" class={style['cy-input']} type={type} style={{width}} value={value} onInput={handleInput} />
       
    }
});

export default CyInput