/* eslint-disable no-console */
// import { createApp } from 'vue';
import { createApp } from './runtime-canvas/renderer';
import { CustomElement } from './runtime-canvas/nodeOps'
import App from './App.vue'

const root = new CustomElement('div')
const app = window.app = createApp(App).mount(root)

console.log(root, app)
