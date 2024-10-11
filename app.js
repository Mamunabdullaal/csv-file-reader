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
    const rows = text.split('\n').map(row => row.trim()).filter(row => row.length > 0);

    if (rows.length === 0) {
        console.error("No data found in the CSV file.");
        return;
    }

    const headers = rows[0].split(',').map(header => header.trim());

    csvData = [];

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i].split(',');
        let agentData = {};

        headers.forEach((header, index) => {
            if (row[index] !== undefined) {
                agentData[header] = row[index].trim();
            } else {
                agentData[header] = ''; 
            }
        });

        console.log(`Row ${i}:`, agentData);
        csvData.push(agentData);
    }

    console.log("CSV data parsed:", csvData);
    fileUploadStatus.textContent = "File successfully uploaded.";
    fileUploadStatus.style.color = "green"; 
}

// Function to search for an agent by ID and display the information
function searchAgent() {
    const agentId = document.getElementById('agentIdInput').value.trim();

    if (csvData.length === 0) {
        alert("Please upload a CSV file before searching.");
        return;
    }

    const resultTable = document.getElementById('resultTable');
    const resultBody = document.getElementById('resultBody');

    resultBody.innerHTML = '';

    const agent = csvData.find(item => item['agent_id'] && item['agent_id'].trim() === agentId);

    if (agent) {
        const readyTime = parseFloat(agent['ready_time']) || 0; // Keep the original ready_time value
        const requiredTime = 7.5; // 7 hours and 30 minutes = 7.5 hours
        const status = readyTime >= requiredTime 
            ? 'Complete' 
            : `Needs ${formatDuration((requiredTime - readyTime) * 3600)} more`;

        // Append the result to the table
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${agent['agent_id']}</td>
            <td>${agent['agent_name']}</td>
            <td>${agent['login_time']}</td>
            <td>${agent['logout_time']}</td>
            <td>${agent['total_break']}</td>
            <td>${agent['ready_time']}</td>
            <td>${agent['current_status']}</td>
            <td class="${readyTime < requiredTime ? 'text-danger' : ''}">${status}</td>
        `;

        resultBody.appendChild(row);

        // Display the full sentence as output
        const fullSentenceOutput = `${agent['agent_id']} "${agent['agent_name']}"`;
        console.log(fullSentenceOutput); // Log the full sentence
        alert(fullSentenceOutput); // Alert the full sentence output

        resultTable.style.display = 'table';
    } else {
        alert('Agent ID not found.');
    }
}

// Function to format duration from seconds to h min sec
function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours}h ${minutes}min ${secs}sec`;
}
