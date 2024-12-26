
document.addEventListener('DOMContentLoaded', function () {

    const subsTableBody = document.querySelector('#subsTable tbody');



    function loadSubs() {
        fetch('/subs')
            .then(response => response.json())
            .then(subs => {
                subsTableBody.innerHTML = '';
                subs.forEach(sub => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
             <td>${sub.Subscriber_Id}</td>
              <td>${sub.Name_Of_The_Subscriber}</td>
              <td>${sub.Email_Of_The_Subscriber}</td>
              <td>${sub.Discount_Rate}</td>
              <td>${sub.Subscribtion_Period}</td>
            `;
                    subsTableBody.appendChild(row);
                });
            });
    }

    loadSubs();
});