let csvData = [];

// Function to parse and read the CSV file
function handleFileUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const text = e.target.result;
        parseCSV(text);
    };

    reader.readAsText(file);
}

// Function to parse CSV data
function parseCSV(text) {
    const rows = text.split('\n');
    const headers = rows[0].split(',');

    csvData = rows.slice(1).map(row => {
        const values = row.split(',');
        let agentData = {};
        headers.forEach((header, index) => {
            // Handle missing values safely
            if (values[index] !== undefined) {
                agentData[header.trim()] = values[index].trim();
            } else {
                agentData[header.trim()] = ''; 
            }
        });
        return agentData;
    });

    console.log("CSV data parsed:", csvData);
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

    resultBody.innerHTML = ''; // Clear the previous result

    const agent = csvData.find(item => item['agent_id'] && item['agent_id'].trim() === agentId);

    if (agent) {
        const readyTime = parseTime(agent['ready_time']); // Convert ready_time to decimal hours
        const requiredTime = 7.5; // 7 hours 30 minutes in decimal = 7.5
        let statusMessage;

        // Check if the agent has less than the required time
        if (readyTime < requiredTime) {
            const timeNeeded = requiredTime - readyTime; // Time required to complete 7.5 hours
            statusMessage = `Needs ${formatDuration(timeNeeded * 3600)} more`;
        } else {
            statusMessage = 'Complete'; // Agent has completed the required time
        }

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
            <td class="${readyTime < requiredTime ? 'text-danger' : ''}">${statusMessage}</td>
        `;

        resultBody.appendChild(row);

        // Log and alert the full sentence (agent ID and name)
        const fullSentenceOutput = `${agent['agent_id']} "${agent['agent_name']}"`;
        console.log(fullSentenceOutput);
        alert(fullSentenceOutput);

        resultTable.style.display = 'table';
    } else {
        alert('Agent ID not found.');
    }
}

// Function to handle "Enter" key press
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        searchAgent();
    }
}

// Function to parse time from "hh:mm:ss" to decimal hours
function parseTime(timeString) {
    const parts = timeString.split(':');
    if (parts.length === 3) {
        const hours = parseFloat(parts[0]);
        const minutes = parseFloat(parts[1]) / 60;
        const seconds = parseFloat(parts[2]) / 3600;
        return hours + minutes + seconds;
    }
    return 0;
}

// Function to format duration from seconds to "h mm s"
function formatDuration(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${hours}h ${minutes}min ${seconds}sec`;
}
