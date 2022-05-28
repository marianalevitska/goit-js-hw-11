import './sass/main.scss';
import PhotosApiService from './js/photo-service';
import hitsTpl from './templates/hits.hbs'

import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";


console.log(hitsTpl)
const refs = {
    searchForm: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    onLoadMoreBtn: document.querySelector('.load-more'),
}
const photosApiService = new PhotosApiService();

const lightbox = new SimpleLightbox('.ligtbox-link', {
overlayOpacity: 0.4,
animationSpeed: 100,
    });


refs.searchForm.addEventListener('submit', onSearch);
refs.onLoadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(e) {
    e.preventDefault();
    clearHitsGallery();
    
    photosApiService.resetPage();
    photosApiService.query = e.currentTarget.elements.searchQuery.value;
    if (photosApiService.query === '') {
        chekInput();
        return;
    }

    try {
        const result = await photosApiService.fetchPhotos();
        appendHitsMarkup(result);
        
        scrollTo();
        photosApiService.setTotalHits(result.totalHits); 

        lightbox.refresh();
        
        Notiflix.Notify.success(`Hooray! We found ${photosApiService.totalHits} images.`);
        onShowLoadMoreBtn();
        onLastPhotos();
    }
    catch (error) {
    Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.',
    );
    }
}
async function onLoadMore() {
    const result = await photosApiService.fetchPhotos();
    appendHitsMarkup(result);
    
    scrollTo();
    onLastPhotos();
    photosApiService.lastTotalHits();
    lightbox.refresh();
}

function appendHitsMarkup(markup) {
    refs.gallery.insertAdjacentHTML('beforeend', hitsTpl(markup) )
}
function clearHitsGallery() {
    refs.gallery.innerHTML = '';
}

function onShowLoadMoreBtn() {
    refs.onLoadMoreBtn.classList.remove('is-hidden');
}
function hideShowMoreBtn() {
    refs.onLoadMoreBtn.classList.add('is-hidden');
}

function chekInput() {
    Notiflix.Notify.failure('Sorry! You have to enter something.Please, try again!') 
    hideShowMoreBtn();
    photosApiService.resetPage(); 
    }
   
function onLastPhotos() {
        if (photosApiService.totalHits <= 40) {
    hideShowMoreBtn();
  Notiflix.Notify.info("We're sorry, but you've reached the end of search results");
    return;
  }
    }

function scrollTo() {
    const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();
        window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
});
}


