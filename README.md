# Promises in JavaScript

We've been _using_ JavaScript promises throughout the cohort -- and you've probably gotten pretty good at knowing where to put `async` and `await` inside a React project. You might even be able to use `Promise.all` to resolve a complex set of seeding instructions using Mongoose.

But what's actually going on under there? What's a `Promise`?

>Name a few instances where you've used `Promise` in your code. Now name a few times you've _seen_ `Promise` when you tried to `console.log` something, and cursed the fates for treating you so unkindly.


## Promises
A [_Promise_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) is an object that represents the eventual completion (or failure) of an asynchronous operation, often a request to an external API or database. "Promise" is a semantically appropriate name for this concept -- the data you want isn't necessarily available yet, and you can't really count on it being there at any particular point. It's frustrating!

Even a _resolved_ promise is pretty weird. Take a look at this in the Node REPL:
```js
const result = Promise.resolve(12)
```
The `.resolve` method returns a resolved promise. So we should be all set here, right? `result` should equal `12`. But it doesn't!

```js
console.log(result)
// In Node, shows "Promise {12}"
```

`result` isn't `12`, unfortunately; instead, it's a promise with a resolved value of `12`. 

How can we get hold of that value? Any promise can be chained with `.then`, which takes two arguments: a callback function to execute upon resolution and (optional) a callback to execute upon failure. A simple `.then` might look like this:

```js
result.then(value => console.log(value))
// logs 12
```

The first parameter of the callback (`value`, above) receives the resolved value of the promise. Inside the callback function, you can access to the _actual_ value of the resolved promise by using that parameter name.

In Node, executing the line above will also show a `Promise { <pending> }`. That's because the `.then` method itself returns _another_ promise. You can chain another `.then` after it, or catch errors from a `.then` chain by adding a `.catch` -- which actually _also_ returns a promise from which you can chain more `.then`s and `.catch`es if you like. Great!

## `async` and `await`

An alternate syntax for handling asynchronous programming is to use the `async` and `await` keywords. Adding `async` to a function declaration or expression does two key things:
1. It converts the result of that function into a promise, which will be resolved by the `return` of the function.
2. It enables the `await` keyword within the function.

In practical terms, adding `await` before a promise pauses execution of the `async` function until that promise resolves, after which the resolved value of the promise is returned from the expression and the subsequent lines are executed.

This syntactical structure makes it possible to treat promises more like standard expressions, like so:
```js
const getData = async () => {
    const response = await fetch('http://awesomeurl.com').then(res => res.json())
    console.log(response)
}
```

Within the `async` function, we can treat `response` like a normal variable with a non-promise value. That's handy. But this doesn't mean we can simply _return_ `response` from within `getData` -- the return from `getData` (as with any `async` function) will itself be a promise, with all the complexity we've seen above.


## Asynchronous Programming and Parallel APIs

JavaScript is _supposed_ to be "single-threaded." JS executes lines in order -- when it hits an expression that results in a promise, it creates that promise object and then immediately carries along on its merry way. The following lines go ahead and execute.

Meanwhile, each promise object will keep working to resolve its value (more on this below). Only when the value is resolved is a handler provided by `.then` triggered.

But it _won't_ necessarily be triggered right away, or in the order we might expect. Asynchronous programming in JavaScript gets routed through some pathways that _aren't_ actually entirely JavaScript -- these processes may run in parallel in separate environments or APIs that are part of the web browser or Node environment.

One example of this is the `fetch API`, which can handle `http` requests. It gets complicated, but in short, the actual request created by a `fetch` is handled by a browser process linked to a promise; when this browser process receives a response, it sets the promise to "resolved" and sets the value, which triggers `.then`.

## The Event Loop

All of these operations are sequenced by what is called [the _event loop_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop), which is constantly checking the status of various stacks and queues in the browser environment.

The event loop handles whatever is next according to roughly this priority:
1. Call Stack
2. Microtask Queue
3. Browser Events
4. Callback Queue

When we load a script into a browser environment, the instructions in script are added to the call stack. Some of those instructions may create promises, but the instructions run in the order we'd expect in synchronous JS programming.

As long as the call stack is not empty, none of the other queues are handled. As soon as the call stack _is_ empty, the event loop handles other priorities. Callbacks from promises are placed in the _microtask queue_ -- they're handled in FIFO order whenever the call stack empties.

## Using Promise Values

The upshot of the above is that it's not generally possible to use the result of an asynchronous operation in the course of a normal JS script or file the way you would use, say, an arithmetic calculation or the result of parsing a string. Any other synchronous code will have already blasted through the call stack before the promise is resolved, so it's unwise to set up any synchronous processes to depend upon a value from a promise.

Promise values are fully available within the context of `.then` callbacks or in `async` functions after being appropriately `await`ed -- and there's quite a bit that can be done with these values in those contexts. One example, for those familiar with React programming, is to set a value in state _within_ an `async` function without depending on the _return_ from that function (which would, of course, be a promise) -- in React, placing that value into state triggers React's own built-in rendering pathways. It's also completely possible to manipulate the browser DOM with vanilla JS within a `.then` callback or `async` function.


## Further Reading / Viewing

* [MDN: Using Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
* [JavaScript The Hard Parts: Promises (Codesmith)](https://www.youtube.com/watch?v=KpGmW_P5Ygg)
* [Dev.to: How to access the returned value of a Promise](https://dev.to/ramonak/javascript-how-to-access-the-return-value-of-a-promise-object-1bck)
* [Fetch Spec: WHATWG.org](https://fetch.spec.whatwg.org/)
* [javascript.info: Event Loop, Microtasks and Macrotasks](https://javascript.info/event-loop)
>Lightly adapted by the same author from [this repo](https://github.com/jeremyrrose/promises-explained).
