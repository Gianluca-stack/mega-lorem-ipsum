const express = require('express') // Import express
const bodyParser = require('body-parser'); // to parse incoming request bodies in a middleware before your handlers, available under the req.body property.
const path = require('path');
const cors = require('cors');  //to enable CORS with various options.

const {v4: uuidv4} = require('uuid'); //to generate unique id for each user

const app = express(); // Initialize express

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));
let data = []; // Array to store the data

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
    // url to access the index.html file
});

// Route to get all the data
// ----------------------------------------------
// Define route handler for GET requests to '/api/data'
app.get('/api/data', (req, res) => {
    res.json(data); // Send the data as json
});

// Route to get a specific record
app.get('/api/data/:id', (req, res) => {
    const { id } = req.params;
    console.log('GET request for ID:', id);
    const record = data.find(item => item.id === id);

    if (!record) {
        return res.status(404).send({ error: 'No record found' });
    }

    res.status(200).json(record);
});

// Route to add a new data
// ----------------------------------------------
// Define route handler for POST requests to '/api/data'

app.post('/api/data', (req, res) => {
    const record = {
        id: uuidv4(), // Generate a unique id
        ...req.body // Get the data from the request body
    };

    data.push(record); // Add the new data to the data array
    res.status(201).json(record); // Send the new data as json
});

// Route to update a data
// ----------------------------------------------
// Define route handler for PUT requests to '/api/data/:id'

// Route to update a record
app.put('/api/data/:id', (req, res) => {
    console.log('PUT request for ID:', req.params.id);
    const { id } = req.params;
    const { name } = req.body;

    if (!id) {
        return res.status(400).send({ error: 'ID is required' });
    }

    const record = data.find(item => item.id === id);
    if (!record) {
        return res.status(404).send({ error: 'No record found' });
    }

    record.name = name; // Update the name
    const current_data = new Date().toISOString().slice(0, 10);
    const current_time = new Date().toLocaleTimeString();
    record.updated_at =  current_data + " | " + current_time; // Update the updated_at field

    res.status(200).json(record); // Send the updated data as JSON
});

// Route to delete a data
// ----------------------------------------------

// Delete API
app.delete('/api/data/:id', (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).send({ error: 'ID is required' });
    }

    data = data.filter(item => item.id !== id);
    res.status(200).send({ message: 'Data deleted', id , data});
});

// Start the server
const PORT = 8000; // Set the port
app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});