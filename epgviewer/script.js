document.addEventListener('DOMContentLoaded', function() {
    const tvGuideContainer = document.getElementById('tvGuideContainer');
    const programModal = document.getElementById('programModal');
    const programDetails = document.getElementById('programDetails');
    const closeModal = document.getElementsByClassName("close")[0];
    const xmltvUrl = 'https://raw.githubusercontent.com/digitalp/scbcguide/main/scbcguide.xml';
    const timezoneOffset = -60; // +0100 timezone in minutes
    let relevantPrograms = [];

    fetchAndPopulateGuide();
    setInterval(fetchAndPopulateGuide, 60000); // Refresh guide every minute

    function fetchAndPopulateGuide() {
        fetch(xmltvUrl)
            .then(response => response.text())
            .then(data => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(data, "text/xml");
                populateTvGuide(xmlDoc);
            });
    }

    function populateTvGuide(xmlDoc) {
        tvGuideContainer.innerHTML = ''; // Clear existing entries
        relevantPrograms = [];
        const programs = Array.from(xmlDoc.getElementsByTagName('programme'));
        const currentTime = new Date();

        programs.sort((a, b) => parseXMLDate(a.getAttribute('start')) - parseXMLDate(b.getAttribute('start')));

        for (let program of programs) {
            const startTime = parseXMLDate(program.getAttribute('start'));
            const endTime = parseXMLDate(program.getAttribute('stop'));

            if ((startTime <= currentTime && endTime > currentTime) || startTime > currentTime) {
                relevantPrograms.push(program);
                if (relevantPrograms.length >= 4) break;
            }
        }

        relevantPrograms.forEach((program, index) => {
            addProgramToGuide(program, index);
        });
        updateProgressBars(); // Update progress bars and time left after populating guide
    }

    function addProgramToGuide(program, index) {
        const title = program.getElementsByTagName('title')[0].textContent;
        const startTime = parseXMLDate(program.getAttribute('start'));
        const endTime = parseXMLDate(program.getAttribute('stop'));
        const currentTime = new Date();
        const formattedStartTime = formatTime(startTime);
        const formattedEndTime = formatTime(endTime);
        const isCurrent = currentTime >= startTime && currentTime < endTime;
        const timeLeft = isCurrent ? calculateTimeLeft(currentTime, endTime) : '';
        const progressBar = isCurrent ? `<div class="progress"><div class="progress-bar" style="width: ${calculateProgress(startTime, endTime)}%;"></div></div>` : '';
        const desc = program.getElementsByTagName('desc')[0]?.textContent || 'No description available';

        const programElement = document.createElement('div');
        programElement.classList.add('program');
        programElement.dataset.index = index;
        programElement.innerHTML = `<h3>${title}</h3>
                                    <p>${formattedStartTime} - ${formattedEndTime}</p>
                                    ${isCurrent ? `<p class='time-left'>Time Left: ${timeLeft} mins</p>` : ''}
                                    ${progressBar}`;
        programElement.addEventListener('click', function() {
            programDetails.innerHTML = `<h2>${title}</h2><p>${desc}</p>`;
            programModal.style.display = "block";
        });
        tvGuideContainer.appendChild(programElement);
    }

    function formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function calculateTimeLeft(currentTime, endTime) {
        const difference = endTime - currentTime;
        return Math.round(difference / 60000); // Convert milliseconds to minutes
    }

    function calculateProgress(startTime, endTime) {
        const currentTime = new Date();
        if (currentTime < startTime) {
            return 0; // Program hasn't started yet
        } else if (currentTime > endTime) {
            return 100; // Program has finished
        } else {
            const totalDuration = endTime - startTime;
            const elapsed = currentTime - startTime;
            return (elapsed / totalDuration) * 100;
        }
    }

    function updateProgressBars() {
        const currentTime = new Date();
        const programs = tvGuideContainer.getElementsByClassName('program');
        for (let programElement of programs) {
            const index = programElement.dataset.index;
            const program = relevantPrograms[index];
            const startTime = parseXMLDate(program.getAttribute('start'));
            const endTime = parseXMLDate(program.getAttribute('stop'));
            if (currentTime >= startTime && currentTime < endTime) {
                const progress = calculateProgress(startTime, endTime);
                const timeLeft = calculateTimeLeft(currentTime, endTime);
                const progressBar = programElement.getElementsByClassName('progress-bar')[0];
                const timeLeftElement = programElement.getElementsByClassName('time-left')[0];
                if (timeLeftElement) {
                    timeLeftElement.textContent = `Time Left: ${timeLeft} mins`;
                }
                if (progressBar) {
                    progressBar.style.width = `${progress}%`;
                }
            }
        }
    }

    function parseXMLDate(xmlDate) {
        const pattern = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
        const [, year, month, day, hours, minutes] = xmlDate.match(pattern);
        const date = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00Z`);
        date.setMinutes(date.getMinutes() + timezoneOffset);
        return date;
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
