
let bookList = [],
  basketList = [];


const toggleModal = () => {
  const basketModalEl = document.querySelector(".basket_modal");
  basketModalEl.classList.toggle("active");
};


/* const getBooks = () => {
  fetch("products.json")
    .then((res) => res.json())
    .then((books) => (bookList = books));
};

getBooks();
 */


const getBooks = () => {
  fetch("/books") // Backend API endpoint
    .then((res) => res.json())

    .then((books) => {
      bookList = books.map(book => ({
        id: book.id,
        name: book.name,
        author: book.author,
        description: book.description,
        type: book.type,
        starRate: book.starRate,
        reviewCount: book.reviewCount,
        stock: book.stock,
        price: book.price,
        oldPrice: book.oldPrice,
        imgSource: book.imgSource,
      }))
      console.log(bookList);
      createBookItemsHtml(); // Kitap listesini oluştur
    })
    /*     .then((books) => {
            bookList = books;
            createBookItemsHtml(); // Veriler çekildikten sonra kitapları oluştur
          })
     */
    .catch((err) => console.error("Error fetching books:", err));
};
getBooks();



/* const getBooks = () => {
  fetch("/boooks")
    .then((res) => res.json())
    .then((books) => {
      bookList = books.map(book => ({
        id: book.Barcode,
        name: book.BName,
        author: book.Author,
        description: book.BDescription,
        type: book.BType,
        starRate: book.StarRate,
        reviewCount: book.ReviewCount,
        stock: book.Stock,
        price: book.Price,
        oldPrice: book.OldPrice,
        imgSource: book.ImgSource,
      }));
      createBookItemsHtml(); // Kitap listesini oluştur
    })
    .catch((error) => console.error("Error fetching books:", error));
};
getBooks();
 */


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




/*
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
 */


const BOOK_TYPES = {
  ALL: "ALL BOOKS",
  NOVEL: "Novel",
  SCIENCE: "Science",
  JUVENILE: "Juvenile",
  SELFIMPROVEMENT: "Self Development",
  HISTORY: "History"
};


const createBookTypesHtml = () => {
  fetch("/books/types") // Türleri backend'den çek
    .then((res) => res.json())
    .then((filterTypes) => {
      const filterElement = document.querySelector(".filter");
      let filterHtml = "";

      // Tüm kitapları göstermek için "ALL" seçeneğini ekle
      filterHtml += `<li class="active" onclick="filterBooks(this)" data-type="ALL">ALL BOOKS</li>`;

      filterTypes.forEach((type) => {
        filterHtml += `<li onclick="filterBooks(this)" data-type="${type}">
          ${BOOK_TYPES[type] || type}
        </li>`;
      });

      filterElement.innerHTML = filterHtml; // HTML'i güncelle
    })
    .catch((err) => console.error("Error fetching book types:", err));
};


/* // Kitap türlerini oluşturma
const createBookTypesHtml = () => {
  const filterElement = document.querySelector(".filter");
  let filterHtml = "";

  // Tüm türleri bir diziye ekle
  let filterTypes = ["ALL"];
  bookList.forEach((book) => {
    if (!filterTypes.includes(book.type)) {
      filterTypes.push(book.type); // Eğer tür listede yoksa ekle
    }
  });

  // Türleri liste öğesi olarak ekle
  filterTypes.forEach((type, index) => {
    filterHtml += `<li class="${index === 0 ? "active" : ""}" onclick="filterBooks(this)" data-type="${type}">
      ${BOOK_TYPES[type] || type}
    </li>`;
  });

  filterElement.innerHTML = filterHtml; // HTML'i güncelle
};
 */
/* // Kitapları filtreleme
const filterBooks = (filterElement) => {
  // Aktif filtre öğesini güncelle
  document.querySelector(".filter .active").classList.remove("active");
  filterElement.classList.add("active");

  const bookType = filterElement.dataset.type;

  // Filtreye göre kitapları yeniden yükle
  if (bookType === "ALL") {
    createBookItemsHtml(); // Tüm kitapları göster
  } else {
    const filteredBooks = bookList.filter((book) => book.type === bookType);
    createFilteredBookItemsHtml(filteredBooks);
  }
};
 */

const filterBooks = (filterElement) => {
  // Aktif filtre öğesini güncelle
  document.querySelector(".filter .active").classList.remove("active");
  filterElement.classList.add("active");

  const bookType = filterElement.dataset.type;

  // Backend'den filtrelenmiş kitapları getir
  fetch(`/books?type=${bookType}`)
    .then((res) => res.json())
    .then((filteredBooks) => {
      bookList = filteredBooks; // Gelen veriyi güncelle
      createBookItemsHtml(); // Yeni listeyi oluştur
    })
    .catch((err) => console.error("Error filtering books:", err));
};


