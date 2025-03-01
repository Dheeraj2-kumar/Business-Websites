
let bagItemObjects1;
onLoad2();

function onLoad2() {
  loadwishItemObjects();
  displaywishItems();
  displaywishSummary();
}

function displaywishSummary() {
  let bagSummaryElement = document.querySelector('.bag-summary');
  let totalItem = bagItemObjects1.length;
  
}

function loadwishItemObjects() {
  console.log(wishlistItems);
  bagItemObjects1 = wishlistItems.map(itemId => {
    for (let i = 0; i < items.length; i++) {
      if (itemId == items[i].id) {
        return items[i];
      }
    }
  });
  console.log(bagItemObjects1);
}

function displaywishItems() {
  let containerElement = document.querySelector('.bag-items-container');
  let innerHTML = '';
  bagItemObjects1.forEach(wishItem => {
    innerHTML += generateItemHTML(wishItem);
  });
  containerElement.innerHTML = innerHTML;
}

function removeFromBag(itemId) {
  wishlistItems = wishlistItems.filter(wishItemId => wishItemId != itemId);
  
  localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
  loadwishItemObjects();
  displaywishIcon();
  displaywishItems();
  displaywishSummary();
}
function generateItemHTML(item) {
  return `<div class="bag-item-container">
    <div class="item-left-part">
      <img class="bag-item-img" src="../${item.image}">
    </div>
    <div class="item-right-part">
      <div class="company">${item.company}</div>
      <div class="item-name">${item.item_name}</div>
      <div class="price-container">
        <span class="current-price">Rs ${item.current_price}</span>
        <span class="original-price">Rs ${item.original_price}</span>
        <span class="discount-percentage">(${item.discount_percentage}% OFF)</span>
      </div>
      <div class="return-period">
        <span class="return-period-days">${item.return_period} days</span> return available
      </div>
      <div class="delivery-details">
        Delivery by
        <span class="delivery-details-days">${item.delivery_date}</span>
      </div>
    </div>
    <div class="remove-from-cart" onclick="removeFromBag(${item.id})">X</div>
  </div>`;
}