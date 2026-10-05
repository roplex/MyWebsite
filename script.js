document.addEventListener('DOMContentLoaded', () => {
  // Mobile navigation toggle
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');

  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close the mobile menu after choosing a link
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', false);
    });
  });

  // Highlight the nav link for the section currently in view
  const navLinks = nav.querySelectorAll('a[href^="#"]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));

  // Keep the footer year current
  document.getElementById('year').textContent = new Date().getFullYear();

  // Hero background: satellite imagery over Kenya (decorative, not interactive)
  const heroMap = L.map('hero-map', {
    zoomControl: false,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false,
    touchZoom: false
  }).setView([0.2, 37.6], 7);

  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Imagery &copy; Esri, Maxar, Earthstar Geographics'
  }).addTo(heroMap);

  // Work map: places my work and research have covered
  const workMap = L.map('work-map', { scrollWheelZoom: false }).setView([20, 20], 2);

  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri, HERE, Garmin, &copy; OpenStreetMap contributors',
    maxZoom: 16
  }).addTo(workMap);

  // type: 'onsite' (in Kenya), 'hybrid' (remote and in person) or 'remote' (from Nairobi)
  const places = [
    {
      coords: [-1.2921, 36.8219],
      title: 'Nairobi, Kenya',
      detail: 'ROXR Earth &middot; Fairtrade Africa &middot; Esri Eastern Africa',
      type: 'onsite'
    },
    {
      coords: [0.5143, 35.2698],
      title: 'Eldoret, Uasin Gishu County',
      detail: 'Nine Farms Survey Project &middot; Freelance geospatial work',
      type: 'onsite'
    },
    {
      coords: [-0.0917, 34.7680],
      title: 'Lake Victoria, Kenya',
      detail: 'Futures Inc. &middot; Yamaha Carbon Credit Project',
      type: 'hybrid'
    },
    {
      coords: [0.3476, 32.5825],
      title: 'Uganda',
      detail: 'Fairtrade Africa &middot; EUDR deforestation risk monitoring',
      type: 'hybrid'
    },
    {
      coords: [-6.1630, 35.7516],
      title: 'Tanzania',
      detail: 'Fairtrade Africa &middot; EUDR deforestation risk monitoring',
      type: 'hybrid'
    },
    {
      coords: [-1.9441, 30.0619],
      title: 'Rwanda',
      detail: 'Fairtrade Africa &middot; EUDR deforestation risk monitoring',
      type: 'hybrid'
    },
    {
      coords: [-3.4271, 29.9246],
      title: 'Burundi',
      detail: 'Fairtrade Africa &middot; EUDR deforestation risk monitoring',
      type: 'hybrid'
    },
    {
      coords: [-2.5, 28.8],
      title: 'Democratic Republic of the Congo',
      detail: 'Fairtrade Africa &middot; EUDR deforestation risk monitoring',
      type: 'hybrid'
    },
    {
      coords: [42.3736, -71.1097],
      title: 'Cambridge, Massachusetts',
      detail: 'Harvard University, Center for Geographic Analysis',
      type: 'remote'
    },
    {
      coords: [33.4484, -112.0740],
      title: 'Phoenix, Arizona',
      detail: 'Book chapter case study: surface urban heat islands',
      type: 'remote'
    },
    {
      coords: [22.5, 79.0],
      title: 'India',
      detail: 'Drought analysis and monitoring research with Harvard CGA',
      type: 'remote'
    },
    {
      coords: [46.2044, 6.1432],
      title: 'Geneva, Switzerland',
      detail: 'UNITAR Empower Africa Programme (TICAD9)',
      type: 'remote'
    }
  ];

  const fills = { onsite: '#0e8c7f', hybrid: '#8fd6cc', remote: '#ffffff' };
  const notes = {
    onsite: '',
    hybrid: '<br><em>Hybrid: remote and in person</em>',
    remote: '<br><em>Remote, from Nairobi</em>'
  };

  // Remote work is linked back to Nairobi, where it was done from
  const home = places[0].coords;

  const markers = places.map(place => {
    if (place.type === 'remote') {
      L.polyline([home, place.coords], {
        color: '#0e8c7f',
        weight: 1.5,
        opacity: 0.6,
        dashArray: '4 6'
      }).addTo(workMap);
    }

    return L.circleMarker(place.coords, {
      radius: 7,
      color: '#0e8c7f',
      weight: 2,
      fillColor: fills[place.type],
      fillOpacity: 1
    })
      .addTo(workMap)
      .bindPopup(`<strong>${place.title}</strong><br>${place.detail}${notes[place.type]}`);
  });

  // Switch between the world view and a closer view of East Africa
  const views = {
    world: L.featureGroup(markers).getBounds(),
    region: L.featureGroup(markers.filter((marker, i) => places[i].type !== 'remote')).getBounds()
  };
  const viewButtons = document.querySelectorAll('.map-views button');

  workMap.fitBounds(views.world, { padding: [40, 40] });

  viewButtons.forEach(button => {
    button.addEventListener('click', () => {
      workMap.flyToBounds(views[button.dataset.view], { padding: [40, 40], duration: 0.8 });
      viewButtons.forEach(other => other.classList.toggle('active', other === button));
    });
  });

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
