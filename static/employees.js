
document.addEventListener('DOMContentLoaded', function () {

    const employeesTableBody = document.querySelector('#employeesTable tbody');
    const addEmployeeForm = document.getElementById('addEmployeeForm');

    function loadEmployees() {
        fetch('/employees')
            .then(response => response.json())
            .then(employees => {
                employeesTableBody.innerHTML = '';
                employees.forEach(employee => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
              <td>${employee.EmployeeId}</td>
              <td>${employee.EmployeeName}</td>
              <td>${employee.EmployeeField}</td>
            `;
                    employeesTableBody.appendChild(row);
                });
            });
    }
    addEmployeeForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(addEmployeeForm);
        const newEmployee = {
          EmployeeId: formData.get('EmployeeId'),
          EmployeeName: formData.get('EmployeeName'),
          EmployeeField: formData.get('EmployeeField'),
        };
    
        fetch('/addEmployee', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newEmployee),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Failed to add employee');
            }
            return response.json();
          })
          .then(() => {
            loadEmployees();
            addEmployeeForm.reset();
          })
          .catch((error) => {
            console.error(error);
            alert('Error adding employee');
          });
      });

    loadEmployees();
});