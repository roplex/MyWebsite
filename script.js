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
});
