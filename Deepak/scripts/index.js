let bagItems;
let wishlistItems;
onLoad1();
onLoad2();

function toggleMenu() {
    var menu = document.getElementById("nav-buttons");
    if (menu.style.display === "none" || menu.style.display === "") {
        menu.style.display = "flex";
    } else {
        menu.style.display = "none";
    }
}

function toggleLoginForm() {
    var loginForm = document.getElementById("loginForm");
    if (loginForm.style.display === "none" || loginForm.style.display === "") {
        loginForm.style.display = "block";
    } else {
        loginForm.style.display = "none";
    }
}

function onLoad1() {
    let bagItemsStr = localStorage.getItem('bagItems');
    bagItems = bagItemsStr ? JSON.parse(bagItemsStr) : [];
    displayItemsOnHomePage();
    displayBagIcon();
    updateButtonStates();
}

function onLoad2() {
    let wishItemsStr = localStorage.getItem('wishlistItems');
    wishlistItems = wishItemsStr ? JSON.parse(wishItemsStr) : [];
    displaywishIcon();
    updateWishlistButtonStates();
}

function addToBag(event) {
    const button = event.target;
    const itemId = button.getAttribute('data-item-id');

    if (!bagItems.includes(itemId)) {
        bagItems.push(itemId);
        localStorage.setItem('bagItems', JSON.stringify(bagItems));
        button.textContent = 'Go to Bag';
    } else {
        showBagItems();
    }

    displayBagIcon();
}

function showBagItems() {
    window.location.href = "pages/bag.html";
}

function displayBagIcon() {
    let bagItemCountElement = document.querySelector('.bag-item-count');
    if (bagItems.length > 0) {
        bagItemCountElement.style.visibility = 'visible';
        bagItemCountElement.innerText = bagItems.length;
    } else {
        bagItemCountElement.style.visibility = 'hidden';
    }
}

function addTowish(event) {
    const button = event.target;
    const itemId = button.getAttribute('data-item-id');

    if (!wishlistItems.includes(itemId)) {
        wishlistItems.push(itemId);
        localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
        button.style.backgroundColor = 'red';
    } else {
        wishlistItems = wishlistItems.filter(item => item !== itemId);
        localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
        button.style.backgroundColor = '';
    }

    displaywishIcon();
}

function displaywishIcon() {
    let wishItemCountElement = document.querySelector('.wishlist-item-count');
    if (wishlistItems.length > 0) {
        wishItemCountElement.style.visibility = 'visible';
        wishItemCountElement.innerText = wishlistItems.length;
    } else {
        wishItemCountElement.style.visibility = 'hidden';
    }
}

function displayItemsOnHomePage() {
    let itemsContainerElement = document.querySelector('.items-container');
    if (!itemsContainerElement) return;

    let innerHtml = '';
    items.forEach(item => {
        innerHtml += `
            <div class="item-container">
                <img class="item-image" src="${item.image}" alt="item image">
                <span class="rating">
                    ${item.rating.stars} ⭐ | ${item.rating.count}
                    <span class="material-symbols-outlined action_icon action_icon1 addToWishlist" data-item-id="${item.id}">favorite</span>
                </span>
                <div class="company-name">${item.company}</div>
                <div class="item-name">${item.item_name}</div>
                <div class="price">
                    <span class="current-price">Rs ${item.current_price}</span>
                    <span class="original-price">Rs ${item.original_price}</span>
                    <span class="discount">(${item.discount_percentage}% OFF)</span>
                </div>
                <button class="btn-add-bag button addToBag" data-item-id="${item.id}">Add to Bag</button>
            </div>`;
    });
    itemsContainerElement.innerHTML = innerHtml;

    document.querySelectorAll('.addToBag').forEach(button => {
        button.addEventListener('click', addToBag);
    });

    document.querySelectorAll('.addToWishlist').forEach(button => {
        button.addEventListener('click', addTowish);
    });
}

function updateButtonStates() {
    document.querySelectorAll('.addToBag').forEach(button => {
        const itemId = button.getAttribute('data-item-id');
        if (bagItems.includes(itemId)) {
            button.textContent = 'Go to Bag';
        }
    });
}

function updateWishlistButtonStates() {
    document.querySelectorAll('.addToWishlist').forEach(button => {
        const itemId = button.getAttribute('data-item-id');
        if (wishlistItems.includes(itemId)) {
          button.style.backgroundColor = 'red';
        } else {
          button.style.backgroundColor = '';
        }
    });
}

// Slider code

const slides = document.getElementById('slides');
const slideCount = slides.children.length;
let currentIndex = 0;
const slideInterval = 3000; // Time interval for slide transition

// Clone the first and last slides to create an infinite loop effect
const firstSlide = slides.firstElementChild.cloneNode(true);
const lastSlide = slides.lastElementChild.cloneNode(true);

slides.appendChild(firstSlide);
slides.insertBefore(lastSlide, slides.firstElementChild);

function updateSlidePosition() {
    slides.style.transition = 'transform 0.5s ease-in-out';
    slides.style.transform = `translateX(-${(currentIndex + 1) * 100}%)`;
}

function nextSlide() {
    currentIndex++;
    updateSlidePosition();

    if (currentIndex >= slideCount) {
        setTimeout(() => {
            slides.style.transition = 'none';
            slides.style.transform = 'translateX(-100%)';
            currentIndex = 0;
        }, 500); // Match this duration to the CSS transition duration
    }
}

// Set initial position to show the first cloned slide as the first visible slide
slides.style.transform = 'translateX(-100%)';

setInterval(nextSlide, slideInterval);
