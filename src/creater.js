import API from './api';

let Api = new API();

const main = document.querySelector('main');

const textElement = document.querySelector('.main__text');
const placeholderElement = document.querySelector('.main__placeholder');

textElement.focus();
placeholderController();

textElement.addEventListener('input', () => {
  placeholderController();
  Api.userUpdate('text', textElement.innerHTML);
});

main.addEventListener('click', () => {
  textElement.focus();
});

function placeholderController() {
  if (textElement.innerHTML == ''
    || textElement.innerHTML == '<br>') {
    placeholderElement.classList.remove('main__placeholder_none');
  } else {
    placeholderElement.classList.add('main__placeholder_none');
  }
}

const app = document.querySelector('.app');
const controlls = document.querySelector('.controlls__arrows');
let selectedTheme = 0;

controlls.classList.remove('controlls__arrows_none');

const btnPrev = controlls.querySelector('.btn_arrow-prev');
const btnNext = controlls.querySelector('.btn_arrow-next');

Api.getThemes().then(
    (themes) => {
      if (themes.length >= 1) {
        changeTheme(themes);

        btnPrev.addEventListener('click', () => {
          if (selectedTheme > 0) {
            selectedTheme--;
            changeTheme(themes);
          }
        });

        btnNext.addEventListener('click', () => {
          if (selectedTheme < themes.length) {
            selectedTheme++;
            changeTheme(themes);
          }
        });
      } else {
        controlls.classList.add('controlls__arrows_none');
      }
    }
);

function changeTheme(themes) {
  if (themes[selectedTheme]) {
    if (themes[selectedTheme].background_color) {
      app.style.backgroundColor
        = themes[selectedTheme].background_color;
    } else {
      app.style.backgroundColor
        = 'white';
    }

    if (themes[selectedTheme].background_image) {
      app.style.backgroundImage
        = `url(https://christmas-postcard.com/${themes[selectedTheme].background_image})`;
    } else {
      app.style.backgroundImage
        = 'none';
    }

    Api.userUpdate('theme_id', themes[selectedTheme].id);
  }

  controllButtons(themes);
}

function controllButtons(themes) {
  if (selectedTheme >= themes.length - 1) {
    btnPrev.disabled = false;
    btnNext.disabled = true;
  } else if (selectedTheme <= 0) {
    btnPrev.disabled = true;
    btnNext.disabled = false;
  } else {
    btnPrev.disabled = false;
    btnNext.disabled = false;
  }
}

const btnPublic = document.querySelector('[data-btn="public"]');

btnPublic.addEventListener('click', () => {
  Api.publicPostCard().then(
      (link) => {
        setTimeout(() => {
          window.open(link, '_self');
        }, 1000);
      }
  );
});

const btnSong = document.querySelector('.btn_song');
const songModal = document.querySelector('.modal__songs');
const songModalBackdrop = document.querySelector('.modal__backdrop');

btnSong.addEventListener('click', () => {
  songModal.classList.add('modal_show');
});

songModalBackdrop.addEventListener('click', () => {
  songModal.classList.remove('modal_show');
});

document.addEventListener('keypress', (e) => {
  if (e.keyCode == 27) {
    e.preventDefault();

    songModal.classList.remove('modal_show');
  }
});

Api.getSongs().then(
    (songs) => {
      const modalContent = songModal.querySelector('.modal__content');
      let modalSongs = '';
      let countSongs = 0;

      for (let i = 0; i < songs.length; i++) {
        const song = songs[i];

        if (i == 0) {
          Api.userUpdate('song_id', song.id);
        }

        Api.songs[song.id] = `https://christmas-postcard.com/${song.sound}`;

        modalSongs += `
        <div class="song" data-song=${song.id}>
          <div class="song__content">
            <div class="song__header">
              <div class="song__title">
                ${song.artist} – ${song.track}
              </div>
            </div>
            <button class="song_btn" aria-label="Choise" data-songchoise="${song.id}"><svg enable-background="new 0 0 15 12" height="12" viewBox="0 0 15 12" width="15" xmlns="http://www.w3.org/2000/svg"><g><path d="m2.539 3.535h3v8.001h-3z" transform="matrix(.7069 -.7073 .7073 .7069 -4.1456 5.0653)"/><path d="m2.843 4.268h13v3h-13z" transform="matrix(.7071 -.7071 .7071 .7071 -1.342 8.2958)"/></g></svg></button>
          </div>
          <div class="song__cover">
            <img src="https://christmas-postcard.com/${song.cover}" alt="Song cover">
            <button class="song__play" data-playsong="${song.id}"></button>
          </div>
        </div>
        `;

        countSongs++;

        modalContent.innerHTML = modalSongs;
      }

      if (countSongs) {
        btnSong.classList.remove('btn_hidden');
      }

      const defaultChoisedBtn = modalContent.querySelector(`[data-songchoise="${Api.user.song_id}"]`);

      defaultChoisedBtn.classList.add('song_btn_choised');

      Api.playSongInit();

      const btnsChoiseSong = document.querySelectorAll('[data-songchoise]');

      btnsChoiseSong.forEach(
          (btnChoiseSong) => {
            btnChoiseSong.addEventListener('click', () => {
              btnsChoiseSong.forEach(
                  (btnChoiseSong) => {
                    btnChoiseSong.classList.remove('song_btn_choised');
                  }
              );

              btnChoiseSong.classList.add('song_btn_choised');

              const songID = +btnChoiseSong.dataset.songchoise;

              Api.userUpdate('song_id', songID);
            });
          }
      );
    }
);