// Filtrelenmiş kitapları oluşturma (createBookItemsHtml'den bağımsız)
const createFilteredBookItemsHtml = (filteredBooks) => {
  const bookListElement = document.querySelector(".book_list");
  let bookListHtml = "";

  filteredBooks.forEach((book, index) => {
    bookListHtml += `<div class="col-5 ${index % 2 === 0 ? "offset-2" : ""} my-5">
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

  bookListElement.innerHTML = bookListHtml; // HTML'i güncelle
};

// Kitapları getirdikten sonra türleri oluştur
getBooks();
createBookTypesHtml();



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
  console.log(basketList);
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



// Sepeti veritabanına kaydetme fonksiyonu
const checkout = async () => {
  try {
    // Kullanıcı bilgilerini al
    const userResponse = await fetch('/getCurrentUserId');
    if (!userResponse.ok) {
      alert('An error occurred while fetching user data. Please try again.');
      return;
    }
    const userData = await userResponse.json();
    const UserId = userData.UserId;
    const UserName = userData.UserName;

    // DiscountCheck kontrolü
    const subscriptionResponse = await fetch(`/checkSubscription/${UserId}`);
    if (!subscriptionResponse.ok) {
      alert('An error occurred while checking subscription status. Please try again.');
      return;
    }
    const isSubscribed = await subscriptionResponse.json();
    const DiscountCheck = !isSubscribed; // Abone değilse indirim aktif

    // Sipariş tarihini al
    const OrderDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // Sepetteki her bir ürün için siparişi gönder
    for (const item of basketList) {
      const orderData = {
        Barcode: item.product.id,
        BName: item.product.name,
        UserId,
        UserName,
        OrderDate,
        DiscountCheck,
        OrderQuantity: item.quantity,
        TotalAmount: item.product.price * item.quantity
      };

      const orderResponse = await fetch('/addOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (!orderResponse.ok) {
        alert('An error occurred while placing your order. Please try again.');
        return;
      }
    }

    // Sipariş başarıyla tamamlandığında kullanıcıya bilgi ver
    alert('Your order has been successfully placed!');
    basketList = []; // Sepeti temizle
    listBasketItems(); // Sepet listesini güncelle
  } catch (error) {
    console.error('Checkout error:', error);
    alert('An error occurred while placing your order. Please try again.');
  }
};

// Checkout butonuna tıklama olayını bağla
document.querySelector('.btn_book').addEventListener('click', async (e) => {
  e.preventDefault(); // Formun sayfayı yenilemesini engelle
  if (basketList.length > 0) {
    await checkout();
  } else {
    alert('Your basket is empty.');
  }
});




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
    duration = 1 * duration;
    membershipFee = price * duration * (1 + (bonusPercentage / 100));
  } else if (package === 'monthly') {
    duration = 30 * duration;
    membershipFee = price * duration * 30 * (1 + (bonusPercentage / 100));
  } else if (package === 'yearly') {
    duration = 365 * duration;
    membershipFee = price * duration * 365 * (1 + (bonusPercentage / 100));
  }

  var resultElement = document.getElementById('result');
  resultElement.innerHTML = 'You paid this fee and started a subscription: ' + membershipFee.toFixed(2) + '€';

  fetch('/getCurrentUserId') // This endpoint should return the UserId of the current user
    .then(response => response.json())
    .then(data => {
      const subId = data.UserId;
      const subName = data.UserName;
      const discountRate = bonusPercentage;
      const subPeriod = duration;

      console.log(data.UserId);
      console.log(data.UserName);
      console.log(duration);
      console.log(bonusPercentage);

      if (!subId) {
        console.log('User not found. Please log in again.');
        return;
      }

      // Submit form data via POST request
      fetch('/postSubscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          SubId: subId,
          SubName: subName,
          DiscountRate: discountRate,
          SubPeriod: subPeriod,
        })
      })
        .then(response => {
          if (response.ok) {
            alert('You has subscribed successfully.');
            document.getElementById('membershipForm').reset();
          } else {
            console.log('Failed to subscription. Please try again later.');
            alert('Failed to subscription. You may already have a subscription or please try again.');
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    })
    .catch(error => {
      console.error('Error fetching user ID:', error);
    });


}



function validateForm() {
  var MessageSubject = document.getElementById('MessageSubject').value.trim();
  var UserMessage = document.getElementById('UserMessage').value.trim();
  var errorMessages = [];

  if (MessageSubject === '') {
    errorMessages.push('Please choose a subject.');
  }

  if (UserMessage === '') {
    errorMessages.push('Please enter your message.');
  }

  if (errorMessages.length > 0) {
    displayErrors(errorMessages);
  } else {
    document.getElementById('contactForm').submit();
  }

  fetch('/getCurrentUserId') // This endpoint should return the UserId of the current user
    .then(response => response.json())
    .then(data => {
      const userId = data.UserId;
      const userName = data.UserName;
      const employeeId = null;

      console.log(data.UserId);

      if (!userId) {
        console.log('User not found. Please log in again.');
        return;
      }

      // Submit form data via POST request
      fetch('/submitContact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          UserId: userId,
          UserName: userName,
          UserMessage: UserMessage,
          EmployeeId: employeeId,
          MessageSubject: MessageSubject
        })
      })
        .then(response => {
          if (response.ok) {
            alert('Your message has been submitted successfully.');
            document.getElementById('contactForm').reset();
          } else {
            console.log('Failed to submit your message. Please try again later.');
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    })
    .catch(error => {
      console.error('Error fetching user ID:', error);
    });
}

/* function isValidEmail(email) {
  var emailRegex = /\S+@\S+\.\S+/;
  return emailRegex.test(email);
}
 */
function displayErrors(errors) {
  var errorMessagesElement = document.getElementById('errorMessages');
  errorMessagesElement.innerHTML = '';

  errors.forEach(function (error) {
    var errorMessageElement = document.createElement('p');
    errorMessageElement.textContent = error;
    errorMessagesElement.appendChild(errorMessageElement);
  });
}


/* document.addEventListener('DOMContentLoaded', function () {
  // Product loading
  fetch('/boooks') // Backend API'den ürünleri al
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
                  <td>${product.price}€</td>
                  <td>${product.stock}</td>
              `;
        productList.appendChild(row);
      });
    })
    .catch(error => console.error('Error fetching products:', error));


});
 */


/* document.addEventListener('DOMContentLoaded', function () {
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
 */

/* 
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
 */



setTimeout(() => {
  createBookItemsHtml();
  createBookTypesHtml();
}, 180);
