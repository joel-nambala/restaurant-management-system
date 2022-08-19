'use strict';

import { accounts } from './user-data/userData.js';
import { diets } from './diets/diets.js';

// Select DOM elements
const modalLogin = document.querySelector('.modal-login');
const logInBtn = document.querySelector('.btn--login');
const overlay = document.querySelector('.overlay');

const form = document.querySelector('.nav-form');
const navInput = document.querySelector('.nav-input');
const btnShop = document.querySelector('.btn--shop');

const recipeBody = document.querySelector('.recipe-body');

const shoppingList = document.querySelector('.shopping-list');
const shoppingCart = document.querySelector('.shopping-cart');
const shoppingCartList = document.querySelector('.shopping-cart-list');
const shoppingTotal = document.querySelector('.shopping-cart-total-value');
// State variables
let total = 0;

const init = function () {
  shoppingTotal.textContent = 0;
};

init();

//////////////////////////////////////////////////////////
// Modal window
const showModal = function () {
  modalLogin.classList.remove('hide');
};

const hideModal = function () {
  modalLogin.classList.add('hide');
};

logInBtn.addEventListener('click', showModal);
overlay.addEventListener('click', hideModal);

// Compute usernames
const computeUsername = function (account) {
  account.forEach(function (acc) {
    acc.username = acc.name
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
computeUsername(accounts);

// Displays recipes on the UI
const displayRecipe = function (e) {
  recipeBody.innerHTML = '';
  e.preventDefault();
  const diet = this;
  const searchQuery = navInput.value;

  const recipe = diet.filter(function (el, i, arr) {
    return el.category === searchQuery.toLowerCase().trim();
  });

  recipe.forEach(function (el, i, arr) {
    const html = `
      <div class="recipe-card">
        <img
          src="${el.img}"
          alt="${el.name}"
          class="recipe-img"
        />
        <h2 class="recipe-name">
          <span class="recipe-name--tag">${el.name}</span>
        </h2>
        <p class="recipe-price">Kshs <span class="recipe-price--tag">${el.price}</span></p>
        <i class="fa-solid fa-bookmark recipe-icon"></i>
        <p class="recipe-description">${el.des}</p>
        <button class="btn recipe-btn">Add to cart</button>
      </div>
    `;

    recipeBody.insertAdjacentHTML('beforeend', html);
    navInput.value = '';
  });
};

form.addEventListener('submit', displayRecipe.bind(diets));

// Shopping list
// shoppingCart.style.transform = `translateX(${100}%)`;

shoppingList.addEventListener('mouseenter', function (e) {
  const element = e.target.closest('.shopping-list');
  if (!element) return;
  shoppingCart.style.transform = `translate(0%, 100%)`;
});

shoppingCart.addEventListener('mouseleave', function (e) {
  shoppingCart.style.transform = `translate(100%, 100%)`;
});

//////////////////////////////////////////////////////////
// Add to cart functionality
let currentAccount = accounts[0];
let shoppingObject = [];

const goShopping = function (e) {
  const recipeBtn = e.target;
  if (recipeBtn.classList.contains('recipe-btn')) {
    const item = recipeBtn.parentElement;
    const recipeImg = item.querySelector('.recipe-img').src;
    const recipeName = item.querySelector('.recipe-name--tag').textContent;
    const recipePrice = item.querySelector('.recipe-price--tag').textContent;

    shoppingObject.push({
      img: recipeImg,
      name: recipeName,
      price: recipePrice,
    });
    this.shoppingList = shoppingObject;

    shoppingCartList.innerHTML = '';
    this.shoppingList.forEach(function (item, index, arr) {
      const html = `
          <li class="shopping-cart-item">
            <img
              src="${item.img}"
              alt="pilau"
              class="shopping-cart-img"
            />
            <p class="shopping-cart-name">
              <span class="shopping-cart-title">${item.name}</span>
              <span class="shopping-cart-price">Ksh ${item.price}</span>
            </p>
          </li>
      `;

      shoppingCartList.insertAdjacentHTML('beforeend', html);
    });
  }
  let budget = [];
  this.shoppingList.forEach(function (cur, i, arr) {
    budget.push(+cur.price);
  });
  const totalValue = budget.reduce(function (acc, cur, i, arr) {
    return acc + cur;
  }, 0);
  const n = new Intl.NumberFormat('en-US').format(totalValue);
  shoppingTotal.textContent = n;
};

recipeBody.addEventListener('click', goShopping.bind(currentAccount));
