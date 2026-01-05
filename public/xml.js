function waitForElementById(id, timeoutMs = 5000) {
    return new Promise((resolve, reject) => {
        const existing = document.getElementById(id);
        if (existing) return resolve(existing);

        const startedAt = Date.now();
        const observer = new MutationObserver(() => {
            const found = document.getElementById(id);
            if (found) {
                observer.disconnect();
                resolve(found);
            } else if (Date.now() - startedAt > timeoutMs) {
                observer.disconnect();
                reject(new Error(`Timed out waiting for #${id}`));
            }
        });

        observer.observe(document.documentElement, { childList: true, subtree: true });

        setTimeout(() => {
            observer.disconnect();
            const found = document.getElementById(id);
            if (found) resolve(found);
            else reject(new Error(`Timed out waiting for #${id}`));
        }, timeoutMs);
    });
}

window.addEventListener('DOMContentLoaded', () => {
    fetch('/data.xml')
        .then((response) => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.text();
        })
        .then(async (data) => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, 'application/xml');

            const chatContent = xmlDoc.getElementsByTagName('chat')[0]?.textContent || 'Not Found';
            const linkHref = xmlDoc.getElementsByTagName('linkHref')[0]?.textContent || '#';

            try {
                const chatEl = await waitForElementById('chat', 5000);
                chatEl.textContent = chatContent;
            } catch {
                // If the header never mounts, don't fail the rest of the script.
            }

            const githubLink = document.getElementById('github-link');
            if (githubLink) {
                githubLink.href = linkHref;
            }
        })
        .catch((error) => {
            console.error('Error loading XML file:', error);
            const chatEl = document.getElementById('chat');
            if (chatEl) chatEl.textContent = 'Error loading data';

            const githubLink = document.getElementById('github-link');
            if (githubLink) githubLink.href = '#';
        });
});