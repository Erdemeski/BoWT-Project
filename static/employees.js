
document.addEventListener('DOMContentLoaded', function () {

    const employeesTableBody = document.querySelector('#employeesTable tbody');

    function loadEmployees() {
        fetch('/employers')
            .then(response => response.json())
            .then(employers => {
                employeesTableBody.innerHTML = '';
                employers.forEach(employer => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
             <td>${employer.Employer_Id}</td>
              <td>${employer.Employer_Name}</td>
              <td>${employer.Employer_Field}</td>
            `;
                    employeesTableBody.appendChild(row);
                });
            });
    }

    loadEmployees();
});