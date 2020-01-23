# Plain-JS JavaScript
**The Object-Oriented way to write functional code with proper scroping and execution.**

## Execution
The plain-js system is executed via data attributes. It's designed to work within a component like system where each component is instance-based and controls itself.

#### Example Execution
We have a component called **Hero** that has some animation and event listeners.

```html
<section class="hero" data-plain-js-module="Hero">
    // Some child elements
</section>
```
The point of focus in the example above is **data-plain-js-module="Hero"**(.) This data attribute references a ES6 class with this functionality.
```javascript
export default class Hero extends BaseClass {
    constructor(rootElement, args) {
        super(rootElement, args);
        this.imageChild = this.rootElement.querySelector('img');
        this.init();
    }

    init() {
        this.handleScroll();
    }

    handleScroll() {
        window.addEventListener('scroll', () => {
            this.animation()
        })
    }

    animation() {
        // Some animation
    }
}
```

#### Example Arguments
The point of ES6 classes is to add flexibility, reusability and handle multiple instances. This architecture allows for arguments/parameters to be passed to the ES6 classes referenced above.
```html
<section class="hero" data-plain-js-module="Hero" data-plain-js-args='{"animationDelay": 200, "animationFiresOnce": true}'>
    // Some child elements
</section>
```
The point of focus in the example above is **data-plain-js-args='{"animationDelay": 200, "animationFiresOnce": true}'**(.) **NOTE: This is JSON data that will be passed the corresponding class and has to be JSON data.**
```javascript
// Usage

export default class Hero extends BaseClass {
    constructor(rootElement, args) {
        super(rootElement, args);
        this.imageChild = this.rootElement.querySelector('img');
        this.init();

        // Args
        console.log(this.animationDelay) // 200
        console.log(this.animationFiresOnce) // true

    }

    init() {
        this.handleScroll();
    }

    handleScroll() {
        window.addEventListener('scroll', () => {
            this.animation()
        })
    }

    animation() {
        // Some animation
    }
}
```

#### Example Refs (Component to Component communcation)
One of the main purposes of **Refs** is to communicate between components and manage events.

```html
    <video class="video" data-plain-js-module="Video" data-plain-js-refs='{"VideoButton":".video-button"}' data-plain-js-args='{"src":"http://clips.vorwaerts-gmbh.de/VfE_html5.mp4"}'>
        // sources
    </video>

    <button class="video-button" data-plain-js-module="Button" data-plain-js-args='{"name":"Button", "title": "Play Video"}'>
        // Text
    </button>

```

In this example the video player is concerned with clicks that occur on the button with the class `.video-button`.

```javascript
export default class Video extends BaseClass {
    constructor(rootElement, args) {
        super(rootElement, args);
        this.setSrc();
        this.refClick();
    }

    setSrc() {
        this.rootElement.src = this.src;
    }

    refClick() {
        // click event listener on the external ref
        this.refs.VideoButton.addEventListener('click', () => {
            this.rootElement.play();
        });
    }
}
```

## Intialization and the System Function
The initialization takes places in a root import file(the entry point for the bundler webpack, gulp etc). In this file, the `System` function will recieve one parameter(typeof object) that consists of references to each imports. There are comments in the function if you wish know more.

```javascript
import SomeClass from 'some-directory';
import SomeClass1 from 'some-directory1';
import SomeClass2 from 'some-directory2';
// etc

new System({
    SomeClass,
    SomeClass1,
    SomeClass2,
}).init();

```



## BaseClass
The main purpose of the `BaseClass` is automate mudane tasks and to provide consistency. Each class should extend the `BaseClass`.
```javascript
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

```
