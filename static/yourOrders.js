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
                        ordersTableBody.innerHTML = '';
                        orders.forEach(order => {
                            const row = document.createElement('tr');
                            row.innerHTML = `
                                <td>${order.OrderId}</td>
                                <td>${order.OrderDate}</td>
                                <td>${order.Barcode}</td>
                                <td>${order.BName}</td>
                                <td>${order.DiscountCheck.data}</td>
                                <td>${order.OrderQuantity}</td>
                                <td>${order.TotalAmount}</td>
                            `;
                            ordersTableBody.appendChild(row);
                        });
                    })
                    .catch(error => console.log('Error fetching orders:', error));
            })
            .catch(error => console.log('Error fetching current user:', error));
    }

    loadOrders();
});
