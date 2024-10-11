let csvData = [];

// Select the CSV file input element
const csvFileInput = document.getElementById('csvFileInput');
const fileUploadStatus = document.getElementById('fileUploadStatus');

// Event listener for file input change
csvFileInput.addEventListener('change', uploadCSV);

// Function to read and parse the uploaded CSV file
function uploadCSV(event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const text = e.target.result;
            console.log("File content:", text);  // Log the file content for debugging
            parseCSV(text);
        };

        reader.onerror = function() {
            fileUploadStatus.textContent = "Error reading the file.";
            console.error("Error reading file", reader.error);
        };

        reader.readAsText(file);
    } else {
        fileUploadStatus.textContent = "No file selected.";
        fileUploadStatus.style.color = "red";
    }
}

// Function to parse CSV data
function parseCSV(text) {
    const rows = text.split('\n').filter(row => row.trim() !== ""); // Remove empty rows
    const headers = rows[0].split(',').map(header => header.trim());

    console.log("Headers found:", headers);  // Log headers for debugging

    csvData = rows.slice(1).map((row, rowIndex) => {
        const values = row.split(',').map(value => value.trim());
        let agentData = {};

        // Log the row being processed for debugging
        console.log(`Processing row ${rowIndex + 1}:`, values);

        headers.forEach((header, index) => {
            // Validate if the index exists in the values array
            if (index < values.length) {
                agentData[header] = values[index] !== undefined ? values[index] : ""; // Check for undefined
            } else {
                agentData[header] = ""; // Set empty string for missing values
            }
        });

        return agentData;
    });

    console.log("CSV data parsed:", csvData);  // Log the parsed CSV data for debugging
    fileUploadStatus.textContent = "File successfully uploaded.";
    fileUploadStatus.style.color = "green";  // Change color to indicate success
}

// Function to search for an agent by ID and display the information
function searchAgent() {
    const agentId = document.getElementById('agentIdInput').value.trim();

    // Check if CSV data has been uploaded first
    if (csvData.length === 0) {
        alert("Please upload a CSV file before searching.");
        return;
    }

    const resultTable = document.getElementById('resultTable');
    const resultBody = document.getElementById('resultBody');

    // Clear previous results
    resultBody.innerHTML = '';

    // Find the agent by ID
    const agent = csvData.find(item => item['agent_id'] && item['agent_id'].trim() === agentId);

    if (agent) {
        const readyTime = parseFloat(agent['ready_time']) || 0; // Ensure ready_time is a number
        const requiredTime = 7.5; // 7 hours and 30 minutes = 7.5 hours
        const status = readyTime >= requiredTime 
            ? 'Complete' 
            : `Needs ${(requiredTime - readyTime).toFixed(2)} more hours`;

        // Append the result to the table
        resultBody.innerHTML = `
            <tr>
                <td>${agent['agent_id']}</td>
                <td>${agent['login_time']}</td>
                <td>${agent['logout_time']}</td>
                <td>${agent['total_break']}</td>
                <td>${agent['ready_time']}</td>
                <td>${status}</td>
            </tr>
        `;

        // Show the table
        resultTable.style.display = 'table';
    } else {
        alert('Agent ID not found.');
    }
}
