
document.addEventListener('DOMContentLoaded', function () {

    const feedbacksTableBody = document.querySelector('#feedbacksTable tbody');



    function loadFeedBacks() {
        fetch('/feedbacks')
            .then(response => response.json())
            .then(feedbacks => {
                feedbacksTableBody.innerHTML = '';
                feedbacks.forEach(feedback => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
             <td>${feedback.ContactId}</td>
              <td>${feedback.UserId}</td>
            <td>${feedback.UserName}</td>
              <td>${feedback.MessageSubject}</td>
              <td>${feedback.UserMessage}</td>
              <td>${feedback.EmployeeId}</td>
            `;
                    feedbacksTableBody.appendChild(row);
                });
            });
    }

    loadFeedBacks();
});

document.querySelector('.assign').addEventListener('click', () => {
    fetch('/assignEmployees', {
        method: 'POST'
    })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert(`Employees successfully assigned to ${result.affectedRows} feedbacks.`);
                alert(`Please refresh the page to see the IDs of assigned responsible employees.`);
            } else {
                alert('Failed to assign employees. Please try again.');
            }
        })
        .catch(err => {
            console.error(err);
            alert('An error occurred while assigning employees.');
        });
});
