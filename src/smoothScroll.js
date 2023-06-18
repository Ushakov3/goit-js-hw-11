export default function smoothScroll(gallery, step) {
  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * step,
    behavior: 'smooth',
  });
}
