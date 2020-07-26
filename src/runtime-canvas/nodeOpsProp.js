export const patchProp = (el, key, prevV, nextV) => {
    el.setAttribute(key, nextV)
}
export const forcePatchProp = () => {}