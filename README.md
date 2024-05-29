# EchoX

> WIP

The fast, reactive UI framework with a size of 3 KB.

- Fast - no virtual DOM
- Small - 3KB (gzip)
- Simple - similar to HTML

```bash
$ npm install echox
```

```js
import * as X from "echox";

const node = X.html`<define count=${X.state(0)}>
  <button @click=${(d) => d.count++}>👍</button>
  <button @click=${(d) => d.count--}>👎</button>
  <span>${(d) => d.count}</span>
</define>`;

document.body.append(node);
```
