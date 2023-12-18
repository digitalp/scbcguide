// Assuming the XMLTV file is named 'output_schedule.xml' and is in the same folder as the script

// Function to fetch XMLTV data and render the TV guide
async function renderTVGuide() {
    try {
        // Fetch the local XML file using the Fetch API
        const response = await fetch('output_schedule.xml');

        // Check if the request was successful (status code 200)
        if (!response.ok) {
            throw new Error(`Failed to fetch XMLTV data. Status: ${response.status}`);
        }

        // Parse the XML data
        const xmlData = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlData, 'text/xml');

        const tvGuideElement = document.getElementById('tvGuide');

        // Assuming there is only one channel
        const channel = xmlDoc.querySelector('channel');
        const channelElement = document.createElement('div');
        channelElement.classList.add('channel');
        const channelName = channel.querySelector('display-name').textContent;
        channelElement.innerHTML = `<strong>${channelName}</strong>`;

        // Loop through programs for the single channel
        xmlDoc.querySelectorAll('programme').forEach(program => {
            const programElement = document.createElement('div');
            programElement.classList.add('program');
            const startDateTime = new Date(program.getAttribute('start'));
            const endDateTime = new Date(program.getAttribute('stop'));
            programElement.innerHTML = `
                <strong>${startDateTime.toLocaleTimeString()} - ${endDateTime.toLocaleTimeString()}</strong>
                <h3>${program.querySelector('title').textContent}</h3>
                <p><strong>Subtitle:</strong> ${program.querySelector('sub-title').textContent}</p>
                <p><strong>Description:</strong> ${program.querySelector('desc').textContent}</p>
            `;
            channelElement.appendChild(programElement);
        });

        tvGuideElement.appendChild(channelElement);
    } catch (error) {
        console.error('Error fetching or parsing XMLTV data:', error);
    }
}

// Call the function to render the TV guide
renderTVGuide();
