
document.addEventListener('DOMContentLoaded', function () {

    const ordersTableBody = document.querySelector('#ordersTable tbody');

    function loadOrders() {
        fetch('/orders')
            .then(response => response.json())
            .then(orders => {
                ordersTableBody.innerHTML = '';
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
              <td>${order.UserId}</td>
              <td>${order.UserName}</td>
              <td>${discountCellContent}</td>
              <td>${order.OrderQuantity}</td>
              <td>${order.TotalAmount}€</td>
            `;
                    ordersTableBody.appendChild(row);
                });
            });
    }

    loadOrders();
});