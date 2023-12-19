document.addEventListener('DOMContentLoaded', function() {
    const tvGuideContainer = document.getElementById('tvGuideContainer');
    const programModal = document.getElementById('programModal');
    const programDetails = document.getElementById('programDetails');
    const closeModal = document.getElementsByClassName("close")[0];
    const xmltvUrl = 'https://raw.githubusercontent.com/digitalp/scbcguide/main/scbcguide.xml';
    const timezoneOffset = -60; // +0100 timezone in minutes

    fetch(xmltvUrl)
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, "text/xml");
            populateTvGuide(xmlDoc);
        });

    function populateTvGuide(xmlDoc) {
        const programs = Array.from(xmlDoc.getElementsByTagName('programme'));
        const currentTime = new Date();
        let relevantPrograms = [];

        programs.sort((a, b) => parseXMLDate(a.getAttribute('start')) - parseXMLDate(b.getAttribute('start')));

        for (let program of programs) {
            const startTime = parseXMLDate(program.getAttribute('start'));
            const endTime = parseXMLDate(program.getAttribute('stop'));

            if ((startTime <= currentTime && endTime > currentTime) || startTime > currentTime) {
                relevantPrograms.push(program);
                if (relevantPrograms.length >= 4) break;
            }
        }

        relevantPrograms.forEach(program => {
            addProgramToGuide(program);
        });
    }

    function parseXMLDate(xmlDate) {
        const pattern = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
        const [, year, month, day, hours, minutes] = xmlDate.match(pattern);
        const date = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00Z`);
        date.setMinutes(date.getMinutes() + timezoneOffset);
        return date;
    }

    function addProgramToGuide(program) {
        const title = program.getElementsByTagName('title')[0].textContent;
        const startTime = parseXMLDate(program.getAttribute('start'));
        const endTime = parseXMLDate(program.getAttribute('stop'));
        const duration = calculateDuration(startTime, endTime);
        const formattedStartTime = formatTime(startTime);
        const formattedEndTime = formatTime(endTime);
        const desc = program.getElementsByTagName('desc')[0]?.textContent || 'No description available';

        const programElement = document.createElement('div');
        programElement.classList.add('program');
        programElement.innerHTML = `<h3>${title}</h3><p>${formattedStartTime} - ${formattedEndTime} (Duration: ${duration} mins)</p>`;
        programElement.addEventListener('click', function() {
            programDetails.innerHTML = `<h2>${title}</h2><p>${desc}</p>`;
            programModal.style.display = "block";
        });
        tvGuideContainer.appendChild(programElement);
    }

    function formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function calculateDuration(startTime, endTime) {
        const difference = endTime - startTime;
        return Math.round(difference / 60000); // Convert milliseconds to minutes
    }

    closeModal.addEventListener('click', function() {
        programModal.style.display = "none";
    });

    window.onclick = function(event) {
        if (event.target == programModal) {
            programModal.style.display = "none";
        }
    }
});
