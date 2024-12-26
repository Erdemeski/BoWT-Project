document.addEventListener('DOMContentLoaded', function () {
  const booksTableBody = document.querySelector('#booksTable tbody');
  const addBookForm = document.getElementById('addBookForm');

  function loadBooks() {
    fetch('/boooks')
      .then(response => response.json())
      .then(books => {
        booksTableBody.innerHTML = '';
        books.forEach(book => {
          const row = document.createElement('tr');
          row.innerHTML = `
             <td>${book.Barcode}</td>
              <td>${book.BName}</td>
              <td>${book.Author}</td>
              <td>${book.Price}</td>
              <td>${book.OldPrice}</td>
              <td>${book.BDescription}</td>
              <td>${book.StarRate}</td>
              <td>${book.ReviewCount}</td>
              <td>${book.Stock}</td>
              <td><img src="${book.ImgSource}" alt="${book.BName}" width="50"></td>
              <td>${book.BType}</td>
            `;
          booksTableBody.appendChild(row);
        });
      });
  }

  addBookForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(addBookForm);
    const newBook = {
      Barcode: formData.get('Barcode'),
      BName: formData.get('BName'),
      Author: formData.get('Author'),
      Price: parseFloat(formData.get('Price')),
      OldPrice: parseFloat(formData.get('OldPrice')) || null,
      BDescription: formData.get('BDescription'),
      StarRate: parseFloat(formData.get('StarRate')),
      ReviewCount: parseInt(formData.get('ReviewCount')),
      Stock: parseInt(formData.get('Stock')),
      ImgSource: formData.get('ImgSource'),
      BType: formData.get('BType'),
    };

    fetch('/addBook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBook),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to add book');
        }
        return response.json();
      })
      .then(() => {
        loadBooks();
        addBookForm.reset();
      })
      .catch((error) => {
        console.error(error);
        alert('Error adding book');
      });
  });

  loadBooks();
});