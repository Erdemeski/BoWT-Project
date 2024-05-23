
let bookList = [],
  basketList = [];


const toggleModal = () => {
  const basketModalEl = document.querySelector(".basket_modal");
  basketModalEl.classList.toggle("active");
};

function updateDateTime() {
  var now = new Date();
  var dateTimeElement = document.getElementById('datetime');
  dateTimeElement.innerHTML = 'Current Date and Time: ' + now.toLocaleString();
}

setInterval(updateDateTime, 1000);
updateDateTime();


/* var happyHourEnd = '17:52:40';

function updateCountdown() {
  var now = new Date();
  var happyHourEndTime = new Date(now.toDateString() + ' ' + happyHourEnd);

  var timeDiff = happyHourEndTime - now;
  var hours = Math.floor(timeDiff / (1000 * 60 * 60));
  var minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  var countdownElement = document.getElementById('countdown');
  countdownElement.innerHTML = 'Time Remaining until Happy Hour: ' + hours + ' hours, ' + minutes + ' minutes, ' + seconds + ' seconds';
}

setInterval(updateCountdown, 1000);
updateCountdown(); */

// Belirli bir tarih ve saat (yıl, ay, gün, saat, dakika, saniye)
var happyHourEnd = new Date('2024-05-29T23:59:59');

function updateCountdown() {
  var now = new Date();
  var timeDiff = happyHourEnd - now;

  // Eğer hedef tarih geçmişse geri sayımı durdur
  if (timeDiff < 0) {
    clearInterval(intervalId);
    document.getElementById('countdown').innerHTML = 'Time Remaining until Happy Hour:<br>Happy hour ended!';
    return;
  }

  var days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  var hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  // Geri sayımı güncelle
  document.getElementById('countdown').innerHTML = 'Time Remaining until Happy Hour:<br>' + days + ' day(s), ' + hours + ' hour(s), ' + minutes + ' min(s), ' + seconds + ' second(s)';
}

// Her saniyede bir geri sayımı güncelle
var intervalId = setInterval(updateCountdown, 1000);

// İlk güncelleme
updateCountdown();

//------------------------------------------------------------------

/* const getBooks = async () => {
  try {
    const response = await fetch("/products");
    const books = await response.json();
    bookList = books;
    createBookItemsHtml(); // Ürünleri gösterme işlevselliğini çağır
  } catch (error) {
    console.error('Error fetching books:', error);
  }
};

getBooks();

const createBookStars = (starRate) => {
  let starRateHtml = "";
  for (let i = 1; i <= 5; i++) {
    if (Math.round(starRate) >= i) starRateHtml += `<i class="bi bi-star-fill active"></i>`;
    else starRateHtml += `<i class="bi bi-star-fill"></i>`;
  }
  return starRateHtml;
};

const createBookItemsHtml = () => {
  const bookListElement = document.querySelector(".book_list");
  let bookListHtml = "";
  bookList.forEach((book, index) => {
    bookListHtml += `<div class="col-5 ${index % 2 == 0 && "offset-2"} my-5">
        <div class="row book_card">
          <div class="col-6">
            <img class="img-fluid shadow" src="${book.imgSource}" width="258" height="400">
          </div>
          <div class="col-6 d-flex flex-column justify-content-between">
            <div class="book_detail">
              <span class="fos gray fs-5">${book.author}</span><br>
              <span class="fs-4 fw-bold">${book.name}</span><br>
              <span class="book_star-rate">
                ${createBookStars(book.starRate)}
                <span class="gray">${book.reviewCount} reviews</span>
              </span>
            </div>
            <p class="book_description gray fos">
            ${book.description}
            </p>
            <div>
              <span class="black fw-bold fs-4 me-2">${book.price}€</span>
              ${book.oldPrice ? `<span class="gray fs-4 fw-bold old_price">${book.oldPrice}€</span>` : ""}
            </div>
            <button class="btn_book" onclick="addBookToBasket(${book.id})">ADD BASKET</button>
          </div>
        </div>
      </div>`;
  });

  bookListElement.innerHTML = bookListHtml;
};
 */

//-------------------------------------------------------------------------

const getBooks = () => {
  fetch("products.json")
    .then((res) => res.json())
    .then((books) => (bookList = books));
};

getBooks();

const createBookStars = (starRate) => {
  let starRateHtml = "";
  for (let i = 1; i <= 5; i++) {
    if (Math.round(starRate) >= i) starRateHtml += `<i class="bi bi-star-fill active"></i>`;
    else starRateHtml += `<i class="bi bi-star-fill"></i>`;
  }
  return starRateHtml;
};

