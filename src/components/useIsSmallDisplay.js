import { useEffect, useState } from 'react';

const isSmallDisplay = () => {
  if (globalThis.window !== undefined) {
    return globalThis.window.matchMedia('(max-width: 1024px)').matches;
  }

  return false;
};

const useIsSmallDisplay = () => {
  const [smallDisplay, setSmallDisplay] = useState(isSmallDisplay());

  const handleOnWindowResize = () => setSmallDisplay(isSmallDisplay());

  useEffect(() => {
    if (globalThis.window !== undefined) {
      globalThis.window.addEventListener('resize', handleOnWindowResize);

      return () =>
        globalThis.window.removeEventListener('resize', handleOnWindowResize);
    }
  }, []);

  return smallDisplay;
};

export default useIsSmallDisplay;
