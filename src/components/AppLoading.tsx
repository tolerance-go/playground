import nprogress from 'nprogress';
import 'nprogress/nprogress.css';
import { useLayoutEffect } from 'react';

export default function Loading() {
  useLayoutEffect(() => {
    nprogress.start();
    return () => {
      nprogress.done();
    };
  });

  return <div></div>;
}
