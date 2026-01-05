window.addEventListener('DOMContentLoaded', () => {
    fetch('/data.xml')
        .then((response) => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.text();
        })
        .then((data) => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, 'application/xml');
            const linkHref = xmlDoc.getElementsByTagName('linkHref')[0]?.textContent || '#';

            const githubLink = document.getElementById('github-link');
            if (githubLink) {
                githubLink.href = linkHref;
            }
        })
        .catch((error) => {
            console.error('Error loading XML file:', error);
            const githubLink = document.getElementById('github-link');
            if (githubLink) githubLink.href = '#';
        });
});