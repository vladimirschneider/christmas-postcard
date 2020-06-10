import API from './api';

import {getUrlParams} from './until';

let Api = new API();

const app = document.querySelector('.app');
const text = document.querySelector('.main__text');

const shortcut = getUrlParams(location.href).shortcut;

Api.getUserPostCard(shortcut).then(
    (json) => {
      text.innerHTML = json.postcard.text || 'This postcard did not create yet';

      if (json.postcard.theme) {
        app.style.backgroundColor
          = json.postcard.theme.background_color || '#0f8a5f';
        app.style.backgroundImage
            = `url(https://christmas-postcard.com/${json.postcard.theme.background_image})`;

        let isPlay = false;

        const btnPlayAudio = document.querySelector('.btn_song-play');
        const audioElement = new Audio(`https://christmas-postcard.com/${json.postcard.song.sound}`);

        btnPlayAudio.addEventListener('click', () => {
          playMusic();
        });

        Api.getMe().then(function(result) {
          let isMyPostcard = false;
          const queryShortcut = getParameterByName('shortcut', window.location);

          for (let i = 0; i < result.info.postcards.length; i++) {
            let postcard = result.info.postcards[i];

            if (postcard.shortcut === queryShortcut) {
              isMyPostcard = true;
              break;
            }
          }

          if (!isMyPostcard) {
            const btnCreatePostcard = document.querySelector('.btn_create');

            btnCreatePostcard.innerHTML = 'Создать открытку';

            const playModal = document.querySelector('.play-modal');
            playModal.hidden = false;

            const playModalbtnPlay = playModal.querySelector('.play-modal__play');
            const playModalbtnClose = playModal.querySelector('.play-modal__close');

            playModalbtnPlay.focus();

            playModalbtnPlay.addEventListener('click', () => {
              playMusic();
              playModal.hidden = true;
            });

            playModalbtnClose.addEventListener('click', () => {
              playModal.hidden = true;
            });
          }
        });

        function playMusic() {
          if (isPlay) {
            audioElement.pause();
            audioElement.loop = false;

            isPlay = false;

            btnPlayAudio.innerHTML = 'Воспроизвести';
          } else {
            audioElement.play();
            audioElement.loop = true;

            isPlay = true;

            btnPlayAudio.innerHTML = 'Пауза';
          }
        }
      }
    }
);

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
