/**
 * @class BaseClass
 * @param {node} rootElement Root entry point for the component, the highest html element wrapper => The html element that has the "data-plain-module" attribute
 * @param {object} args Arguments/options to passed to component constructor => "data-plain-args" attribute
 */
export default class BaseClass {
    constructor(rootElement, args) {
        // Automate setting of properties through component "super" call
        this.setRootElement(rootElement)
        this.setProps(args)
    }

    /**
     * @method emit Dispatch custom events from the rootElement
     * @param {node} element HTML node to fire the event on
     * @param {string} eventName Name of the custom event
     * @param {object} args Data object to passed through the custom event => accessed on the listener at "event.detail"
     * @returns void
     */
    emit(element, eventName, args) {
        element.dispatchEvent(
            new CustomEvent(eventName, {
                detail: args,
            })
        )
    }

    /**
     * @method setProps Set the properties of the args object
     * @param {object} args Args/options for the "data-plain-args" attribute
     * @returns void
     */
    setProps(args) {
        if (!args) return false
        Object.keys(args).forEach(key => {
            this[key] = args[key] || null
        })

        this.setRefs()
    }

    /**
     * @function setRefs Set references to other components - generated from an html attribute "data-plain-refs" accepts valid JSON
     * @returns void
     */
    setRefs() {
        if (!this.refs) return false
        Object.keys(this.refs).forEach(key => {
            this.refs[key] = document.querySelector(this.refs[key])
        })
    }

    /**
     * @function hasRefs Check if module has external references
     * @returns {bool}
     */
    hasRefs() {
        return !!this.refs
    }

    /**
     * @method setRootElement The the rootElement property
     * @param {node} rootElement Root entry point element from "data-plain-module" attribute
     * @returns void
     */
    setRootElement(rootElement) {
        if (!rootElement) {
            throw new Error('Each constructor needs a root entry DOM node')
        }

        this.rootElement = rootElement
    }
}
