/* document.addEventListener('DOMContentLoaded', function () {
    const booksTableBody = document.querySelector('#booksTable tbody');
    const addBookForm = document.getElementById('addBookForm');
  
    // Kitapları yükle ve tabloya ekle
    function loadBooks() {
      fetch('/books')
        .then(response => response.json())
        .then(books => {
          booksTableBody.innerHTML = '';
          books.forEach(book => {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${book.id}</td>
              <td>${book.title}</td>
              <td>${book.author}</td>
              <td>${book.year}</td>
            `;
            booksTableBody.appendChild(row);
          });
        });
    }
  
    // Yeni kitap ekle
    addBookForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const formData = new FormData(addBookForm);
      const newBook = {
        title: formData.get('title'),
        author: formData.get('author'),
        year: parseInt(formData.get('year'))
      };
  
      fetch('/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newBook)
      })
        .then(response => response.json())
        .then(book => {
          loadBooks();
          addBookForm.reset();
        });
    });
  
    loadBooks();
  });
   */


  document.addEventListener('DOMContentLoaded', function () {
    const booksTableBody = document.querySelector('#booksTable tbody');
    const addBookForm = document.getElementById('addBookForm');
  
    // Kitapları yükle ve tabloya ekle
    function loadBooks() {
      fetch('/books')
        .then(response => response.json())
        .then(books => {
          booksTableBody.innerHTML = '';
          books.forEach(book => {
            const row = document.createElement('tr');
            row.innerHTML = `
             <td>${book.id}</td>
              <td>${book.name}</td>
              <td>${book.author}</td>
              <td>${book.price}</td>
              <td>${book.oldPrice}</td>
              <td>${book.description}</td>
              <td>${book.starRate}</td>
              <td>${book.reviewCount}</td>
              <td>${book.stock}</td>
              <td><img src="${book.imgSource}" alt="${book.name}" width="50"></td>
              <td>${book.type}</td>
            `; 
            booksTableBody.appendChild(row);
          });
        });
    }
  
    // Yeni kitap ekle
    addBookForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const formData = new FormData(addBookForm);
      const newBook = {
        name: formData.get('name'),
        author: formData.get('author'),
        price: parseFloat(formData.get('price')),
        oldPrice: parseFloat(formData.get('oldPrice')),
        description: formData.get('description'),
        starRate: parseFloat(formData.get('starRate')),
        reviewCount: parseInt(formData.get('reviewCount')),
        stock: parseInt(formData.get('stock')),
        imgSource: formData.get('imgSource'),
        type: formData.get('type')
      };
  
      fetch('/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newBook)
      })
        .then(response => response.json())
        .then(book => {
          loadBooks();
          addBookForm.reset();
        });
    });
  
    loadBooks();
  });
  