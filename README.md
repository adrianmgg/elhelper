
# elhelper

## about

a small set of simple helpers for creating/modifying DOM elements.

This library was born out of my time writing [userscripts](https://en.wikipedia.org/wiki/Userscript).
I found that using purely the vanilla APIs to create & manipulate DOM elements tended to result in code that was repetitive and tedious to write & difficult to read and maintain,
especially when dealing with many elements nested multiple levels deep.

Those problems end up being solved in one way or another by the various web frameworks available,
but I didn't want to pull in something that complex just to write some <100 line script to inject a couple elements into a site's HTML,
nor did I really need much of the other conveniences and complexities they introduce.

So, I ended up writing `elhelper`. I had a few main goals/ideals for it:
- minimally complex
  - don't reinvent the wheel - there's already vanilla JS ways of doing all these things, so just write a minimal wrapper over those.
- maximally capable
  - simplicity is nice to a point, but it needs to be able to do everything you need from it.
  - it should be able to work with any element-specific APIs, ideally in a way that doesn't require any special-cased code from the library (both for simplicity and so frequent updates aren't required to include new APIs.)
  - it should also work for non-HTML DOM stuff like manipulating SVGs
- scalable
  - code should stay easy to write/read/maintain, even when working with deeply nested elements with a lot of properties

the entire thing is under 25 lines of code (not counting comments & typescript-only stuff)



## compared to purely vanilla js

```javascript
create('div', {
    style: {
        color: 'red',
        backgroundColor: 'black',
        vars: {
            '--foo': '#FF00FF',
            '--bar': '#00FF00',
        },
    },
    dataset: { someThing: 'hello world' },
    classList: ['a', 'b', 'c'],
    children: [
        create('label', {
            textContent: 'some number: ',
            children: [create('input', {
                type: 'range',
                min: 0, max: 10, step: 1,
            })],
        }),
        create('button', {
            textContent: 'click me!',
            events: { click: e => console.log('clicked!') },
        }),
    ],
});
```
is equivalent to this code:
```javascript
const slider = document.createElement("input");
slider.type = "range";
slider.min = 0;
slider.max = 10;
slider.step = 1;
const label = document.createElement("label");
label.textContent = "some number: ";
label.appendChild(slider);
const btn = document.createElement("button");
btn.addEventListener("click", e => console.log('clicked!'));
btn.textContent = "click me!";
const parent = document.createElement("div");
parent.style.color = red;
parent.style.backgroundColor = black;
parent.style.setProperty("--foo", "#FF00FF");
parent.style.setProperty("--bar", "#00FF00");
parent.dataset.someThing = "hello world";
parent.classList.add("a");
parent.classList.add("b");
parent.classList.add("c");
parent.appendChild(label);
parent.appendChild(btn);
```

## examples

### creating an element

```javascript
create('div', {
    style: {
        color: 'red',
        backgroundColor: 'black',
        vars: {
            '--foo': '#FF00FF',
        },
    },
    dataset: {
        someThing: 'hello world',
    },
    classList: ['a', 'b', 'c'],
});
```

> creates this:
> ```html
> <div style="color: red; background-color: black; --foo:#FF00FF;" data-some-thing="hello world"></div>
> ```

### nested elements

```javascript
create('div', {
    textContent: 'parent',
    children: [
        create('div', {
            textContent: 'child',
        })
    ],
});
```

> creates this:
> ```html
> <div>
>     parent
>     <div>child</div>
> </div>
> ```

### manipulating existing elements

`create` is actually just a convenience function that creates an element and passes it to `setup`.
```javascript
function create(tagName, options = {}) {
    return setup(document.createElement(tagName), options);
}
```
so, anything you can do with `create`, you can also apply to an existing element by calling `setup` directly, e.g.
```javascript
setup(document.getElementById('foo'), {
    textContent: 'hello world',
    style: { color: 'red' },
});
```

<!-- TODO examples for:
 - event listeners
 - SVG/other NS elems
 - `parent`-style usage, including with `insertBefore`
-->
