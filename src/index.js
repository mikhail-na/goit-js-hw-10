import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const input = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(onIntuoChange, DEBOUNCE_DELAY));

function clear(el) {
  el.innerHTML = '';
}

function onIntuoChange(e) {
  e.preventDefault();

  const inputValue = e.target.value.trim();
  if (inputValue === '') {
    clear(countryList);
    clear(countryInfo);
    return;
  }

  fetchCountries(inputValue)
    .then(countries => {
      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (countries.length >= 2 && countries.length <= 10) {
        clear(countryList);
        addListMarkup(countries);
        clear(countryInfo);
      } else {
        clear(countryInfo);
        addInfoMarkup(countries);
        clear(countryList);
      }
    })
    .catch(() => {
      clear(countryList);
      clear(countryInfo);
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function addListMarkup(countries) {
  let markup = '';
  for (const country of countries) {
   markup += `<li class="country-list__item">
        <img class="country-list__img" src="${country.flags.svg}" alt="flag" width="30px"/>
        <p class="country-list__text">${country.name.official}</p>
      </li>`;
  }    
    
  return countryList.insertAdjacentHTML('beforeend', markup);
}

function addInfoMarkup(countries) {
  let markup = '';
  for (const country of countries) {
    markup += `
  <div class="flag">
    <img class="img" src="${country.flags.svg}" alt="flag" width="60px">
    <p class="name">${country.name.official}</p>
  </div>
  <ol class="info">
      <li class="item"> <b>Capital</b>:
    <span class="span">${country.capital}</span>
      </li>
      <li class="item"> <b>Population</b>:
    <span class="span">${country.population}</span>
      </li>
      <li class="item"> <b>Languages</b>:
    <span class="span">${Object.values(country.languages).join(', ')}</span>
      </li>
  </ol>`;
  }

  return countryInfo.insertAdjacentHTML('beforeend', markup);
}