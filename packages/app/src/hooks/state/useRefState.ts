import { RefObject, useEffect, useState } from 'react';

export function useRefState<T>(ref: RefObject<T>): T | null {
  const [state, setState] = useState(ref.current);

  useEffect(() => {
    setState(ref.current);
  });

  return state;
}
