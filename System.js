/**
 * @class System
 * @param {object} classesObject A object containing the components class references
 */
export default class System {
    constructor(classesObject) {
        this.classesObject = classesObject;
        this.modules = document.querySelectorAll('[data-plain-js-module]');
        return this;
    }

    /**
     * @method init Execute the client/component ES6 classes
     * @returns void
     */
    init() {
        Array.from(this.modules).map(rootElement => {
            const args = rootElement.dataset.plainJsArgs
                ? JSON.parse(rootElement.dataset.plainJsArgs)
                : {};
            args.refs = rootElement.dataset.plainJsRefs
                ? JSON.parse(rootElement.dataset.plainJsRefs)
                : {};
            return new this.classesObject[rootElement.dataset.plainJsModule](
                rootElement,
                args
            );
        });
    }
}
