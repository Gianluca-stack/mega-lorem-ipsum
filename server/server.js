const express = require('express') // Import express
const bodyParser = require('body-parser'); // to parse incoming request bodies in a middleware before your handlers, available under the req.body property.
const cors = require('cors');  //to enable CORS with various options.

const {v4: uuidv4} = require('uuid'); //to generate unique id for each user

const app = express(); // Initialize express
const PORT = 3000; // Port to run the server on

app.use(bodyParser.json());
app.use(cors());

let data = []; // Array to store the data

// Route to get all the data
// ----------------------------------------------

// Define route handler for GET requests to '/api/data'
app.get('/api/data', (req, res) => {
    res.json(data); // Send the data as json
    console.log("Data sent");
});

// Route to get a single data
// ----------------------------------------------
// Define route handler for GET requests to '/api/data/:id'

app.get('/api/data/:id', (req, res) => {
    const {id} = req.params; // Get the id from the request params

    const record = data.find((d) => d.id === id); // Find the data in the data array
    res.json(record); // Send the data as json
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

    console.log("Data added with id: " + record.id);
});

// Route to update a data
// ----------------------------------------------
// Define route handler for PUT requests to '/api/data/:id'

app.put('/api/data/:id', (req, res) => {
    const {id} = req.params.id; // Get the id from the request params
    const updateRecord = req.body; // Get the new data from the request body

    data = data.map((d) => (d.id === id ? {...record, ...updateRecord}: d)); // Update the data
    res.json(updateRecord); // Send the updated data as json
});

// Route to delete a data
// ----------------------------------------------

// Define route handler for DELETE requests to '/api/data/:id'
app.delete('/api/data/:id', (req, res) => {
    const {id} = req.params.id; // Get the id from the request params

    data = data.filter((d) => d.id !== id); // Filter out the data to be deleted
    res.json({message: 'Data deleted'}); // Send a success message

    console.log("Data deleted with id: " + id);
});

// Start the server

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});