const createBookItemsHtml = () => {
  const bookListElement = document.querySelector(".book_list");
  let bookListHtml = "";
  bookList.forEach((book, index) => {
    bookListHtml += `<div class="col-5 ${index % 2 == 0 && "offset-2"} my-5">
        <div class="row book_card">
          <div class="col-6">
            <img class="img-fluid shadow" src="${book.imgSource}" width="258" height="400">
          </div>
          <div class="col-6 d-flex flex-column justify-content-between">
            <div class="book_detail">
              <span class="fos gray fs-5">${book.author}</span><br>
              <span class="fs-4 fw-bold">${book.name}</span><br>
              <span class="book_star-rate">
                ${createBookStars(book.starRate)}
                <span class="gray">${book.reviewCount} reviews</span>
              </span>
            </div>
            <p class="book_description gray fos">
            ${book.description}
            </p>
            <div>
              <span class="black fw-bold fs-4 me-2">${book.price}€</span>
              ${book.oldPrice ? `<span class="gray fs-4 fw-bold old_price">${book.oldPrice}€</span>` : ""}
            </div>
            <button class="btn_book" onclick="addBookToBasket(${book.id})">ADD BASKET</button>
          </div>
        </div>
      </div>`;
  });

  bookListElement.innerHTML = bookListHtml;
};


//---------------------------------------------------------------

document.getElementById('scrollButton').addEventListener('click', function () {
  window.scrollBy({
    top: window.innerHeight * 0.9,
    behavior: 'smooth'
  });
});

const searchForm = document.querySelector(".search-form");
const searchBtn = document.querySelector("#menu_search_btn");
searchBtn.addEventListener("click", function () {
  searchForm.classList.toggle("active");
  document.addEventListener("click", function (e) {
    if (
      !e.composedPath().includes(searchBtn) &&
      !e.composedPath().includes(searchForm)
    ) {
      searchForm.classList.remove("active");
    }
  });
});

const accountForm = document.querySelector(".account-form");
const accountBtn = document.querySelector("#menu_account_btn");
accountBtn.addEventListener("click", function () {
  accountForm.classList.toggle("active");
  document.addEventListener("click", function (e) {
    if (
      !e.composedPath().includes(accountBtn) &&
      !e.composedPath().includes(accountForm)
    ) {
      accountForm.classList.remove("active");
    }
  });
});

const BOOK_TYPES = {
  ALL: "ALL BOOKS",
  NOVEL: "Novel",
  SCIENCE: "Science",
  JUVENILE: "Juvenile",
  SELFIMPROVEMENT: "Self Development",
  HISTORY: "History"
};

const createBookTypesHtml = () => {
  const filterElement = document.querySelector(".filter");
  let filterHtml = "";
  let filterTypes = ["ALL"];
  bookList.forEach((book) => {
    if (filterTypes.findIndex((filter) => filter == book.type) == -1)
      filterTypes.push(book.type);
  });

  filterTypes.forEach((type, index) => {
    filterHtml += `<li class="${index == 0 ? "active" : null}" onclick="filterBooks(this)" data-type="${type}">${BOOK_TYPES[type] || type
      }</li>`;
  });

  filterElement.innerHTML = filterHtml;

};

const filterBooks = (filterElement) => {
  document.querySelector(".filter .active").classList.remove("active");
  filterElement.classList.add("active");
  let bookType = filterElement.dataset.type;
  getBooks();
  if (bookType != "ALL")
    bookList = bookList.filter((book) => book.type == bookType);
  createBookItemsHtml();
};

const listBasketItems = () => {
  const basketListElement = document.querySelector(".basket_list");
  const basketCountElement = document.querySelector(".basket_counter");
  basketCountElement.innerHTML = basketList.length > 0 ? basketList.length : null;
  const totalPriceElement = document.querySelector(".total_price");

  let basketListHtml = "";
  let totalPrice = 0;
  basketList.forEach((item) => {
    totalPrice += item.product.price * item.quantity;
    basketListHtml += `<li class="basket_item">
    <img src="${item.product.imgSource}" width="80,625" height="125" />
    <div class="basket_item_info">
      <h3 class="basket_book_name">${item.product.name}</h3>
      <span class="basket_book_price">${item.product.price}€</span><br>
      <span class="basket_book_remove" onclick="removeItemFromBasket(${item.product.id})">remove</span>
    </div>
    <div class="book_count">
      <i class="bi bi-dash" onclick="decreaseItemFromBasket(${item.product.id})"></i>
      <span class="my">${item.quantity}</span>
      <i class="bi bi-plus" onclick="increaseItemFromBasket(${item.product.id})"></i>
    </div>
  </li>`;
  });
  basketListElement.innerHTML = basketListHtml ? basketListHtml : `<li class="basket_item">There is no item to buy.</li>`;
  totalPriceElement.innerHTML = totalPrice > 0 ? "Total: " + totalPrice.toFixed(2) + "€" : null;
};

const addBookToBasket = (bookId) => {
  let findedBook = bookList.find((book) => book.id == bookId);
  if (findedBook) {
    const basketAlreadyIndex = basketList.findIndex(
      (basket) => basket.product.id == bookId
    );
    if (basketAlreadyIndex == -1) {
      let addedItem = { quantity: 1, product: findedBook };
      basketList.push(addedItem);
    } else {
      basketList[basketAlreadyIndex].quantity += 1;
    }
    listBasketItems();
  }
};

