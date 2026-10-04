document.addEventListener('DOMContentLoaded', () => {
  // JavaScript Function to Show Sections
  function showSection(sectionId) {
    // Get all sections
    const sections = document.querySelectorAll('.section');

    // Hide all sections
    sections.forEach(section => {
      section.classList.remove('active');
    });

    // Show the selected section
    const selectedSection = document.getElementById(sectionId);
    selectedSection.classList.add('active');

    // The map was created while hidden, so recalculate its size once visible
    if (sectionId === 'portfolio') {
      map.invalidateSize();
    }
  }

  // Expose the function to global scope
  window.showSection = showSection;

  // Log a welcome message to the console
  console.log("Welcome to Alex Rop's website!");

  // Initialize the Leaflet map
  const map = L.map('map').setView([0.0236, 37.9062], 6); // Center Kenya

  // Add a tile layer to the map
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Add a marker for Nairobi
  L.marker([-1.2921, 36.8219]).addTo(map)
    .bindPopup('Nairobi')
    .openPopup();

  // Submit the contact form in the background and show a thank-you message
  const form = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = form.querySelector('button');
    button.disabled = true;
    formStatus.className = '';
    formStatus.textContent = 'Sending...';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) throw new Error(response.statusText);

      form.reset();
      form.hidden = true;
      formStatus.className = 'success';
      formStatus.textContent = "Thanks for your message! I'll get back to you soon.";
    } catch (error) {
      formStatus.className = 'error';
      formStatus.textContent = 'Sorry, your message could not be sent. Please try again later.';
    } finally {
      button.disabled = false;
    }
  });
});
