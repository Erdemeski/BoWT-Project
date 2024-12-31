document.addEventListener('DOMContentLoaded', function () {
    const ordersTableBody = document.querySelector('#ordersTable tbody');

    function loadOrders() {
        fetch('/getCurrentUserId')
            .then(response => response.json())
            .then(data => {
                const UserId = data.UserId;

                if (!UserId) {
                    console.log('User not found. Please log in again.');
                    return;
                }

                fetch(`/yourOrders/${UserId}`)
                    .then(response => response.json())
                    .then(orders => {
                        ordersTableBody.innerHTML = ''; // Tablonun içeriğini temizle

                        if (orders.length === 0) {
                            // Eğer sipariş yoksa mesaj göster
                            const row = document.createElement('tr');
                            const cell = document.createElement('td');
                            cell.colSpan = 7; // Tablonuzun sütun sayısına eşit olmalı
                            cell.textContent = 'You do not have any order!';
                            cell.style.textAlign = 'center'; // Metni ortalamak için
                            row.appendChild(cell);
                            ordersTableBody.appendChild(row);
                        } else {
                            // Sipariş varsa tabloyu doldur
                            orders.forEach(order => {
                                const row = document.createElement('tr');
                                const discountData = order.DiscountCheck.data[0]; // Buffer'daki ilk eleman
                                const discountCellContent = discountData === 1
                                    ? '<span style="color: green;">✔</span>' // Yeşil tik işareti
                                    : '<span style="color: red;">✖</span>'; // Kırmızı çarpı işareti
                                row.innerHTML = `
                                    <td>${order.OrderId}</td>
                                    <td>${order.OrderDate}</td>
                                    <td>${order.Barcode}</td>
                                    <td>${order.BName}</td>
                                    <td>${discountCellContent}</td>
                                    <td>${order.OrderQuantity}</td>
                                    <td>${order.TotalAmount}€</td>
                                `;
                                ordersTableBody.appendChild(row);
                            });
                        }
                    })
                    .catch(error => console.log('Error fetching orders:', error));
            })
            .catch(error => console.log('Error fetching current user:', error));
    }

    loadOrders();
});
