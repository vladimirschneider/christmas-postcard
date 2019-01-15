'use strict';

import 'normalize.css';
import '../public/css/style.css';

import Snow from './snow';

const snowCanvas = document.querySelector('.app__snow');

new Snow(snowCanvas);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
        .register('./service-worker.js')
        .then(
            () => {}
        ).catch(
            () => {}
        );
  });
}
