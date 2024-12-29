
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