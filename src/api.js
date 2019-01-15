import {setCookie, getCookie, getUrlParams} from './until';
import options from './options';

export default class Api {
  constructor() {
    this.user = {};
    this.songs = {};

    this.isPlay = false;
    this.loadedAudiosId = [];

    this.init();
  }

  init() {
    const btnCreate = document.querySelector('.btn_create');
    const btnList = document.querySelector('.btn_list');

    this.getUserPostCards().then(
        (postcards) => {
          const shortcut = getUrlParams(location.href).shortcut;
          let isShortcut = false;

          if (shortcut) {
            for (const key in postcards) {
              if (postcards[key].shortcut == shortcut) {
                isShortcut = true;
              }
            }
          }

          if (isShortcut && btnCreate) {
            if (btnCreate) {
              btnCreate.classList.remove('btn_hidden');
            }
          }

          if (postcards.length > 0 && btnList) {
            btnList.classList.remove('btn_hidden');
          }
        }
    );
  }

  getToken() {
    return new Promise(
        (resolve, reject) => {
          let token = getCookie('token');

          if (!token) {
            fetch(`${options.baseApiURL}/me`, {
              mode: 'cors',
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'multipart/form-data',
              },
              method: 'POST',
            }).then(
                (result) => {
                  if (!result.ok) {
                    throw new Error('Error response');
                  }

                  return result.json();
                }
            ).then(
                (json) => {
                  setCookie('token', json.token);

                  resolve(json.token);
                }
            ).catch(
                () => {
                  reject();
                }
            );
          } else {
            resolve(token);
          }
        }
    );
  }

  getSongs() {
    return new Promise(
        (resolve, reject) => {
          this.getToken().then(
              (token) => {
                this.user.token = token;

                fetch(`${options.baseApiURL}/get_sounds`).then(
                    (result) => {
                      if (!result.ok) {
                        throw new Error();
                      }

                      return result.json();
                    }
                ).then(
                    (json) => {
                      resolve(json.sounds);
                    }
                ).catch(
                    () => {
                      reject();
                    }
                );
              }
          );
        }
    );
  }

  getMe() {
    return new Promise(
        (resolve, reject) => {
          this.getToken().then(
              (token) => {
                this.user.token = token;

                fetch(`${options.baseApiURL}/me?token=${this.user.token}`).then(
                    (result) => {
                      if (!result.ok) {
                        throw new Error();
                      }

                      return result.json();
                    }
                ).then(
                    (json) => {
                      resolve(json);
                    }
                ).catch(
                    () => {
                      reject();
                    }
                );
              }
          );
        }
    );
  }

  getUserPostCards() {
    return new Promise(
        (resolve, reject) => {
          this.getToken().then(
              (token) => {
                this.user.token = token;

                this.getMe().then(
                    (result) => {
                      resolve(result.info.postcards);
                    }
                ).catch(
                    () => {
                      reject();
                    }
                );
              }
          );
        }
    );
  }

  getUserPostCard(shortcut) {
    return new Promise(
        (resolve, reject) => {
          this.getToken().then(
              (token) => {
                this.user.token = token;

                fetch(`${options.baseApiURL}/postcard/${shortcut}`).then(
                    (result) => {
                      if (!result.ok) throw new Error();

                      return result.json();
                    }
                ).then(
                    (json) => {
                      resolve(json);
                    }
                ).catch(
                    () => {
                      reject();
                    }
                );
              }
          );
        }
    );
  }

  getThemes() {
    return new Promise(
        (resolve, reject) => {
          this.getToken().then(
              (token) => {
                this.user.token = token;

                fetch(`${options.baseApiURL}/get_themes`, {
                  mode: 'cors',
                  headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'multipart/form-data',
                  },
                }).then(
                    (result) => {
                      if (!result.ok) {
                        throw new Error('Error response');
                      }

                      return result.json();
                    }
                ).then(
                    (json) => {
                      resolve(json.themes);
                    }
                ).catch(
                    () => {
                      reject();
                    }
                );
              }
          );
        }
    );
  }

  publicPostCard() {
    return new Promise(
        (resolve, reject) => {
          this.getToken().then(
              (token) => {
                this.user.token = token;

                if (!(!!this.user.text == true
                  && !!this.user.theme_id == true
                  && !!this.user.token == true)) {
                  throw new Error('Error user data');
                }

                const dataPostCard = {
                  text: this.user.text,
                  theme_id: this.user.theme_id,
                  song_id: this.user.song_id,
                };

                fetch(
                    `${options.baseApiURL}/create_postcard?token=${this.user.token}`
                    , {
                      mode: 'cors',
                      headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json',
                      },
                      method: 'POST',
                      body: JSON.stringify(dataPostCard),
                    }).then(
                    (result) => {
                      if (!result.ok) {
                        throw new Error('Error response');
                      }

                      return result.json();
                    }
                ).then(
                    (json) => {
                      console.log(json);
                      const link = `./postcard.html?shortcut=${json.shortcut}`;

                      resolve(link);
                    }
                ).catch(
                    (e) => {
                      console.log(e);
                      reject();
                    }
                );
              }
          );
        }
    );
  }

  userUpdate(name, value) {
    this.user[name] = value;
  }

  playSongInit() {
    this.btnSongPlay = document.querySelector('.btn_song-play');
    this.btnSongPlay.classList.remove('btn_hidden');
    this.btnsChoiseSong = document.querySelectorAll('[data-songchoise]');
    this.songsListPlay = document.querySelectorAll('[data-playsong]');

    this.btnSongPlay.addEventListener('click', () => {
      this.playSong(this.user.song_id);
    });

    this.songsListPlay.forEach(
        (songListPlay) => {
          songListPlay.addEventListener('click', () => {
            let songID = songListPlay.dataset.playsong;

            this.playSong(songID, true);
          });
        }
    );
  }

  playSong(songID, other = false) {
    this.songs[songID]
      = typeof this.songs[songID] === 'string'
        ? new Audio(this.songs[songID])
          : this.songs[songID];

    if (this.playSongId) {
      this.songs[this.playSongId].pause();
    }

    const playsonglist = document.querySelectorAll(`[data-playsong]`);

    for (let i = 0; i < playsonglist.length; i++) {
      let playsongbtn = playsonglist[i];

      playsongbtn.classList.remove('song__play_play');
    }

    if (!(this.songs[this.playSongId] === this.songs[songID])) {
      if (other) this.isPlay = false;
    }

    if (this.isPlay === false) {
      this.songs[songID].play();

      this.isPlay = true;

      if (this.loadedAudiosId.indexOf(songID) === -1) {
        this.btnSongPlay.disabled = true;
      }

      this.songs[songID].addEventListener('canplaythrough', () => {
        if (this.loadedAudiosId.indexOf(songID) === -1) {
          this.btnSongPlay.disabled = false;

          this.loadedAudiosId.push(songID);
        }
      });

      document.querySelector(`[data-playsong="${songID}"]`).classList.add('song__play_play');

      this.btnSongPlay.innerHTML = 'Пауза';

      this.plaingSongId = songID;
    } else {
      this.songs[songID].pause();

      this.isPlay = false;

      document.querySelector(`[data-playsong="${songID}"]`).classList.remove('song__play_play');

      this.btnSongPlay.innerHTML = 'Воспроизвести';
    }

    this.playSongId = songID;
    this.user.song_id = songID;
  }
}
