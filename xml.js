// Fetch and parse the XML file
fetch('data.xml')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, 'application/xml');

        // Extract the content of <chat> element
        const chatContent = xmlDoc.getElementsByTagName('chat')[0]?.textContent || 'Not Found';
        const linkText = xmlDoc.getElementsByTagName('linkText')[0]?.textContent || 'Default Link';
        const linkHref = xmlDoc.getElementsByTagName('linkHref')[0]?.textContent || '#';


        // Update the content of <h1 id="chat">
        document.getElementById('chat').textContent = chatContent;

        // Update the <a> tag's text and href
        const chatLink = document.getElementById('chat-link');
        chatLink.textContent = linkText;    // Update the link text
        chatLink.href = linkHref;            // Update the link's href
    })
    .catch(error => {
        // Handle errors and update the link to show an error message
        console.error('Error loading XML file:', error);
        document.getElementById('chat').textContent = 'Error loading data';
        const chatLink = document.getElementById('chat-link');
        chatLink.textContent = 'Error loading data';  // Show error text
        chatLink.href = '#';  // Fallback href
    });