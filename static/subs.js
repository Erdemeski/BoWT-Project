
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
             <td>${sub.SubId}</td>
              <td>${sub.SubName}</td>
              <td>${sub.DiscountRate}</td>
              <td>${sub.SubPeriod}</td>
            `;
                    subsTableBody.appendChild(row);
                });
            });
    }

    loadSubs();
});