import { createRenderer } from '@vue/runtime-core'
import { nodeOps } from './nodeOps'
import { forcePatchProp, patchProp } from './nodeOpsProp'


const rendererOptions = nodeOps;
// lazy create the renderer - this makes core renderer logic tree-shakable
// in case the user only imports reactivity utilities from Vue.
let renderer;

function ensureRenderer() {
    return renderer || (renderer = createRenderer({
        forcePatchProp,
        patchProp,
        ...rendererOptions,
        insertStaticContent() {
            throw new Error('not implemented, you forgot to add the compiler to vue-loader options!!!')
        }
    }));
}

const isFunction = (val) => typeof val === 'function';

export const createApp = ((...args) => {
    const app = ensureRenderer().createApp(...args);
    const { mount } = app;
    app.mount = (container) => {
        const component = app._component;
        if (!isFunction(component) && !component.render && !component.template) {
            component.template = container.innerHTML;
        }
        // clear content before mounting
        container.innerHTML = '';
        const proxy = mount(container);
        container.removeAttribute('v-cloak');
        container.setAttribute('data-v-app', '');
        return proxy;
    };
    return app;
});