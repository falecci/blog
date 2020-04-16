---
title: Unit Testing React Hooks Propios
date: "2019-05-23"
description: Como escribir unit tests para react hooks propios sin interactuar con el dom para nada!
---

Si quieres evitar toda la intro y explicacion, siéntete libre de ir hasta al final o simplemente visitar el repo. Sin embargo, si quisieras irte con un mejor entendimento, te recomiendo disfrutar la historia completa.

![](https://cdn-images-1.medium.com/max/2400/1*aLg1-G2UAlaKpBopRnmCRg.png)

Asi que todos se han _enganchado_ (si, lo has captado) con hooks y otros **nuevos** features de React hasta ahora. Si aun no has tenido la posibilidad de jugar con ellos, podrías arrancar leyendo la [documentacion](https://es.reactjs.org/docs/hooks-intro.html). Como siempre, ha sido de gran ayuda.

Desarrollar componentes con hooks ha sido un gran placer para nosotros. Hemos llegado a creer firmemente que ayudan a crear components que son **mucho mas faciles de leer y mas significativos**. Sin embargo, mientras ibamos avanzando por nuestro camino, llegamos al punto donde teniamos que escribir algunos tests (yeap, como esta era nuestra primera experiencia real con hooks, estabamos muy ansiosos de ignorar TDD esta vez).

Aunque habia articulos muy útiles sobre como testear hooks propios, la mayoria involucraba interaccion directa con un componente, en vez de simplemente testear los hooks por su cuenta. Mientras que en muchos casos, eso seria efectivo para testear tu hook propio, hay ciertas situaciones donde no es un camino muy feliz para transitar (por ejemplo, si necesitas muchísima interacción con la UI en tu componente).

## Vamos Al Código!

Antes de comenzar, deberias tener en cuenta algunas cosas:

- Estaremos utilizando el paquete [react-hooks-testing-library](https://github.com/mpeyper/react-hooks-testing-library). Para usar este paquete, tendras que instalar [react-test-renderer](https://www.npmjs.com/package/react-test-renderer) tambien. No olvides agregarlos como **dev** dependencies.

- Como han aclarado en el readme, deberias ***únicamente*** hacer esto si tu hook no esta directamente atado a un componente o si es difícil de testear a través de la interacción con la UI.

Para la demostración, usaremos este lindo **useKeyPress** hook. A pesar de ser bastante auto explicativo, este hook devuelve un objeto con:

* **pressedKeys**: un array de teclas presionadas.

* **setPressedKey**: una función para añadir una tecla a **pressedKeys**.

* **removeDuplicateKeys**: una función para remover duplicados en **pressedKeys**.

* **clearPressedKeys**: una función para limpiar nuestras teclas presionadas.

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

Por otro lado, tenemos un componente muy sencillo y de aspecto tonto para jugar con este hook (*podríamos llamarlo Tonto.jsx*):

![Podríamos llamarlo Tonto.jsx](https://cdn-images-1.medium.com/max/2000/1*lDK7MISeAszi5KVviguEAQ.png)

Y debajo, encontrarás su código. Estamos utilizando **useEffect** para agregar un event handler a window para cada vez que alguien presiona una tecla. Los imports y estilos fueron removidos de este bloque para disminuir la longitud del código.

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

Bueno, aquí estamos. Observando nuestro editor de código favorito. Archivo en blanco. Mirando como si estuviéramos listos para crear el próximo unicornio. ¿Qué tan difícil podría ser? Después de todo, los hooks propios son JS puro 🤔. Nuestro hook devolvía algunos valores y funciones. Ya tenemos instalado Jest en nuestro proyecto. Así que, arranquemos!

Una de las primeras cosas que intentamos hacer, fue invocar directamente el hook en nuestro test de esta manera:

```javascript
import useKeyPress from "../useKeyPress";

describe("useKeyPress", () => {
  it("should return an empty array at initialization", () => {
    const { pressedKeys } = useKeyPress();
    expect(pressedKeys).toEqual([]);
  });
});
```

Eres capaz de descubrir cuál sería el resultado de el test? Si sos como la mayoría de nosotros, lo ejecutaste y te encontraste con este error:

    Invariant Violation: Invalid hook call. Hooks can only be called 
    inside of the body of a function component. 
    This could happen for one of the following reasons: 
     1. You might have mismatching versions of React 
        and the renderer (such as React DOM)
     2. You might be breaking the Rules of Hooks
     3. You might have more than one copy of React in the same app
     See https://fb.me/react-invalid-hook-call
     for tips about how to debug and fix this problem.

Qué mal estuvimos! Eso es bastante claro 😢. No se puede usar un hook fuera de una función hook o un componente de React. Por lo tanto, cuáles son nuestras opciones? Podriamos o wrappear nuestro componente (esto tendría otro problemita) o podríamos usar el paquete [react-hooks-testing-library](https://github.com/mpeyper/react-hooks-testing-library) para que nuestras vida sea más fácil..

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
OK, ¿qué estamos haciendo acá? Básicamente, estamos importando **renderHook** desde **react-hooks-testing-library**; una función wrapper que nos ayudará (perfectamente nombrado por cierto) a _renderizar_ nuestro hook.

Después de eso, en vez de invocar **useCustomHook** directamente, lo pasaremos a **renderHook** como un parámetro. **renderHook** devolverá un objeto, que desestructuraremos en **result**.

Finalmente, tenemos un objeto **current** dentro de **result** que tiene el objeto que devuelve nuestro hook, por eso podemos fácilmente asertar el valor de **pressedKeys**.

Ahora que tenemos nuestra configuración inicial, vamos a jugar un poc con nuestro hook. Estoy pensando en llamar a **setPressedKey** para agregar algunos valores a **pressedKeys** y chequear si todo es correcto.

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

Vamos a correr estos tests como si fuéramos los reyes de los hooks, pero a pesar de que no ha fallado, tuvimos un warning bastante engorroso y feo.

    Warning: An update to TestHook inside a 
    test was not wrapped in act(...).
     
     When testing, code that causes React state 
     updates should be wrapped into act(...):
     
     act(() => {
     /* fire events that update state */
     });
     /* assert on the output */

Okay, es un buen punto. Debemos wrappear nuestra llamada a **setPressedKey** en este método `act`. Para hacerlo, solo necesitamos agregarlo al import de **react-hooks-testing-library**.

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

Con esto, deberíamos estar listos para cubrir todos los escenarios posibles de nuestro hook. Este es nuestro archivo final de test.

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

Fuimos capaces de testear todo lo que necesitábamos de nuestro hook e incluso hemos testeado para asegurarnos de obtener el objeto correcto con nuestras funciones, en vez de solo chequear el valor inicial de **pressedKeys**.

Finalmente, este es link al repositorio completo, por si deseas tener un ejemplo funcionando localmente: [https://github.com/falecci/plain-js-hooks-testing](https://github.com/falecci/plain-js-hooks-testing).

_Un último gotcha que encontramos en nuestro camino es que no podemos destructurar **current** de **result**, ya que este valor cambia cada vez que invocamos a `act`, por lo que nunca tendríamos los valores actualizados._

Espero que te haya gustado y hayas encontrado útil este artículo. Como dije en la intro, todavía estamos transitando este camino de hooks, por lo que si tenes sugerencias, por favor siéntete libre de contactarme por Twitter!