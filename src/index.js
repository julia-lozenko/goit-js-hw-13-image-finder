import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';
import './css/styles.css';
import imagesTpl from './templates/card.hbs';
import ImageAPIService from './js/images-servise';
import LoadMoreBtn from './js/load-more-btn';

const debounce = require('lodash.debounce');
const api = new ImageAPIService();

const searchRF = document.querySelector('#search-form');
const galleryRF = document.querySelector('.gallery');

const loadMoreBtn = new LoadMoreBtn({
  selector: 'load-more-btn',
  hidden: true,
});

const searchButtonRef = document.querySelector('.search-btn');
searchButtonRef.addEventListener('click', fetchImages)

searchRF.addEventListener('input', debounce(onSearchForm, 500));
galleryRF.addEventListener('click', onOpenModal);

loadMoreBtn.refs.button.addEventListener('click', fetchImages);

let currentCoord = 0;

async function onSearchForm(event) {
  event.preventDefault();

  api.query = event.target.value;

  try {
    if (api.query === '') {
      galleryRF.innerHTML = '';
      loadMoreBtn.hide();
      return;
    }

    api.resetPage();
    galleryRF.innerHTML = '';
  } catch (error) {
    console.log(error);
  }
}

async function fetchImages() {
  currentCoord = galleryRF.offsetHeight;

  try {
    loadMoreBtn.show();
    loadMoreBtn.disable();

    api.fetchImages()
      .then(images => {
        appendImagesMarkup(images);
        loadMoreBtn.enable();
        scrollingPage();
        searchError(images);
      });
  } catch (error) {
    console.log(error);
  }
}

function appendImagesMarkup(images) {
  galleryRF.insertAdjacentHTML('beforeend', imagesTpl(images));
}

async function scrollingPage() {
  try {
    window.scrollTo({
      top: currentCoord,
      left: 0,
      behavior: 'smooth',
    });
  } catch (error) {
    console.log(error);
  }
}

async function searchError(images) {
  try {
    const numberOfImages = images.hits.length;
    if (numberOfImages === 0) {
      console.log('the number of images is 0');
      loadMoreBtn.hide();
    }
  } catch (error) {
    console.log(error);
  }
}

function onOpenModal(event) {
  if (event.target.nodeName !== 'IMG') {
    return;
  }
  const instance = basicLightbox.create(`<img src='${event.target.dataset.src}' alt='' />`);
  instance.show();
}


