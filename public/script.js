// Create an OOP class to handle the footer year update
class Footer {
    constructor(yearElementId) {
        this.yearElementId = yearElementId;
        this.currentYear = new Date().getFullYear();
    }

    // Method to update the year in the footer
    updateYear() {
        const yearElement = document.getElementById(this.yearElementId);
        if (yearElement) {
            yearElement.textContent = this.currentYear;
        }
    }
}

// Create an instance of Footer and update the year when DOM content is loaded
document.addEventListener('DOMContentLoaded', function () {
    const footer = new Footer('current-year');
    footer.updateYear();
});
