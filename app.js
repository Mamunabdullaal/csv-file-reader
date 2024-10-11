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
    // Split the text into rows, trimming any whitespace and filtering out empty rows
    const rows = text.split('\n').map(row => row.trim()).filter(row => row.length > 0);
    
    // Ensure there are rows to process
    if (rows.length === 0) {
        console.error("No data found in the CSV file.");
        return;
    }

    // Split the first row to get headers
    const headers = rows[0].split(',').map(header => header.trim());
    
    // Initialize csvData array
    csvData = [];

    // Process each row after the header
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i].split(',');
        
        // Create an object to hold agent data
        let agentData = {};
        
        headers.forEach((header, index) => {
            // Check if values[index] is defined before trimming
            if (row[index] !== undefined) {
                agentData[header] = row[index].trim(); // Assign the trimmed value
            } else {
                // Handle the case where a value is missing (e.g., assign an empty string)
                agentData[header] = ''; 
            }
        });

        // Log each agent's data for debugging
        console.log(`Row ${i}:`, agentData);

        // Push the agentData object to the csvData array
        csvData.push(agentData);
    }

    // Log the final parsed CSV data
    console.log("CSV data parsed:", csvData);
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
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${agent['agent_id']}</td>
            <td>${agent['agent_name']}</td>
            <td>${agent['login_time']}</td>
            <td>${agent['logout_time']}</td>
            <td>${agent['total_break']}</td>
            <td>${formatTime(agent['ready_time'])}</td>
            <td>${agent['current_status']}</td>
            <td class="${readyTime < requiredTime ? 'text-danger' : ''}">${status}</td>
        `;

        resultBody.appendChild(row);
        
        // Show the table
        resultTable.style.display = 'table';
    } else {
        alert('Agent ID not found.');
    }
}

// Function to format time to h:mm:ss
function formatTime(totalHours) {
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:00`; // Append seconds as 00
}
