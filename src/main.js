/* eslint-disable no-console */
// import { createApp } from 'vue';
import { createApp, Renderer } from './runtime-canvas/renderer';
import { CustomElement } from './runtime-canvas/nodeOps'
import App from './App.vue'

const root = new CustomElement('box')
const app = window.app = createApp(App).mount(root)

console.log(root, app, root.outerHTML)

const canvas = document.getElementById('app')
const render = new Renderer(canvas)

requestAnimationFrame(function tick () {
    canvas.width = ~~canvas.offsetWidth
    canvas.height = ~~canvas.offsetHeight
    render.drawElement(root, 0, 0, canvas.width, canvas.height)
    requestAnimationFrame(tick)
})