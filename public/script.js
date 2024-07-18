document.addEventListener('DOMContentLoaded', () => {
    // Define the variables
    const apiUrl = 'http://localhost:3000/api/data';
    const dataTable = document.querySelector('#data-table tbody');
    const popup = document.querySelector('#popup');
    const closePopup = document.querySelector('#close-popup');
    const addBtn = document.querySelector('#add-btn');
    const recordForm = document.querySelector('#record-form');
    const recordIdInput = document.querySelector('#record-id');
    const nameInput = document.querySelector('#name');

    // Fetch data from the server
    const fetchData = async () => {
        const response = await fetch(apiUrl);
        const data = await response.json();
        renderTable(data);
    }; 

    // Render the table with the data
    const renderTable = (data) => {
        dataTable.innerHTML = '';
        data.forEach(record => {
            const row = document.createElement('tr'); // Create a new row
            // Populate the row with the record data
            row.innerHTML = `
                <td>${record.id}</td>
                <td>${record.name}</td>
                <td>
                    <button class="edit-btn" data-id="${record.id}">Update</button>
                    <button class="delete-btn" data-id="${record.id}">Delete</button>
                </td>
            `;
            dataTable.appendChild(row); // Append the row to the table
        });

        // Add event listeners to the edit and delete buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', openEditPopup); 
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', deleteRecord);
        });
    };

    const openAddPopup = () => {
        recordForm.reset();
        recordIdInput.value = '';
        popup.classList.remove('hidden');
    };

    const openEditPopup = (e) => {
        const id = e.target.dataset.id; // Get the id of the record
        const record = Array.from(dataTable.children).find(row => row.children[0].textContent === id); // Find the record in the table
        // If the record exists, populate the form and show the popup window
        if (record) {
            recordIdInput.value = id;
            nameInput.value = record.children[1].textContent; // Populate the form with the record data
            popup.classList.remove('hidden');
        }
    };

    const closePopupWindow = () => {
        // Reset the form and hide the popup window
        popup.classList.add('hidden');
    };

    // Save the record to the server
    const saveRecord = async (e) => {
        e.preventDefault();
        const id = recordIdInput.value;
        const name = nameInput.value;
        const method = id ? 'PUT' : 'POST'; // If id exists, update the record, otherwise create a new one
        const url = id ? `${apiUrl}/${id}` : apiUrl; // If id exists, update the record, otherwise create a new one
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name })
        });

        // If the response is successful, fetch the data from the server and close the popup window
        if (response.ok) {
            fetchData();
            closePopupWindow();
        }
    };

    // Delete the record from the server
    const deleteRecord = async (e) => {
        const id = e.target.dataset.id;
        const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' }); // Send a DELETE request to the server

        // If the response is successful, fetch the data from the server
        if (response.ok) {
            fetchData();
        }
    };

    // Add event listeners to the add button and the popup close button
    addBtn.addEventListener('click', openAddPopup);
    closePopup.addEventListener('click', closePopupWindow);
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            closePopupWindow();
        }
    });

    // Add event listener to the escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closePopupWindow();
        }
    });

    // Add event listener to the form submit event
    recordForm.addEventListener('submit', saveRecord);

    fetchData();
});
