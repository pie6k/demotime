import { useCallback, useRef, useLayoutEffect } from 'react';

type Callback<Args extends any[], Result> = (...args: Args) => Result;

/**
 * Works like useCallback, but doesn't require dependencies array.
 *
 * It creates callback that keeps the same reference during entire lifecycle of the component while having access to fresh
 * variables values on every render.
 */
export function useMethod<Args extends any[], Result>(
  callback?: Callback<Args, Result>,
): Callback<Args, Result> {
  /**
   * Let's create ref in which we'll keep 'fresh' value of the callback after every render.
   */
  const lastRenderCallbackRef = useRef<Callback<Args, Result> | undefined>(
    callback,
  );

  /**
   * Now - let's create actual callback that will keep the same reference all the time,
   * but under the hood will actually call 'fresh' callback from the last render.
   */
  const methodLikeCallback = useCallback((...args: Args): Result => {
    // perform call on version of the callback from last commited render
    if (!lastRenderCallbackRef.current) {
      throw new Error(
        'Cannot call useMethod callback if no callback is provided',
      );
    }
    return lastRenderCallbackRef.current(...args);
  }, []);

  /**
   * After render - replace 'fresh' callback ref.
   *
   * Note we're doing it inside effect instead of doing it directly in the hook body
   * in order to make it work properly in concurrent mode.
   *
   * In concurrent mode - render of some component can be called multiple times without
   * commiting.
   *
   * Effects, however - are called only after some render is finally commited
   */
  useLayoutEffect((): void => {
    // render is commited - it's safe to update the callback
    lastRenderCallbackRef.current = callback;
  });

  return methodLikeCallback;
}
