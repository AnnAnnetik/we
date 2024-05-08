import axios from 'axios';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('.form');
const galleryEl = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.load-more');

let currentPage = 1;
let searchQuery = '';
let totalHits = 0;
let cardHeight = 0;

loader.style.display = 'none';
loadMoreBtn.style.display = 'none';

let lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionDelay: 250,
  captionsData: 'alt',
});

formEl.addEventListener('submit', onSubmitForm);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSubmitForm(e) {
  e.preventDefault();
  searchQuery = document.querySelector('input').value.trim();

  if (!searchQuery) return;

  galleryEl.innerHTML = '';
  loader.style.display = 'inline-block';
  currentPage = 1;
  await fetchAndRenderImages(searchQuery);
  loadMoreBtn.style.display = 'inline-block';
}

async function fetchAndRenderImages() {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '42110229-d56f9063956695e15527c98fc',
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: currentPage,
        per_page: 15,
      },
    });
    totalHits = response.data.totalHits;
    renderImages(response.data.hits);
  } catch (error) {
    console.error(error);
    iziToast.error({
      message: 'Failed to fetch images. Please try again later.',
    });
  } finally {
    loader.style.display = 'none';
  }
}

function renderImages(images) {
  if (images.length === 0) {
    iziToast.warning({
      message: 'No images found. Please try a different search query.',
    });
    loadMoreBtn.style.display = 'none';
    return;
  }

  const galleryMarkup = images
    .map(
      image =>
        `<li class="gallery-item">
          <a class="gallery-link" href="${image.largeImageURL}">
            <img class="gallery-image" src="${image.webformatURL}" alt="${image.tags}" />
          </a>
          <div class="img-info">
            <p>Likes: ${image.likes}</p>
            <p>Views: ${image.views}</p>
            <p>Comments: ${image.comments}</p>
            <p>Downloads: ${image.downloads}</p>
          </div>
        </li>`
    )
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', galleryMarkup);

  lightbox.refresh();

  currentPage++;

  if (cardHeight === 0) {
    const firstCard = document.querySelector('.gallery-item');
    const cardRect = firstCard.getBoundingClientRect();
    cardHeight = cardRect.height;
  }

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });

  if (totalHits <= galleryEl.children.length) {
    loadMoreBtn.style.display = 'none';
  }
}

async function onLoadMore() {
  loader.style.display = 'inline-block';
  await fetchAndRenderImages();
}
