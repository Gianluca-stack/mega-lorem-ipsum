document.addEventListener('DOMContentLoaded', () => {
    // Define the IP address of the server (replace with your IP address)
    const ip_address = "192.168.4.130";
    // Define the variables
    const apiUrl = `http://${ip_address}:8000/api/data`;
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
        console.log('Data:', data);
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
                    <div class="actions">
                        <button class="edit-btn" data-id="${record.id}">Update</button>
                        <button class="delete-btn" data-id="${record.id}">Delete</button>
                    </div>
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
        updateURL();
    };

    const openEditPopup = (e) => {
        console.log("openEditPopup", e.target);
        const id = e.target.dataset.id;
    
        if (id) {
            console.log("Data to be updated with id:", id);
            // Fetch the record from the server
            fetch(`http://${ip_address}:8000/api/data/${id}`, {
                method: 'GET'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json(); // Parse the response as JSON
            })
            .then(record => { // Log the response
                console.log('Data to be updated:', record);
                recordIdInput.value = record.id;
                nameInput.value = record.name;
                popup.classList.remove('hidden');
                updateURL(record.id);
            })
            .catch(error => console.error('Error:', error));
    
            // Update the record in the table
            const record = Array.from(dataTable.children).find(row => row.children[0].textContent === id);
            console.log('Record to be updated:', record);
            if (record) {
                recordIdInput.value = record.children[0].textContent;
                nameInput.value = record.children[1].textContent;
            }
        } else {
            console.error('ID is undefined');
        }
    };

    const closePopupWindow = () => {
        // Reset the form and hide the popup window
        popup.classList.add('hidden');
        clearURL();
    };

    // Save the record to the server
    const saveRecord = async (e) => {
        console.log("saveRecord");
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

    function deleteRecord(e) {
        const id = e.target.dataset.id;
        if (id) {
            console.log('Data to be deleted with id:', id);
            // delete the record from the server
            fetch(`http://${ip_address}:8000/api/data/${id}`, {
                method: 'DELETE'
            })
            .then(response => response.json()) // Parse the response as JSON
            .then(data => { // Log the response
                console.log('Data Deletion Complete');
                console.log(data);
            })
            .catch(error => console.error('Error:', error));

            // delete the record from the table
            const record = Array.from(dataTable.children).find(row => row.children[0].textContent === id);
            console.log('Record to be deleted:', record);
            if (record) {
                dataTable.removeChild(record);
            }
        } else {
            console.error('ID is undefined');
        }
    }

    // Add event listeners to the add button and the popup close button
    addBtn.addEventListener('click', openAddPopup);
    closePopup.addEventListener('click', closePopupWindow);
    // closepopup on touchingn the close button
    closePopup.addEventListener('touchend', closePopupWindow);
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

    // event listener for touching device screen to close popup
    document.addEventListener('touchend', (e) => {
        if (e.target === popup) {
            closePopupWindow();
        }
    });

    // Handle URL state management
    const updateURL = (id = '') => {
        const newUrl = id ? `${window.location.pathname}?recordId=${id}` : window.location.pathname; // Update the URL with the record ID
        history.pushState({ recordId: id }, '', newUrl); // Update the URL without refreshing the page
    };

    const clearURL = () => {
        history.pushState({}, '', window.location.pathname); // Clear the URL without refreshing the page
    };

    // Restore state based on URL when the page loads
    const checkURL = () => {
        const urlParams = new URLSearchParams(window.location.search); // Get the URL parameters
        const recordId = urlParams.get('recordId'); // Get the record ID from the URL parameters
        // If the record ID exists, open the edit popup window
        if (recordId) {
            openEditPopup({ target: { dataset: { id: recordId } } }); 
        }
    };

    // Add event listener to the popstate event
    window.onpopstate = function(event) {

        // If the state exists and the record ID is defined, open the edit popup window
        if (event.state && event.state.recordId) {
            openEditPopup({ target: { dataset: { id: event.state.recordId } } }); 
        } else {
            closePopupWindow();
        }
    };

    // Add event listener to the form submit event
    recordForm.addEventListener('submit', saveRecord);

    checkURL();

    fetchData();
});
