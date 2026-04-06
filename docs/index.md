---
layout: doc
---

# EchoX

**EchoX** is a lightweight reactive UI framework for declarative DOM manipulation, offering a simple and efficient alternative to [React](https://react.dev/), [Vue](https://vuejs.org/), and [jQuery](https://jquery.com/), especially for small projects.

It works out of the box without the need for compilation or transpilation while still providing the following benefits:

- Fine-grained interactivity
- Readable template
- Fully TypeScript support

The philosophy for EchoX is **UI = f(DOM, Reactive)**, and [APIs](#api-index) are designed based on this.

```js
import {html, reactive} from "echox";

const [state] = reactive()
  .state("value", 0)
  .computed("double", (d) => d.value * 2)
  .effect((d) => console.log(d.value, d.double))
  .join();

const counter = html.div([
  html.button({onclick: () => state.value++}, ["👍"]),
  html.button({onclick: () => state.value--}, ["👎"]),
  html.span([() => state.double]),
]);

document.body.appendChild(counter);
```

## Functional UI Construction

EchoX provides a declarative way to building user interfaces with pure function calls, without compilation like JSX (used in React), and with full TypeScript support over string-based templates, portable and readable (used in Vue and Alpine).

A _html_ proxy object exported to build nested UI.For example, let's create a counter:

```js
html.div([
  html.button({style: "background: blue"}, ["👍"]),
  html.button({style: "background: red"}, ["👎"]),
  html.span([0]),
]);
```

Please refer to [EchoX DOM](#html) for more information.

## Native DOM Manipulation

Operates directly on the native DOM instead of relying on a virtual DOM, achieving higher performance and lower memory overhead while maintaining simplicity.

The _html_ proxy object **create native DOM directly**. This is the _DOM_ in the philosophy. For example, to create a hello world message:

```js
// The dom variable is a native DOM, not a virtual dom!!!
const dom = html.span({style: "font-size: 10"}, ["hello World"]);

// So you can directly append dom to the DOM tree!
container.appendChild(dom);
```

## Granular State Observation

Apply fine-grained state observation, allowing independently update, minimizing unnecessary DOM updates and improves performance compared to virtual DOM-based frameworks. (Similar to [SolidJS](https://www.solidjs.com/))

EchoX exports one method _reactive_ for reactivity. For example, let's make the counter interactive:

```js
const [scope] = ex
  .reactive()
  .state("value", 0)
  .computed("double", (d) => d.value * 2)
  .effect((d) => console.log(d.value, d.double))
  .join();

const dom = html.div([
  html.button({onclick: () => scope.value++}, ["👍"]),
  html.button({onclick: () => scope.value--}, ["👎"]),
  html.span([() => state.double]),
]);
```

_EchoX.reactive_ returns a reactive scope, where stores the states you defined. Then you can bind states with the attributes or child nodes of DOMs using _use_. This is the _reactive_ in the philosophy.

Please refer to [EchoX Reactive](#reactive) for more information.

## Getting Started

There are several way to using EchoX.

### Installing from Package Manager

EchoX is typically installed via a package manager such as Yarn or NPM.

::: code-group

```sh [npm]
$ npm add -S echox
```

```sh [pnpm]
$ pnpm add -S echox
```

```sh [yarn]
$ yarn add -S echox
```

```sh [bun]
$ bun add -S echox
```

:::

EchoX can then imported as a namespace:

```js
import {html} from "echox";

const dom = html.div(["hello world"]);

document.body.append(dom);
```

### Imported as an ES module

In vanilla html, EchoX can be imported as an ES module, say from jsDelivr:

```html
<script type="module">
  import {html} from "https://cdn.jsdelivr.net/npm/echox/+esm";

  const dom = html.div(["hello world"]);

  document.body.append(dom);
</script>
```

### UMD Bundle

EchoX is also available as a UMD bundle for legacy browsers.

```html
<script src="https://cdn.jsdelivr.net/npm/echox"></script>
<script>
  const dom = ex.html.div(["hello world"]);

  document.body.append(dom);
</script>
```

## API Index

- [_ex_.**html**](#html) - create a html DOM with the specified attributes and child nodes.
- [_ex_.**reactive**](#reactive) - create a reactive scope, where store the declared states.
- [_reactive_.**state**](#reactive-state) - declare a state.
- [_reactive_.**computed**](#reactive-computed) - derive a computed state.
- [_reactive_.**effect**](#reactive-effect) - observe a effect.
- [_reactive_.**join**](#reactive-join) - get the states from the reactive scope.

## **html.[tagName](_[attributes,] children_)** {#html}

## **reactive()** {#reactive}

## _reactive_.**state(_key, value_)** {#reactive-state}

## _reactive_.**computed(_key, define_)** {#reactive-computed}

## _reactive_.**effect(_effect_)** {#reactive-effect}

## _reactive_.**join()** {#reactive-join}
