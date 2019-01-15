import API from './api';

let Api = new API();

Api.getUserPostCards().then(
    (postcards) => {
      const postcardsContainer = document.querySelector('.postcards');
      let postcardsContainerInner = '';

      postcards.forEach(
          (postcard) => {
            postcardsContainerInner += `
              <a class="postcards__item" href="./postcard.html?shortcut=${postcard.shortcut}" style="background-image: url(https://christmas-postcard.com/${postcard.theme.background_image})">
                <p>
                  ${postcard.text}
                </p>
              </a>
            `;
          }
      );

      postcardsContainer.innerHTML = postcardsContainerInner;
    }
);
