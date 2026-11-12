/**
 * Urban Heat Hotspot & Cooling Planner Dashboard Client Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // State
  let heatReports = [];
  let coolingLocations = [];
  let currentHeatFilter = 'ALL';
  let heatSearchQuery = '';
  let coolingSearchQuery = '';

  // DOM Elements - Metrics
  const statTotalHotspots = document.getElementById('stat-total-hotspots');
  const statMaxTemp = document.getElementById('stat-max-temp');
  const statMaxTempLocation = document.getElementById('stat-max-temp-location');
  const statHighAlerts = document.getElementById('stat-high-alerts');
  const statCoolingSlots = document.getElementById('stat-cooling-slots');

  // DOM Elements - Containers & Badges
  const heatReportsContainer = document.getElementById('heat-reports-container');
  const coolingLocationsContainer = document.getElementById('cooling-locations-container');
  const badgeHeatCount = document.getElementById('badge-heat-count');
  const badgeCoolingCount = document.getElementById('badge-cooling-count');

  // DOM Elements - Filters & Search
  const filterBtns = document.querySelectorAll('.filter-btn');
  const inputSearchHeat = document.getElementById('input-search-heat');
  const inputSearchCooling = document.getElementById('input-search-cooling');
  const btnRefreshData = document.getElementById('btn-refresh-data');
  const btnThemeToggle = document.getElementById('btn-theme-toggle');

  // Theme Switching Logic (Defaults to Light)
  const savedTheme = localStorage.getItem('urbanheat_theme') || 'light';
  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (btnThemeToggle) btnThemeToggle.textContent = '☀️ Light Mode';
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (btnThemeToggle) btnThemeToggle.textContent = '🌙 Dark Mode';
    }
    localStorage.setItem('urbanheat_theme', theme);
  }
  applyTheme(savedTheme);

  if (btnThemeToggle) {
    btnThemeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      applyTheme(isDark ? 'light' : 'dark');
    });
  }

  // DOM Elements - Modals
  const modalHeat = document.getElementById('modal-heat-report');
  const btnOpenHeatModal = document.getElementById('btn-open-heat-modal');
  const btnCloseHeatModal = document.getElementById('btn-close-heat-modal');
  const btnCancelHeat = document.getElementById('btn-cancel-heat');
  const formHeatReport = document.getElementById('form-heat-report');
  const heatErrorBanner = document.getElementById('heat-error-banner');

  const modalCooling = document.getElementById('modal-cooling-location');
  const btnOpenCoolingModal = document.getElementById('btn-open-cooling-modal');
  const btnCloseCoolingModal = document.getElementById('btn-close-cooling-modal');
  const btnCancelCooling = document.getElementById('btn-cancel-cooling');
  const formCoolingLocation = document.getElementById('form-cooling-location');
  const coolingErrorBanner = document.getElementById('cooling-error-banner');

  const toastContainer = document.getElementById('toast-container');

  // Toast Notification Helper
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? '✅' : '⚠️';
    toast.innerHTML = `<span>${icon}</span><span>${escapeHtml(message)}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Load All Data from Backend APIs
  async function loadAllData() {
    try {
      const [heatRes, coolRes] = await Promise.all([
        fetch('/api/heat-reports'),
        fetch('/api/cooling-locations')
      ]);

      if (!heatRes.ok) throw new Error('Failed to load heat reports');
      if (!coolRes.ok) throw new Error('Failed to load cooling locations');

      heatReports = await heatRes.json();
      coolingLocations = await coolRes.json();

      updateMetrics();
      renderHeatReports();
      renderCoolingLocations();
    } catch (err) {
      showToast('Error syncing with backend: ' + err.message, 'error');
    }
  }

  // Update Top Metric KPI Cards
  function updateMetrics() {
    statTotalHotspots.textContent = heatReports.length;

    if (heatReports.length > 0) {
      const maxRecord = heatReports.reduce((max, r) => (r.temperature > max.temperature ? r : max), heatReports[0]);
      statMaxTemp.textContent = `${maxRecord.temperature.toFixed(1)}°C`;
      statMaxTempLocation.textContent = `At ${maxRecord.location}`;
    } else {
      statMaxTemp.textContent = '--°C';
      statMaxTempLocation.textContent = 'No data recorded';
    }

    const highAlertsCount = heatReports.filter(r => (r.severity || '').toUpperCase() === 'HIGH').length;
    statHighAlerts.textContent = highAlertsCount;

    const totalCapacity = coolingLocations.reduce((sum, c) => sum + (c.capacity || 0), 0);
    const totalAvailSlots = coolingLocations.reduce((sum, c) => sum + (c.availableSlots || 0), 0);
    statCoolingSlots.textContent = `${totalAvailSlots} / ${totalCapacity}`;
  }

  // Render Heat Reports
  function renderHeatReports() {
    const filtered = heatReports.filter(report => {
      const severity = (report.severity || '').toUpperCase();
      const matchesFilter = (currentHeatFilter === 'ALL') || (severity === currentHeatFilter);
      const matchesSearch = !heatSearchQuery || (report.location || '').toLowerCase().includes(heatSearchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    badgeHeatCount.textContent = `${filtered.length} of ${heatReports.length} items`;

    if (filtered.length === 0) {
      heatReportsContainer.innerHTML = `
        <div style="text-align: center; padding: 2.5rem 1rem; color: var(--text-dim);">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">🏜️</div>
          <p>No heat reports found matching your current filter.</p>
        </div>
      `;
      return;
    }

    heatReportsContainer.innerHTML = filtered.map(item => {
      const sev = (item.severity || 'LOW').toUpperCase();
      const sevClass = sev === 'HIGH' ? 'high' : (sev === 'MEDIUM' ? 'medium' : 'low');
      const tempColor = sev === 'HIGH' ? '#f87171' : (sev === 'MEDIUM' ? '#fbbf24' : '#34d399');

      return `
        <article class="heat-item" id="heat-report-${item.id}">
          <div class="heat-info">
            <div class="heat-location">
              <span>📍</span>
              <span>${escapeHtml(item.location)}</span>
            </div>
            <div class="heat-meta">Report ID #${item.id} &bull; Urban Monitoring Point</div>
          </div>
          <div class="heat-metrics">
            <span class="heat-temp-badge" style="color: ${tempColor};">
              ${item.temperature.toFixed(1)}°C
            </span>
            <span class="severity-pill ${sevClass}">
              ${sev}
            </span>
          </div>
        </article>
      `;
    }).join('');
  }

  // Render Cooling Locations
  function renderCoolingLocations() {
    const filtered = coolingLocations.filter(loc => {
      if (!coolingSearchQuery) return true;
      const q = coolingSearchQuery.toLowerCase();
      return (loc.name || '').toLowerCase().includes(q) || (loc.address || '').toLowerCase().includes(q);
    });

    badgeCoolingCount.textContent = `${filtered.length} locations`;

    if (filtered.length === 0) {
      coolingLocationsContainer.innerHTML = `
        <div style="text-align: center; padding: 2.5rem 1rem; color: var(--text-dim);">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">🏢</div>
          <p>No cooling locations match your search query.</p>
        </div>
      `;
      return;
    }

    coolingLocationsContainer.innerHTML = filtered.map(loc => {
      const cap = loc.capacity || 0;
      const slots = loc.availableSlots || 0;
      const pctAvail = cap > 0 ? Math.round((slots / cap) * 100) : 0;

      return `
        <article class="cooling-item" id="cooling-location-${loc.id}">
          <div class="cooling-item-header">
            <div>
              <h4 class="cooling-name">${escapeHtml(loc.name)}</h4>
              <div class="cooling-address">
                <span>📍</span>
                <span>${escapeHtml(loc.address)}</span>
              </div>
            </div>
            <span class="status-badge" style="background: rgba(6, 182, 212, 0.15); border-color: rgba(6, 182, 212, 0.4); color: #38bdf8;">
              #${loc.id}
            </span>
          </div>

          <div class="cooling-stats">
            <span>Availability: <span class="cooling-slots-avail">${slots}</span> of ${cap} slots</span>
            <span style="font-weight: 600;">${pctAvail}% Free</span>
          </div>

          <div class="progress-bar-bg" aria-label="Shelter capacity progress">
            <div class="progress-bar-fill" style="width: ${pctAvail}%;"></div>
          </div>
        </article>
      `;
    }).join('');
  }

  // Modal Handlers
  function openModal(modal, errorBanner) {
    if (errorBanner) {
      errorBanner.style.display = 'none';
      errorBanner.textContent = '';
    }
    modal.classList.add('active');
  }

  function closeModal(modal) {
    modal.classList.remove('active');
  }

  btnOpenHeatModal.addEventListener('click', () => openModal(modalHeat, heatErrorBanner));
  btnCloseHeatModal.addEventListener('click', () => closeModal(modalHeat));
  btnCancelHeat.addEventListener('click', () => closeModal(modalHeat));

  btnOpenCoolingModal.addEventListener('click', () => openModal(modalCooling, coolingErrorBanner));
  btnCloseCoolingModal.addEventListener('click', () => closeModal(modalCooling));
  btnCancelCooling.addEventListener('click', () => closeModal(modalCooling));

  // Close modals on clicking overlay backdrop
  [modalHeat, modalCooling].forEach(m => {
    m.addEventListener('click', (e) => {
      if (e.target === m) closeModal(m);
    });
  });

  // Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentHeatFilter = btn.dataset.filter;
      renderHeatReports();
    });
  });

  // Search Inputs
  inputSearchHeat.addEventListener('input', (e) => {
    heatSearchQuery = e.target.value.trim();
    renderHeatReports();
  });

  inputSearchCooling.addEventListener('input', (e) => {
    coolingSearchQuery = e.target.value.trim();
    renderCoolingLocations();
  });

  // Refresh Button
  btnRefreshData.addEventListener('click', async () => {
    btnRefreshData.textContent = '🔄 Syncing...';
    await loadAllData();
    btnRefreshData.textContent = '🔄 Refresh';
    showToast('Data refreshed successfully');
  });

  // Submit Heat Report Form
  formHeatReport.addEventListener('submit', async (e) => {
    e.preventDefault();
    heatErrorBanner.style.display = 'none';

    const locationVal = document.getElementById('heat-location-input').value;
    const tempRaw = document.getElementById('heat-temp-input').value;
    const severityVal = document.getElementById('heat-severity-select').value;

    const payload = {
      location: locationVal,
      temperature: tempRaw === '' ? null : parseFloat(tempRaw),
      severity: severityVal || null
    };

    try {
      const response = await fetch('/api/heat-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errMsg = errorData.message || (errorData.details && errorData.details[0]) || 'Failed to submit heat report';
        heatErrorBanner.textContent = errMsg;
        heatErrorBanner.style.display = 'block';
        showToast(errMsg, 'error');
        return;
      }

      const savedReport = await response.json();
      closeModal(modalHeat);
      formHeatReport.reset();
      showToast(`Heat Report for "${savedReport.location}" added (${savedReport.severity})!`);
      await loadAllData();
    } catch (err) {
      heatErrorBanner.textContent = 'Network or server error: ' + err.message;
      heatErrorBanner.style.display = 'block';
      showToast('Error submitting report', 'error');
    }
  });

  // Submit Cooling Location Form
  formCoolingLocation.addEventListener('submit', async (e) => {
    e.preventDefault();
    coolingErrorBanner.style.display = 'none';

    const nameVal = document.getElementById('cooling-name-input').value;
    const addressVal = document.getElementById('cooling-address-input').value;
    const capacityVal = document.getElementById('cooling-capacity-input').value;
    const slotsVal = document.getElementById('cooling-slots-input').value;

    const payload = {
      name: nameVal,
      address: addressVal,
      capacity: capacityVal === '' ? null : parseInt(capacityVal, 10),
      availableSlots: slotsVal === '' ? null : parseInt(slotsVal, 10)
    };

    try {
      const response = await fetch('/api/cooling-locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errMsg = errorData.message || (errorData.details && errorData.details[0]) || 'Failed to register cooling center';
        coolingErrorBanner.textContent = errMsg;
        coolingErrorBanner.style.display = 'block';
        showToast(errMsg, 'error');
        return;
      }

      const savedLoc = await response.json();
      closeModal(modalCooling);
      formCoolingLocation.reset();
      showToast(`Cooling Center "${savedLoc.name}" registered successfully!`);
      await loadAllData();
    } catch (err) {
      coolingErrorBanner.textContent = 'Network or server error: ' + err.message;
      coolingErrorBanner.style.display = 'block';
      showToast('Error registering cooling center', 'error');
    }
  });

  // Initial Load
  loadAllData().then(() => {
    // URL parameter support for showcasing activities / deep linking
    const urlParams = new URLSearchParams(window.location.search);
    const activityParam = urlParams.get('activity');
    if (activityParam) {
      if (activityParam === 'filter_high') {
        const btn = document.getElementById('filter-high-btn');
        if (btn) btn.click();
      } else if (activityParam === 'filter_medium') {
        const btn = document.getElementById('filter-medium-btn');
        if (btn) btn.click();
      } else if (activityParam === 'filter_low') {
        const btn = document.getElementById('filter-low-btn');
        if (btn) btn.click();
      } else if (activityParam === 'search_heat' || activityParam === 'search') {
        inputSearchHeat.value = 'Eastside';
        heatSearchQuery = 'Eastside';
        renderHeatReports();
      } else if (activityParam === 'search_cooling') {
        inputSearchCooling.value = 'Library';
        coolingSearchQuery = 'Library';
        renderCoolingLocations();
      } else if (activityParam === 'modal_heat_empty') {
        openModal(modalHeat, heatErrorBanner);
      } else if (activityParam === 'modal_heat' || activityParam === 'modal_heat_filled') {
        openModal(modalHeat, heatErrorBanner);
        document.getElementById('heat-location-input').value = 'South Harbor Container Terminal';
        document.getElementById('heat-temp-input').value = '43.8';
        document.getElementById('heat-severity-select').value = 'HIGH';
      } else if (activityParam === 'modal_heat_error') {
        openModal(modalHeat, heatErrorBanner);
        document.getElementById('heat-location-input').value = 'Extreme Industrial Foundry';
        document.getElementById('heat-temp-input').value = '75.5';
        document.getElementById('heat-severity-select').value = 'HIGH';
        heatErrorBanner.textContent = 'HTTP 400 Bad Request: Temperature must be between -20.0°C and 60.0°C';
        heatErrorBanner.style.display = 'block';
      } else if (activityParam === 'submitted_heat' || activityParam === 'toast_report') {
        const newReport = {
          id: 6,
          location: 'South Harbor Container Terminal',
          temperature: 43.8,
          severity: 'HIGH'
        };
        heatReports = [newReport, ...heatReports];
        renderHeatReports();
        updateMetrics();
        showToast('Heat Report for "South Harbor Container Terminal" added (HIGH)!', 'success');
      } else if (activityParam === 'modal_cooling_empty') {
        openModal(modalCooling, coolingErrorBanner);
      } else if (activityParam === 'modal_cooling' || activityParam === 'modal_cooling_filled') {
        openModal(modalCooling, coolingErrorBanner);
        document.getElementById('cooling-name-input').value = 'Harbor Point Emergency Cooling Pavilion';
        document.getElementById('cooling-address-input').value = '500 South Pier Road';
        document.getElementById('cooling-capacity-input').value = '200';
        document.getElementById('cooling-slots-input').value = '145';
      } else if (activityParam === 'modal_cooling_error') {
        openModal(modalCooling, coolingErrorBanner);
        document.getElementById('cooling-name-input').value = 'Downtown Annex Shelter';
        document.getElementById('cooling-address-input').value = '12 State Street';
        document.getElementById('cooling-capacity-input').value = '50';
        document.getElementById('cooling-slots-input').value = '90';
        coolingErrorBanner.textContent = 'HTTP 400 Bad Request: Available slots (90) cannot exceed capacity (50)';
        coolingErrorBanner.style.display = 'block';
      } else if (activityParam === 'submitted_cooling' || activityParam === 'toast_cooling') {
        const newLoc = {
          id: 6,
          name: 'Harbor Point Emergency Cooling Pavilion',
          address: '500 South Pier Road',
          capacity: 200,
          availableSlots: 145
        };
        coolingLocations = [newLoc, ...coolingLocations];
        renderCoolingLocations();
        updateMetrics();
        showToast('Cooling Center "Harbor Point Emergency Cooling Pavilion" registered successfully!', 'success');
      }
    }
  });
});
