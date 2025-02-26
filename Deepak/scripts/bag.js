const CONVENIENCE_FEES = 99;
let bagItemObjects;
 bagItems = JSON.parse(localStorage.getItem('bagItems')) || []; // Load from localStorage

onLoad();

function onLoad() {
    loadBagItemObjects();
    displayBagItems();
    displayBagSummary();
}
function loadBagItemObjects() {
    console.log('Loading bag items...');
    console.log('Bag Items in LocalStorage:', JSON.parse(localStorage.getItem("bagItems")));

    bagItemObjects = bagItems.map(itemId => {
        let item = items.find(i => String(i.id) === String(itemId)); // ✅ ID match fix
        
        if (item) {
            let copiedItem = { ...item };
            // Always reset to default quantity 1 when item is re-added
            let savedQuantity = 1; // Use default quantity
            localStorage.setItem(`quantity-${String(item.id)}`, savedQuantity); // ✅ Save default quantity

            copiedItem.quantity = savedQuantity;
            console.log(`Loaded quantity for item ${copiedItem.id}: ${copiedItem.quantity}`);
            return copiedItem;
        }
    }).filter(Boolean);
}

function displayBagSummary() {
    let bagSummaryElement = document.querySelector('.bag-summary');
    let totalItem = bagItemObjects.reduce((sum, item) => sum + item.quantity, 0);
    let totalMRP = 0;
    let totalDiscount = 0;

    bagItemObjects.forEach(bagItem => {
        totalMRP += bagItem.original_price * bagItem.quantity;
        totalDiscount += (bagItem.original_price - bagItem.current_price) * bagItem.quantity;
    });

    let finalPayment = totalMRP - totalDiscount + CONVENIENCE_FEES;

    bagSummaryElement.innerHTML = `
        <div class="bag-details-container">
            <div class="price-header">PRICE DETAILS (${totalItem} Items)</div>
            <div class="price-item">
                <span class="price-item-tag">Total MRP</span>
                <span class="price-item-value">₹${totalMRP}</span>
            </div>
            <div class="price-item">
                <span class="price-item-tag">Discount on MRP</span>
                <span class="price-item-value priceDetail-base-discount">-₹${totalDiscount}</span>
            </div>
            <div class="price-item">
                <span class="price-item-tag">Convenience Fee</span>
                <span class="price-item-value">₹99</span>
            </div>
            <hr>
            <div class="price-footer">
                <span class="price-item-tag">Total Amount</span>
                <span class="price-item-value">₹${finalPayment}</span>
            </div>
        </div>
        <button class="btn-place-order">
            <div class="css-xjhrni">PLACE ORDER</div>
        </button>
    `;
}
function displayBagItems() {
    let containerElement = document.querySelector('.bag-items-container');
    let innerHTML = '';
    bagItemObjects.forEach(bagItem => {
        innerHTML += generateItemHTML(bagItem);
    });
    containerElement.innerHTML = innerHTML;
}
function removeFromBag(itemId) {
    bagItems = bagItems.filter(bagItemId => bagItemId != itemId);
    localStorage.setItem('bagItems', JSON.stringify(bagItems));
    localStorage.removeItem(`quantity-${itemId}`);
    loadBagItemObjects();
    displayBagIcon();
    displayBagItems();
    displayBagSummary();
}
function generateItemHTML(item) {
    return `
        <div class="bag-item-container">
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
                <div class="quantity-selector">
                    <label for="number-select-${item.id}">QNT:</label>
                    <select id="number-select-${item.id}" onchange="updateQuantity(${item.id}, this.value)">
                        ${generateSelectOptions(item.quantity)}
                    </select>
                </div>
            </div>
            <div class="remove-from-cart" onclick="removeFromBag(${item.id})">X</div>
        </div>
    `;
}
function generateSelectOptions(selectedQuantity) {
    let options = '';
    for (let i = 1; i <= 10; i++) {
        let selected = i == selectedQuantity ? 'selected' : '';
        options += `<option value="${i}" ${selected}>${i}</option>`;
    }
    return options;
}
function updateQuantity(itemId, quantity) {
  let formattedId = String(itemId).padStart(3, '0');  // Ensure ID is in 3-digit format
  console.log(`🔄 Updating quantity for item ${formattedId} to ${quantity}`);

  let found = false;

  for (let i = 0; i < bagItemObjects.length; i++) {
      console.log(`🧐 Checking item ${bagItemObjects[i].id} in bagItemObjects`);

      if (String(bagItemObjects[i].id) === formattedId) {  // ✅ ID Format Fixed
          console.log(`✅ Match found! Updating item ${bagItemObjects[i].id}`);

          bagItemObjects[i].quantity = parseInt(quantity);
          localStorage.setItem(`quantity-${formattedId}`, quantity); // ✅ Save in Correct Format
          
          console.log(`💾 Saved quantity for item ${formattedId}: ${quantity}`);
          found = true;
          break;
      }
  }

  if (!found) {
      console.error(`❌ ERROR: Item ${formattedId} not found in bagItemObjects!`);
      console.log("🛠 Debugging bagItemObjects:", bagItemObjects);
  }

  displayBagSummary(); // ✅ Update summary
}




