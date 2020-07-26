const TYPE = {
    TEXT: /** @type {'text'} */('text'),
    ELEMENT: /** @type {'element'} */('element'),
    COMMENT: /** @type {'comment'} */('comment')
}
export class CustomNode {
    /**
     * 
     * @param {(typeof TYPE)[string]} type 
     */
    constructor (type) {
        this.type = type
        /**
         * @type {CustomElement|null}
         */
        this.parentNode = null
    }

    cloneNode () {
        throw new Error('not implemented')
    }

    get textContent () {
        throw new Error('not implemented')
    }

    set textContent (val) {
        throw new Error('not implemented')
    }

    get nextSibling() {
        if (!this.parentNode) {
            return null
        }

        const selfIndex = this.parentNode.children.indexOf(this)

        if (this.parentNode.children[selfIndex + 1] != null) {
            return this.parentNode.children[selfIndex + 1]
        } else {
            return null
        }
    }
    get [Symbol.toStringTag] () {
        return 'Node'
    }
}
export class CustomText extends CustomNode {
    /**
     * 
     * @param {string} text 
     */
    constructor (text) {
        super(TYPE.TEXT)
        this.nodeValue = text
    }
    cloneNode () {
        return new CustomText(this.text)
    }

    get textContent () {
        return this.nodeValue
    }

    set textContent (val) {
        throw new Error('not implemented')
    }
    get [Symbol.toStringTag] () {
        return 'Text'
    }
}
export class CustomComment extends CustomNode {
    /**
     * 
     * @param {string} text 
     */
    constructor (text) {
        super(TYPE.COMMENT)
        this.text = text
    }
    cloneNode () {
        return new CustomComment(this.text)
    }

    get textContent () {
        return ''
    }

    set textContent (val) {
        throw new Error('not implemented')
    }
    get [Symbol.toStringTag] () {
        return 'Comment'
    }
}
export class CustomElement extends CustomNode {
    /**
     * @param {string} tag 
     */
    constructor (tag) {
        super(TYPE.ELEMENT)
        this.tag = tag
        /**
         * @type {CustomNode[]}
         */
        this.children = []
        /**
         * @type {{[key: string]: string}}
         */
        this.attributes = {}
    }

    addChild (el) {
        if (el.parentNode) {
            el.parentNode.removeChild(el)
        }

        this.children.push(el)
        el.parentNode = this
    }

    removeChild (el) {
        const index = this.children.indexOf(el)
        if (index >= 0) {
            this.children.splice(index, 1)
            el.parentNode = null
        }
    }

    cloneNode () {
        const container = new CustomElement(this.tag)
        for (const node of this.children) {
            container.addChild(node.cloneNode())
        }
        return container
    }

    insertBefore (node, ref) {
        if (node.parentNode) {
            node.parentNode.removeChild(node)
        }

        if (ref != null && !this.children.indexOf(ref) < 0) {
            throw new Error('ref is not child of this element')
        }

        if (ref == null) {
            this.addChild(node)
        } else {
            // eslint-disable-next-line no-console
            const refPos = this.children.indexOf(ref)
            this.children.splice(refPos, 0, node)
            node.parentNode = this
        }
    }

    get textContent () {
        return this.children.map(c => c.textContent).join('')
    }

    set textContent (val) {
        for (const el of this.children) {
            this.removeChild(el)
        }

        if (val !== '') {
            const textNode = new CustomText(val)
            this.addChild(textNode)
        }
    }

    setAttribute (name, text) {
        this.attributes[name] = text
    }

    removeAttribute (name) {
        delete this.attributes[name]
    }

    set innerHTML (val) {
        if (val === '') {
            this.textContent = ''
        } else {
            throw new Error('not implemented')
        }
    }

    get innerHTML () {
        throw new Error('not implemented')
    }
    get [Symbol.toStringTag] () {
        return 'Element'
    }
}

const logArgumentsWrapper = obj => {
    const wrapped = {}
    for (const key of Object.keys(obj)) {
        wrapped[key] = (...args) => {
            const res = obj[key](...args)
            // eslint-disable-next-line no-console
            console.log([key, ...args, 'ANSWER', res, new Error()])
            return res
        }
    }

    return wrapped
}

export const nodeOps = logArgumentsWrapper({
    insert: (child, parent, anchor) => {
        parent.insertBefore(child, anchor || null);
    },
    remove: child => {
        const parent = child.parentNode;
        if (parent) {
            parent.removeChild(child);
        }
    },
    // eslint-disable-next-line no-unused-vars
    createElement: (tag, isSVG, is) => new CustomElement(tag),
    createText: text => new CustomText(text),
    createComment: text => new CustomComment(text),
    setText: (node, text) => {
        node.nodeValue = text;
    },
    setElementText: (el, text) => {
        el.textContent = text;
    },
    parentNode: node => node.parentNode,
    nextSibling: node => node.nextSibling,
    // eslint-disable-next-line no-unused-vars
    querySelector: selector => { throw new Error('not implement') },
    setScopeId(el, id) {
        el.setAttribute(id, '');
    },
    cloneNode(el) {
        return el.cloneNode(true);
    }
})