
document.addEventListener('DOMContentLoaded', function () {

    const ordersTableBody = document.querySelector('#ordersTable tbody');

    function loadOrders() {
        fetch('/orders')
            .then(response => response.json())
            .then(orders => {
                ordersTableBody.innerHTML = '';
                orders.forEach(order => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
             <td>${order.Barcode}</td>
              <td>${order.BName}</td>
              <td>${order.UserId}</td>
              <td>${order.UserName}</td>
              <td>${order.OrderId}</td>
              <td>${order.OrderDate}</td>
              <td>${order.DiscountCheck.data}</td>
              <td>${order.OrderQuantity}</td>
              <td>${order.TotalAmount}</td>
            `;
                    ordersTableBody.appendChild(row);
                });
            });
    }

    loadOrders();
});