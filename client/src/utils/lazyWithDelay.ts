import { lazy } from 'react';

/**
 * Wraps React.lazy to enforce a minimum delay.
 * Useful for preventing loaders from flashing too quickly.
 */
export const lazyWithDelay = (factory, minDelay = 800) => {
  return lazy(() => 
    Promise.all([
      factory(),
      new Promise(resolve => setTimeout(resolve, minDelay))
    ]).then(([moduleExports]) => moduleExports)
  );
};