const removeItemFromBasket = (bookId) => {
  const findedIndex = basketList.findIndex((basket) => basket.product.id == bookId);
  if (findedIndex != -1) {
    basketList.splice(findedIndex, 1);
  }
  listBasketItems();
}

const decreaseItemFromBasket = (bookId) => {
  const findedIndex = basketList.findIndex((basket) => basket.product.id == bookId);
  if (findedIndex != -1) {
    if (basketList[findedIndex].quantity != 1) {
      basketList[findedIndex].quantity -= 1;
    } else {
      removeItemFromBasket(bookId);
    }
    listBasketItems();
  }
}

const increaseItemFromBasket = (bookId) => {
  const findedIndex = basketList.findIndex((basket) => basket.product.id == bookId);
  if (findedIndex != -1) {
    if (basketList[findedIndex].quantity < basketList[findedIndex].product.stock) {
      basketList[findedIndex].quantity += 1;
    }
    listBasketItems();
  }
}

function calculateMembershipFee() {
  var package = document.getElementById('package').value;
  const duration_prices = {
    daily: 10,
    monthly: 8,
    yearly: 6
  };
  var duration = parseInt(document.getElementById('duration').value);
  var price = duration_prices[package];
  var bonusPercentage = parseFloat(document.getElementById('bonusPercentage').value);

  var membershipFee;
  if (package === 'daily') {
    membershipFee = price * duration * (1 + (bonusPercentage / 100));
  } else if (package === 'monthly') {
    membershipFee = price * duration * 30 * (1 + (bonusPercentage / 100));
  } else if (package === 'yearly') {
    membershipFee = price * duration * 365 * (1 + (bonusPercentage / 100));
  }

  var resultElement = document.getElementById('result');
  resultElement.innerHTML = 'Membership Fee: ' + membershipFee.toFixed(2) + '€';
}




function validateForm() {
  var name = document.getElementById('name').value.trim();
  var email = document.getElementById('email').value.trim();
  var message = document.getElementById('message').value.trim();
  var errorMessages = [];

  if (name.length < 3) {
    errorMessages.push('Please enter a name with at least 3 characters.');
  }

  if (message.length < 10) {
    errorMessages.push('Please enter a message with at least 10 characters.');
  }

  if (name === '') {
    errorMessages.push('Please enter your name.');
  }

  if (email === '') {
    errorMessages.push('Please enter your email address.');
  } else if (!isValidEmail(email)) {
    errorMessages.push('Please enter a valid email address.');
  }

  if (message === '') {
    errorMessages.push('Please enter your message.');
  }

  if (errorMessages.length > 0) {
    displayErrors(errorMessages);
  } else {
    document.getElementById('contactForm').submit();
  }
}

function isValidEmail(email) {
  var emailRegex = /\S+@\S+\.\S+/;
  return emailRegex.test(email);
}

function displayErrors(errors) {
  var errorMessagesElement = document.getElementById('errorMessages');
  errorMessagesElement.innerHTML = '';

  errors.forEach(function (error) {
    var errorMessageElement = document.createElement('p');
    errorMessageElement.textContent = error;
    errorMessagesElement.appendChild(errorMessageElement);
  });
}






document.addEventListener('DOMContentLoaded', function () {
  // Product loading
  fetch('books.json') // JSON dosyasını al
    .then(response => response.json()) // JSON'u parse et
    .then(data => {
      // Başarılı bir şekilde veri alındığında, ürünleri tabloya ekle
      const productList = document.getElementById('productList');
      data.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
                  <td>${product.id}</td>
                  <td>${product.name}</td>
                  <td>${product.author}</td>
                  <td>${product.price}</td>
                  <td>${product.stock}</td>
              `;
        productList.appendChild(row);
      });
    });

  // Product adding
  const addForm = document.getElementById('addForm');
  addForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Formun submit olmasını engelle
    const formData = new FormData(this); // Form verilerini al
    const newProduct = {}; // Yeni ürün objesi oluştur
    formData.forEach((value, key) => {
      newProduct[key] = value;
    });

    // Yeni ürünü sunucuya POST isteği ile gönder
    fetch('addProduct', {
      method: 'POST',
      body: JSON.stringify(newProduct),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        // Yeni ürün eklendikten sonra tabloya ekle
        const productList = document.getElementById('productList');
        const row = document.createElement('tr');
        row.innerHTML = `
              <td>${data.id}</td>
              <td>${data.name}</td>
              <td>${data.author}</td>
              <td>${data.price}</td>
              <td>${data.stock}</td>
          `;
        productList.appendChild(row);
        // Formu temizle
        addForm.reset();
      })
      .catch(error => console.error('Error:', error));
  });
});




setTimeout(() => {
  createBookItemsHtml();
  createBookTypesHtml();
}, 180);
