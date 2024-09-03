document.addEventListener('DOMContentLoaded', () => {
    const uploadInput = document.getElementById('upload');
    const uploadedImage = document.getElementById('uploaded-image');
    const filterButtons = document.querySelectorAll('.filter-button');
    const removeFiltersButton = document.getElementById('remove-filters');
    const downloadButton = document.getElementById('download');

    let filters = [];

    uploadInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadedImage.src = e.target.result;
                uploadedImage.style.display = 'block';
                // Clear any applied filters when a new image is uploaded
                filters = [];
                applyFilters();
                resetFilterButtons();
            };
            reader.readAsDataURL(file);
        }
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            if (filters.includes(filter)) {
                filters = filters.filter(f => f !== filter);
                button.classList.remove('dull');
            } else {
                filters.push(filter);
                button.classList.add('dull');
            }
            applyFilters();
        });
    });

    function applyFilters() {
        uploadedImage.style.filter = filters.join(' ');
    }

    function resetFilterButtons() {
        filterButtons.forEach(button => {
            button.classList.remove('dull');
        });
    }

    removeFiltersButton.addEventListener('click', () => {
        filters = [];
        resetFilterButtons();
        applyFilters();
    });

    downloadButton.addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = uploadedImage.width * 0.67; // 67% of the original width
        canvas.height = uploadedImage.height * 0.67; // 67% of the original height

        // Draw the image onto the canvas with 67% size
        ctx.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height);

        // Apply the filters to the canvas context
        ctx.filter = filters.join(' ');

        // Draw the image again on the canvas with filters applied
        ctx.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height);

        // Convert the canvas to a data URL and trigger the download
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'filtered-image.png';
        link.click();
    });
});
