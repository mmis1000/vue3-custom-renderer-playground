import { createRenderer } from '@vue/runtime-core'
// eslint-disable-next-line no-unused-vars
import { nodeOps, CustomNode, CustomElement, CustomComment, CustomText } from './nodeOps'
import { nodeOpsProp } from './nodeOpsProp'

/**
 * @typedef { CustomElement | CustomComment | CustomText } ConcreteCustomNode
 */

const rendererOptions = nodeOps;
// lazy create the renderer - this makes core renderer logic tree-shakable
// in case the user only imports reactivity utilities from Vue.
let renderer;

function ensureRenderer() {
    return renderer || (renderer = createRenderer({
        ...nodeOpsProp,
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

export class Renderer {
    /**
     * @param {HTMLCanvasElement} canvas 
     */
    constructor (canvas) {
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')
    }

    computeRatio (width, rawRatio) {
        let sum = 0
        let computed = []

        for (let item of rawRatio) {
            if (item != null) {
                if (typeof item === 'number') {
                    sum += item
                    computed.push(item)
                } else if (typeof item === 'string' && /^(\d+(?:\.\d+)?)%$/.test(item)) {
                    const value = parseFloat(/^(\d+(?:\.\d+)?)%$/.exec(item)[1])
                    const w = width * (value / 100)
                    sum += w
                    computed.push(w)
                } else {
                    throw new Error('bad value')
                }
            } else {
                computed.push(null)
            }
        }

        const rest = sum < width ? width - sum : 0

        const nullCount = computed.filter(i => i == null).length

        for (let i = 0; i < computed.length; i++) {
            if (computed[i] == null) {
                computed[i] = rest / nullCount
            }
        }

        return computed
    }

    /**
     * @param { ConcreteCustomNode } el 
     * @param { number } width 
     * @param { number } height 
     */
    drawElement (el, x, y, width, height) {
        switch (el.type) {
            case 'element': {
                switch (el.tag) {
                    case 'box': {
                        const background = el.attributes.background || 'transparent'
                        this.ctx.fillStyle = background
                        this.ctx.fillRect(x, y, width, height)

                        for (let c of el.children) {
                            this.drawElement(c, x, y, width, height)
                        }

                        break;
                    }
                    case 'hbox': {
                        const background = el.attributes.background || 'transparent'
                        this.ctx.fillStyle = background
                        this.ctx.fillRect(x, y, width, height)
                        const rawRatio = el.attributes.ratio

                        const computedWidth = this.computeRatio(width, rawRatio)

                        let offset = 0

                        const elementChildren = el.children.filter(i => i.type === 'element')

                        for (let i = 0; i < computedWidth.length; i++) {
                            if (elementChildren[i] != null) {
                                this.drawElement(elementChildren[i], x + offset, y, computedWidth[i], height)
                                offset += computedWidth[i]
                            }
                        }

                        break;
                    }

                    case 'vbox': {
                        const background = el.attributes.background || 'transparent'
                        this.ctx.fillStyle = background
                        this.ctx.fillRect(x, y, width, height)
                        const rawRatio = el.attributes.ratio

                        const computedHeight = this.computeRatio(height, rawRatio)

                        let offset = 0

                        const elementChildren = el.children.filter(i => i.type === 'element')

                        for (let i = 0; i < computedHeight.length; i++) {
                            if (elementChildren[i] != null) {
                                this.drawElement(elementChildren[i], x, y + offset, width, computedHeight[i])
                                offset += computedHeight[i]
                            }
                        }

                        break;
                    }
                }
                break
            }
            case 'text': {
                const color = el.parentNode.attributes.color || 'black'
                const font = el.parentNode.attributes.font || '45px arial'
                const align = el.parentNode.attributes.textAlign || 'center'
                const baseLine = el.parentNode.attributes.textBaseLine || 'middle'
                this.ctx.fillStyle = color
                this.ctx.font = font
                this.ctx.textAlign = align
                this.ctx.textBaseline = baseLine

                const xOffset = align === 'left' ? 0 :
                    align === 'center' ? width / 2 :
                    align === 'right' ? width : 0;

                const yOffset = baseLine === 'top' ? 0 :
                    baseLine === 'middle' ? height / 2 :
                    baseLine === 'bottom' ? height : 0;

                this.ctx.fillText(el.nodeValue, x + xOffset, y + yOffset)
                break
            }
        }
    }
}