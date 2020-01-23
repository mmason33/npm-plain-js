/**
 * @class System
 * @param {object} classesObject A object containing the components class references
 */
export default class System {
    constructor(classesObject) {
        this.classesObject = classesObject;
        this.modules = document.querySelectorAll('[data-plain-module]');
        return this;
    }

    /**
     * @method init Execute the client/component ES6 classes
     * @returns void
     */
    init() {
        Array.from(this.modules).map(rootElement => {
            const args = rootElement.dataset.plainArgs
                ? JSON.parse(rootElement.dataset.plainArgs)
                : {};
            args.refs = rootElement.dataset.plainRefs
                ? JSON.parse(rootElement.dataset.plainRefs)
                : {};
            return new this.classesObject[rootElement.dataset.plainModule](
                rootElement,
                args
            );
        });
    }
}
