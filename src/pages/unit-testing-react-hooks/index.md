---
title: Unit Testing Custom React Hooks
date: "2019-05-23"
description: How to write unit tests for custom react hooks without interacting with the dom at all!
thumbnail: ''
---

If you want to skip it all the intro and explanation, feel free go to the bottom or just visit the repo. However, if you want to leave with a better understanding, enjoy reading the full story.

![](https://cdn-images-1.medium.com/max/2400/1*aLg1-G2UAlaKpBopRnmCRg.png)

So everybody has *hooked* up (see what I did there) with hooks and other **new** React features by now. If you haven't gotten the chance to play around with them, you can start by giving a read to the [documentation](https://reactjs.org/docs/hooks-intro.html). As always, it has been really helpful.

Developing components with hooks has been a lot of fun for us. We've strongly come to believe they help to create components that **are much easier to read and are more meaningful**. Nonetheless, as we were going down the road, we got to the point where we had to start writing some tests (yeah, as this was our first real experience with hooks, we were really eager to ignore TDD for this time).

Although there were really helpful posts of testing custom hooks, most of them involved interacting with a component, rather than testing hooks itself. While in many cases, this would be fine to test your custom hook, there are certain times when that's not a happy path to get through (for instance, if you need a lot of UI interactions in your component).

## Let's Go to the Code!

Before we get started, you should be aware of a few things:

- We will be using the [react-hooks-testing-library](https://github.com/mpeyper/react-hooks-testing-library) package. To use this package, you will need to install [react-test-renderer](https://www.npmjs.com/package/react-test-renderer) as well. Don't forget to add them as **dev** dependencies.

- As they've stated in the readme, you should ***be only*** doing this if your hook is not directly tied to a component or it's difficult to test it through UI interactions.

We will be using this lovely **useKeyPress** hook for demonstration. Although pretty much self-explanatory, this hook returns an object with:

* **pressedKeys**: an array of pressed keys.

* **setPressedKey**: a function to add a key to **pressedKeys**.

* **removeDuplicateKeys**: a function to remove duplicates in **pressedKeys**.

* **clearPressedKeys**: a function that clears our pressed keys.

```javascript
import { useState, useCallback } from "react";

const useKeyPress = () => {
  const [pressedKeys, setPressedKeys] = useState([]);

  const clearPressedKeys = useCallback(() => setPressedKeys([]), []);

  const removeDuplicateKeys = useCallback(
    () => setPressedKeys(Array.from(new Set(pressedKeys))),
    [pressedKeys]
  );

  const setPressedKey = useCallback(
    key => setPressedKeys([...pressedKeys, key]),
    [pressedKeys]
  );

  return {
    pressedKeys,
    setPressedKey,
    removeDuplicateKeys,
    clearPressedKeys 
  };
};

export default useKeyPress;
```

We have a simple, silly looking component for messing around with this stuff (*might call it Silly.jsx*):

![Might call it Silly.jsx](https://cdn-images-1.medium.com/max/2000/1*lDK7MISeAszi5KVviguEAQ.png)

And below, you will find its code. We are using **useEffect** to add a window event handler for every time someone presses a key. Imports and styling were removed in this snippet in favor of code length.

```jsx
import useKeyPress from "./useKeyPress";

const App = () => {
  const {
    pressedKeys,
    setPressedKey,
    removeDuplicateKeys,
    clearPressedKeys
  } = useKeyPress();

  const onKeyUpHandler = useCallback(
    ({ key }) => {
      setPressedKey(key);
    },
    [setPressedKey]
  );

  useEffect(() => {
    window.addEventListener("keyup", onKeyUpHandler);

    return () => {
      window.removeEventListener("keyup", onKeyUpHandler);
    };
  }, [onKeyUpHandler]);

  return (
    <Jumbotron>
      <Button onClick={clearPressedKeys} type="button">
        Clear
      </Button>
      <Button onClick={removeDuplicateKeys} type="button">
        Remove Duplicates
      </Button>
      <Col>
        Keys already pressed:{" "}
        {
          pressedKeys.length === 0 ? 
          "None" : 
          pressedKeys.join(",")
        }
      </Col>
    </Jumbotron>
  );
};
```

So, here we are. Staring at our favorite editor. Blank file. Looking as if we were ready to create the next unicorn. How hard could it be? After all, custom hooks are plain JS 🤔. Our hook returned some values and functions. We already have Jest on our project. Let's get started!

One of the first things we tried to do, was to invoke the hook directly in our test like this:

```javascript
import useKeyPress from "../useKeyPress";

describe("useKeyPress", () => {
  it("should return an empty array at initialization", () => {
    const { pressedKeys } = useKeyPress();
    expect(pressedKeys).toEqual([]);
  });
});
```

Are you able to figure out what the result of the test would be? If you are like most of us, you ran it and encountered this error:

    Invariant Violation: Invalid hook call. Hooks can only be called 
    inside of the body of a function component. 
    This could happen for one of the following reasons: 
     1. You might have mismatching versions of React 
        and the renderer (such as React DOM)
     2. You might be breaking the Rules of Hooks
     3. You might have more than one copy of React in the same app
     See https://fb.me/react-invalid-hook-call
     for tips about how to debug and fix this problem.

Shame on us! That's pretty clear 😢. You can't use a hook outside a hook function or a React component. So, what are our options? We could either create a wrapper component (that would have another catch) or we could use [react-hooks-testing-library](https://github.com/mpeyper/react-hooks-testing-library) package to make our lives easier.

```javascript
import useKeyPress from "../useKeyPress";
import { renderHook } from "react-hooks-testing-library";

describe("useKeyPress", () => {
  it("should return an empty array at initialization", () => {
    const { result } = renderHook(() => useKeyPress());
    expect(result.current.pressedKeys).toEqual([]);
  });
});
```
OK, what are we doing here? Basically, we are importing **renderHook** from **react-hooks-testing-library**; a wrapper function that will help us (perfectly named btw) _rendering_ our hook.

After that, instead of invoking **useCustomHook** directly, we will pass it to **renderHook** as a parameter. **renderHook** will return an object, which we'll destruct into **result**.

Finally, we have a **current** object inside **result** that holds the object return by our hook, hence we can easily assert **pressedKeys** value.

Now that we have our initial setup going on, let's play around a bit with our hook. I'm planning to call **setPressedKey** to add some values to **pressedKeys** and check if everything is in place.

```javascript
import useKeyPress from "../useKeyPress";
import { renderHook } from "react-hooks-testing-library";

describe("useKeyPress", () => {
  it("should return an empty array at initialization", () => {
    const { result } = renderHook(() => useKeyPress());
    expect(result.current.pressedKeys).toEqual([]);
  });

  it("should add a key to pressedKeys on `setPressedKey`", () => {
    const { result } = renderHook(() => useKeyPress());
    result.current.setPressedKey("k");
    expect(result.current.pressedKeys).toHaveLength(1);
  });
});
```

We will run these tests as if we were the kings of the hooks, but although it hasn't failed, we got a pretty nasty warning.

    Warning: An update to TestHook inside a 
    test was not wrapped in act(...).
     
     When testing, code that causes React state 
     updates should be wrapped into act(...):
     
     act(() => {
     /* fire events that update state */
     });
     /* assert on the output */

Okay, fair enough. We need to wrap our call to **setPressedKey** in this `act` method. To do so, we just need to add it to the import of **react-hooks-testing-library**.

```javascript
import useKeyPress from "../useKeyPress";
import { renderHook, act } from "react-hooks-testing-library";

describe("useKeyPress", () => {
  it("should return an empty array at initialization", () => {
    const { result } = renderHook(() => useKeyPress());
    expect(result.current.pressedKeys).toEqual([]);
  });

  it("should add a key to pressedKeys on `setPressedKey`", () => {
    const { result } = renderHook(() => useKeyPress());

    act(() => result.current.setPressedKey("k"));

    expect(result.current.pressedKeys).toHaveLength(1);
  });
});
```

With this, we should be ready to cover all the possible scenarios for our hook. This is our final test file.

```javascript
import useKeyPress from "../useKeyPress";
import { renderHook, act } from "react-hooks-testing-library";

describe("useKeyPress", () => {
  it("should return an empty array at initialization", () => {
    const { result } = renderHook(() => useKeyPress());
    expect(result.current).toEqual({
      pressedKeys: [],
      setPressedKey: expect.any(Function),
      clearPressedKeys: expect.any(Function),
      removeDuplicateKeys: expect.any(Function)
    });
  });

  it("should add a key to pressedKeys on `setPressedKey`", () => {
    const { result } = renderHook(() => useKeyPress());

    act(() => result.current.setPressedKey("k"));

    expect(result.current.pressedKeys).toHaveLength(1);
    expect(result.current.pressedKeys).toContain("k");

    act(() => result.current.setPressedKey("l"));

    expect(result.current.pressedKeys).toHaveLength(2);
    expect(result.current.pressedKeys).toContain("l");
  });

  it("should clear pressedKeys on `clearPressedKeys`", () => {
    const { result } = renderHook(() => useKeyPress());

    act(() => result.current.setPressedKey("k"));
    act(() => result.current.setPressedKey("l"));

    expect(result.current.pressedKeys).toHaveLength(2);

    act(() => result.current.clearPressedKeys());
    expect(result.current.pressedKeys).toHaveLength(0);
  });

  it("should remove duplicates on `removeDuplicateKeys`", () => {
    const { result } = renderHook(() => useKeyPress());

    act(() => result.current.setPressedKey("l"));
    act(() => result.current.setPressedKey("l"));
    act(() => result.current.setPressedKey("l"));
    act(() => result.current.setPressedKey("f"));

    expect(result.current.pressedKeys).toHaveLength(4);

    act(() => result.current.removeDuplicateKeys());
    expect(result.current.pressedKeys).toHaveLength(2);
    expect(result.current.pressedKeys.filter(p => p === "l"))
      .toHaveLength(1);
  });
});
```

We were able to test everything we needed from our hook and have even tested to make certain we get the correct object with our functions, instead of just checking the initial value for **pressedKeys**.

Finally, here is the link to the full repository if you want to get a working example: [https://github.com/falecci/plain-js-hooks-testing](https://github.com/falecci/plain-js-hooks-testing).

_One last gotcha we encountered on our path is that we can't destructure **current** from **result**, because this value changes every time we call `act`, therefore we would never get the updated values._

I hope you've liked the article and found it helpful. As I said in the intro, we are still walking our path with Hooks, so if you have some suggestions, please feel free to reach me out on Twitter!