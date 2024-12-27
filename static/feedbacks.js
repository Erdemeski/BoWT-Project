
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
             <td>${feedback.ContactID}</td>
              <td>${feedback.UserID}</td>
              <td>${feedback.MessageSubject}</td>
              <td>${feedback.UserMessage}</td>
              <td>${feedback.EmployeeID}</td>
            `;
                    feedbacksTableBody.appendChild(row);
                });
            });
    }

    loadFeedBacks();
});