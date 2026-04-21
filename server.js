const express = require('express');
const path = require('path');
const app = express();

// Set port for testing
const PORT = process.env.PORT || 8080;

// Tell Express to serve static files located in the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running and listening on port ${PORT}`);
});
