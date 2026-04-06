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
const [scope] = reactive()
  .state("value", 0)
  .computed("double", (d) => d.value * 2)
  .effect((d) => console.log(d.value, d.double))
  .join();

const dom = html.div([
  html.button({onclick: () => scope.value++}, ["👍"]),
  html.button({onclick: () => scope.value--}, ["👎"]),
  html.span([() => scope.double]),
]);
```

_EchoX.reactive_ returns a reactive scope that holds the states you defined. You bind them in DOM by using functions for attributes, styles, or children so reads track dependencies. This is the _reactive_ in the philosophy.

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

`html` is a proxy: each property is a tag factory (for example `html.div`, `html.span`). Calling `html(tagNamespace)` returns another proxy that creates elements in that namespace—useful for SVG:

```js
const svg = html("http://www.w3.org/2000/svg");
svg.circle({cx: 50, cy: 50, r: 40});
```

For a given tag, the signature is **`tagName(attributes?, children?)`**. If the first argument is a plain object, it is treated as **attributes** and the second argument is **children**; otherwise the first argument is **children** and attributes default to `{}`.

- **Children** are flattened (nested arrays are supported). Values that are not mountable are skipped (`null`, `undefined`, `false`); **`0` is kept** and rendered as text. Primitives become text nodes; existing DOM nodes are inserted as-is. A **function** child is reactive: it is re-run when tracked state changes, and its return value (nodes, text, arrays, or `null`) replaces that fragment.

- **Attributes** map to DOM properties or attributes. Values may be static or **functions** that read reactive state; those update when dependencies change. A **`style`** object sets inline styles; each style field may also be a function. Keys starting with **`on`** are registered as event listeners (`onclick`, …).

```js
html.p(["Hello", html.em(["EchoX"])]);
```

## **reactive()** {#reactive}

Returns a **builder** (`Reactive`) used to declare state and effects. Chain **`.state`**, **`.computed`**, and **`.effect`**, then call **`.join()`** to materialize a live **scope** object. Definition order between `state` and `computed` does not matter.

```js
const rx = reactive();
rx.state("n", 0).computed("double", (s) => s.n * 2);
```

## _reactive_.**state(_key, value_)** {#reactive-state}

Registers a **state** named `key` with initial `value`. After `join()`, the scope exposes `key` as a readable and assignable property; assignments schedule updates to any `computed`, `html` bindings, and `effect`s that depend on that state.

```js
reactive().state("count", 0).state("label", "go");
```

## _reactive_.**computed(_key, define_)** {#reactive-computed}

Registers a **derived** state under `key`. `define` is a function `(scope) => value` that reads other fields on `scope`. Computed values are recomputed when their dependencies change (lazily on read, with updates batched so a dependency change does not run the same computed more than once per flush).

```js
reactive()
  .state("x", 2)
  .computed("area", (s) => s.x * s.x);
```

## _reactive_.**effect(_effect_)** {#reactive-effect}

Registers a side effect. Effects run **after `join()`**, and again when any state read inside the effect changes. If `effect(scope)` **returns a function**, that function is treated as a **cleanup** and is called when the dispose function from `join()` runs (see below). Non-function return values are ignored.

```js
reactive()
  .state("n", 0)
  .effect((s) => {
    console.log("n =", s.n);
    return () => console.log("cleanup");
  });
```

## _reactive_.**join()** {#reactive-join}

Builds the reactive **scope** from the declared `state` and `computed` entries, runs all **effects** once, and returns a tuple **`[scope, dispose]`**.

- **`scope`**: proxy whose properties correspond to state and computed keys.

- **`dispose`**: call with no arguments to run every cleanup function returned from an **effect** (useful for tearing down subscriptions or manual DOM work).

```js
const [scope, dispose] = reactive().state("n", 0).effect((s) => s.n).join();

scope.n = 1;
dispose();
```
