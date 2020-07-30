
const logArgumentsWrapper = obj => {
    const wrapped = {}
    for (const key of Object.keys(obj)) {
        wrapped[key] = (...args) => {
            const res = obj[key](...args)
            // eslint-disable-next-line no-console
            // console.log([key, ...args, 'ANSWER', res, new Error()])
            return res
        }
    }

    return wrapped
}

export const patchProp = (el, key, prevV, nextV) => {
    el.setAttribute(key, nextV)
}
export const forcePatchProp = () => {}

export const nodeOpsProp = logArgumentsWrapper({ patchProp, forcePatchProp })