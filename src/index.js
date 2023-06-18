import { Notify } from 'notiflix';
import { config, getSearch } from './query';
import initializeSimpleLightbox from './simpleLightbox';
import smoothScroll from './smoothScroll.js';

const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.form-input');
const gallery = document.querySelector('.gallery');
const marker = document.querySelector('.marker');

const options = {
  rootMargin: '0px',
  threshold: 1,
};
const observer = new IntersectionObserver(observerCallback, options);

let lightbox = initializeSimpleLightbox();
let page = 0;

searchForm.addEventListener('submit', onSubmit);

function onSubmit(event) {
  event.preventDefault();
  gallery.innerHTML = '';
  page = 1;
  observer.unobserve(marker);
  const value = searchInput.value.trim();
  if (value !== '') {
    getSearch(value, page)
      .then(response => {
        if (response.data.totalHits > 0) {
          Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
          gallery.insertAdjacentHTML('beforeend', markup(response));
          lightbox.refresh();
        } else {
          Notify.warning(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        }
      })
      .catch(error => console.log(error))
      .finally(() => {
        lightbox.refresh();
        observer.observe(marker);
      });
  } else {
    Notify.info(
      `It seems you didn't write anything, please specify what exactly you are looking for`
    );
  }
}

function markup(obj) {
  const arrHits = obj.data.hits;
  return arrHits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        lightbox.refresh();
        return `
          <div class="photo-card">
            <div class="photo-wrap">
              <a href="${largeImageURL}">
                <img class="card-image" src="${webformatURL}" alt="${tags}" loading="lazy" />  
              </a>
            </div>
            <div class="info">
              <p class="info-item">
                <b>Likes</b>:</br>${likes}
              </p>
              <p class="info-item">
                <b>Views</b>:</br>${views}
              </p>
              <p class="info-item">
                <b>Comments</b>:</br>${comments}
              </p>
              <p class="info-item">
                <b>Downloads</b>:</br>${downloads}
              </p>
            </div>
          </div>
        `;
      }
    )
    .join('');
}

function observerCallback(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting === true) {
      page += 1;
      getSearch(searchInput.value, page)
        .then(response => {
          const lastPage = Math.ceil(response.data.totalHits / config.PER_PAGE);
          if (page === lastPage) {
            observer.unobserve(marker);
            Notify.info(
              `We're sorry, but you've reached the end of search results.`
            );
          }
          if (response.data.totalHits !== 0) {
            gallery.insertAdjacentHTML('beforeend', markup(response));
            smoothScroll(gallery, 2);
          }
        })
        .catch(error => console.log(error))
        .finally(() => {
          lightbox.refresh();
        });
    }
  });
}
