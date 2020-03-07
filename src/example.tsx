import { createElement } from 'react';
import { render } from 'ink';
import Console from './';
import Counter from './Counter';

render(
  <div>
    <Counter />
    <br />
    <Console lines={20} />
  </div>,
);
