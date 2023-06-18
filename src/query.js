import axios from 'axios';

const config = {
  KEY: '37480059-7c59a12f057123141133a4bfe',
  BASE_URL: 'https://pixabay.com/api/',
  PER_PAGE: 40,
};

async function getSearch(query, page) {
  const params = new URLSearchParams({
    image_type: 'photo',
    orientation: 'horizontal',
    per_page: config.PER_PAGE,
    safesearch: true,
    page,
  });
  return await axios.get(
    `${config.BASE_URL}?key=${config.KEY}&q=${query}&${params}`
  );
}
console.log(getSearch());

export { config, getSearch };
