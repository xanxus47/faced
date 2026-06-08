<script>
  import { onMount } from 'svelte';

  /** @type {any[]} */
  let records = [];
  let loading = true;
  let fetchError = '';
  let searchQuery = '';
  let selectedBarangay = '';
  /** @type {number | null} */
  let expandedId = null;

  $: barangays = /** @type {string[]} */ ([...new Set(records.map((r) => r.barangay).filter(Boolean))].sort());

  $: filtered = records.filter((/** @type {any} */ r) => {
    const fullName = `${r.last_name ?? ''} ${r.first_name ?? ''} ${r.middle_name ?? ''}`.toLowerCase();
    const serial = (r.serial_number ?? '').toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchSearch = !searchQuery || fullName.includes(q) || serial.includes(q);
    const matchBarangay = !selectedBarangay || r.barangay === selectedBarangay;
    return matchSearch && matchBarangay;
  });

  onMount(async () => {
    try {
      const res = await fetch('/api/faced');
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      records = await res.json();
    } catch (e) {
      fetchError = e instanceof Error ? e.message : String(e);
    } finally {
      loading = false;
    }
  });

  /** @param {string | null} ts */
  function formatDate(ts) {
    if (!ts) return '—';
    return new Date(ts).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /** @param {any} r */
  function fullName(r) {
    return [r.last_name, r.first_name, r.middle_name, r.name_ext]
      .filter(Boolean)
      .join(' ') || '—';
  }

  /** @param {number} id */
  function toggleExpand(id) {
    expandedId = expandedId === id ? null : id;
  }

  /** @param {any} r */
  function memberCount(r) {
    return (r.family_members ?? []).length;
  }
</script>

<div class="page">
  <!-- Page Header -->
  <div class="page-header">
    <div>
      <h1>FACED Records</h1>
      <p>Family Assistance Card in Emergencies and Disasters — Encoded Entries</p>
    </div>
    <a href="/faced" class="btn-new">+ New Entry</a>
  </div>

  <!-- Stats -->
  {#if !loading && !fetchError}
    <div class="stats-row">
      <div class="stat-card">
        <span class="stat-num">{records.length}</span>
        <span class="stat-label">Total Records</span>
      </div>
      <div class="stat-card">
        <span class="stat-num">{records.filter((r) => r.shelter_damage === 'Totally Damaged').length}</span>
        <span class="stat-label">Totally Damaged</span>
      </div>
      <div class="stat-card">
        <span class="stat-num">{records.filter((r) => r.shelter_damage === 'Partially Damaged').length}</span>
        <span class="stat-label">Partially Damaged</span>
      </div>
      <div class="stat-card">
        <span class="stat-num">{records.filter((r) => r.is_4ps).length}</span>
        <span class="stat-label">4Ps Beneficiaries</span>
      </div>
    </div>
  {/if}

  <!-- Filters -->
  <div class="filters">
    <input
      type="text"
      placeholder="Search by name or serial number..."
      bind:value={searchQuery}
      class="search-input"
    />
    <select bind:value={selectedBarangay} class="filter-select">
      <option value="">All Barangays</option>
      {#each barangays as brgy}
        <option value={brgy}>{brgy}</option>
      {/each}
    </select>
    {#if searchQuery || selectedBarangay}
      <button class="btn-clear" on:click={() => { searchQuery = ''; selectedBarangay = ''; }}>
        Clear Filters
      </button>
    {/if}
  </div>

  <!-- States -->
  {#if loading}
    <div class="state-box">
      <div class="spinner"></div>
      <p>Loading records...</p>
    </div>
  {:else if fetchError}
    <div class="state-box error-box">
      <p>⚠ {fetchError}</p>
      <p class="hint">Make sure your <code>DATABASE_URL</code> is set in your environment.</p>
    </div>
  {:else if filtered.length === 0}
    <div class="state-box">
      <p>{records.length === 0 ? 'No records yet. Save a FACED form to get started.' : 'No records match your search.'}</p>
    </div>
  {:else}
    <!-- Table -->
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Serial No.</th>
            <th>Name (Family Head)</th>
            <th>Barangay</th>
            <th>Evacuation Center</th>
            <th>Members</th>
            <th>House</th>
            <th>Damage</th>
            <th>Date Saved</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {#each filtered as r, i}
            <tr class="data-row" class:expanded={expandedId === r.id} on:click={() => toggleExpand(r.id)}>
              <td class="num-cell">{i + 1}</td>
              <td class="mono">{r.serial_number || '—'}</td>
              <td class="name-cell">{fullName(r)}</td>
              <td>{r.barangay || '—'}</td>
              <td>{r.evacuation_center || '—'}</td>
              <td class="center">{memberCount(r)}</td>
              <td>
                {#if r.house_ownership}
                  <span class="badge house-{r.house_ownership.toLowerCase()}">{r.house_ownership}</span>
                {:else}
                  <span class="muted">—</span>
                {/if}
              </td>
              <td>
                {#if r.shelter_damage === 'Totally Damaged'}
                  <span class="badge damage-total">Total</span>
                {:else if r.shelter_damage === 'Partially Damaged'}
                  <span class="badge damage-partial">Partial</span>
                {:else}
                  <span class="muted">—</span>
                {/if}
              </td>
              <td class="date-cell">{formatDate(r.submitted_at)}</td>
              <td class="expand-cell">{expandedId === r.id ? '▲' : '▼'}</td>
            </tr>

            {#if expandedId === r.id}
              <tr class="detail-row">
                <td colspan="10">
                  <div class="detail-panel">

                    <!-- Two-column info -->
                    <div class="detail-grid">
                      <div class="detail-section">
                        <h3>Personal Info</h3>
                        <dl>
                          <div><dt>Birthdate</dt><dd>{r.birthdate || '—'}</dd></div>
                          <div><dt>Age</dt><dd>{r.age ?? '—'}</dd></div>
                          <div><dt>Sex</dt><dd>{r.sex || '—'}</dd></div>
                          <div><dt>Civil Status</dt><dd>{r.civil_status || '—'}</dd></div>
                          <div><dt>Religion</dt><dd>{r.religion || '—'}</dd></div>
                          <div><dt>Occupation</dt><dd>{r.occupation || '—'}</dd></div>
                          <div><dt>Monthly Income</dt><dd>{r.monthly_income || '—'}</dd></div>
                          <div><dt>4Ps Beneficiary</dt><dd>{r.is_4ps ? 'Yes' : 'No'}</dd></div>
                          <div><dt>IP Ethnicity</dt><dd>{r.ip_ethnicity || '—'}</dd></div>
                        </dl>
                      </div>
                      <div class="detail-section">
                        <h3>Contact & ID</h3>
                        <dl>
                          <div><dt>Mother's Maiden Name</dt><dd>{r.mothers_maiden_name || '—'}</dd></div>
                          <div><dt>Primary Contact</dt><dd>{r.contact_primary || '—'}</dd></div>
                          <div><dt>Alternate Contact</dt><dd>{r.contact_alternate || '—'}</dd></div>
                          <div><dt>ID Presented</dt><dd>{r.id_card_presented || '—'}</dd></div>
                          <div><dt>ID Number</dt><dd>{r.id_card_number || '—'}</dd></div>
                        </dl>
                        <h3 style="margin-top: 0.75rem;">Permanent Address</h3>
                        <dl>
                          <div><dt>House/Block/Lot</dt><dd>{r.addr_house_no || '—'}</dd></div>
                          <div><dt>Street</dt><dd>{r.addr_street || '—'}</dd></div>
                          <div><dt>Subdivision</dt><dd>{r.addr_subdivision || '—'}</dd></div>
                          <div><dt>Barangay</dt><dd>{r.addr_barangay || '—'}</dd></div>
                          <div><dt>City/Municipality</dt><dd>{r.addr_city || '—'}</dd></div>
                          <div><dt>Province</dt><dd>{r.addr_province || '—'}</dd></div>
                          <div><dt>Zipcode</dt><dd>{r.addr_zipcode || '—'}</dd></div>
                        </dl>
                      </div>
                    </div>

                    <!-- Family Members Table -->
                    {#if r.family_members && r.family_members.length > 0}
                      <div class="family-section">
                        <h3>Family Members ({r.family_members.length})</h3>
                        <table class="family-tbl">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Name</th>
                              <th>Relation</th>
                              <th>Birthdate</th>
                              <th>Age</th>
                              <th>Sex</th>
                              <th>Education</th>
                              <th>Occupation</th>
                              <th>Vulnerability</th>
                            </tr>
                          </thead>
                          <tbody>
                            {#each r.family_members as m}
                              <tr>
                                <td>{m.member_order}</td>
                                <td>{m.name || '—'}</td>
                                <td>{m.relation || '—'}</td>
                                <td>{m.birthdate || '—'}</td>
                                <td>{m.age ?? '—'}</td>
                                <td>{m.sex || '—'}</td>
                                <td>{m.education || '—'}</td>
                                <td>{m.occupation || '—'}</td>
                                <td>{m.vulnerability || '—'}</td>
                              </tr>
                            {/each}
                          </tbody>
                        </table>
                      </div>
                    {/if}

                  </div>
                </td>
              </tr>
            {/if}
          {/each}
        </tbody>
      </table>
    </div>
    <p class="results-count">Showing {filtered.length} of {records.length} record{records.length !== 1 ? 's' : ''}</p>
  {/if}
</div>

<style>
  .page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: sans-serif;
    color: #111827;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.5rem;
  }
  .page-header h1 {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1c3d70;
    margin: 0 0 0.25rem;
  }
  .page-header p {
    color: #6b7280;
    font-size: 0.875rem;
    margin: 0;
  }

  .btn-new {
    background: #2563eb;
    color: white;
    padding: 0.6rem 1.25rem;
    border-radius: 6px;
    font-weight: 600;
    font-size: 0.875rem;
    text-decoration: none;
    white-space: nowrap;
  }
  .btn-new:hover { background: #1d4ed8; }

  /* Stats */
  .stats-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  .stat-card {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .stat-num {
    font-size: 2rem;
    font-weight: 700;
    color: #1c3d70;
    line-height: 1;
  }
  .stat-label {
    font-size: 0.8rem;
    color: #6b7280;
  }

  /* Filters */
  .filters {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
    align-items: center;
    flex-wrap: wrap;
  }
  .search-input {
    flex: 1;
    min-width: 200px;
    padding: 0.5rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.875rem;
  }
  .filter-select {
    padding: 0.5rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.875rem;
    background: white;
  }
  .btn-clear {
    padding: 0.5rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    background: white;
    font-size: 0.875rem;
    cursor: pointer;
    color: #6b7280;
  }
  .btn-clear:hover { background: #f3f4f6; }

  /* State boxes */
  .state-box {
    text-align: center;
    padding: 4rem 2rem;
    color: #6b7280;
  }
  .error-box { color: #b91c1c; }
  .hint { font-size: 0.875rem; color: #9ca3af; margin-top: 0.5rem; }
  .spinner {
    width: 36px; height: 36px;
    border: 3px solid #e5e7eb;
    border-top-color: #1c3d70;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 1rem;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Table */
  .table-wrap {
    overflow-x: auto;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
  }
  thead th {
    background: #1c3d70;
    color: white;
    padding: 0.75rem 0.75rem;
    text-align: left;
    font-weight: 600;
    font-size: 0.8rem;
    white-space: nowrap;
  }
  .data-row {
    cursor: pointer;
    border-bottom: 1px solid #f3f4f6;
    transition: background 0.1s;
  }
  .data-row:hover { background: #f0f4ff; }
  .data-row.expanded { background: #eef2f7; }
  .data-row td {
    padding: 0.65rem 0.75rem;
    vertical-align: middle;
  }
  .num-cell { color: #9ca3af; font-size: 0.75rem; width: 40px; }
  .mono { font-family: monospace; font-size: 0.8rem; }
  .name-cell { font-weight: 600; text-transform: uppercase; }
  .center { text-align: center; }
  .date-cell { color: #6b7280; font-size: 0.8rem; white-space: nowrap; }
  .expand-cell { color: #9ca3af; text-align: center; width: 32px; }
  .muted { color: #9ca3af; }

  /* Badges */
  .badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
  }
  .damage-total { background: #fee2e2; color: #b91c1c; }
  .damage-partial { background: #fef3c7; color: #92400e; }
  .house-owner { background: #dcfce7; color: #166534; }
  .house-renter { background: #dbeafe; color: #1e40af; }
  .house-sharer { background: #f3e8ff; color: #6b21a8; }

  /* Detail panel */
  .detail-row td { padding: 0; background: #f8fafc; }
  .detail-panel {
    padding: 1.25rem 1.5rem;
    border-top: 2px solid #1c3d70;
  }
  .detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 1rem;
  }
  .detail-section h3 {
    font-size: 0.8rem;
    font-weight: 700;
    color: #1c3d70;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 0.5rem;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 0.25rem;
  }
  dl { margin: 0; }
  dl > div {
    display: flex;
    gap: 0.5rem;
    padding: 3px 0;
    font-size: 0.8rem;
    border-bottom: 1px solid #f3f4f6;
  }
  dt { color: #6b7280; min-width: 140px; flex-shrink: 0; }
  dd { margin: 0; font-weight: 500; text-transform: uppercase; word-break: break-word; }

  /* Family table inside detail */
  .family-section h3 {
    font-size: 0.8rem;
    font-weight: 700;
    color: #1c3d70;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 0.5rem;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 0.25rem;
  }
  .family-tbl {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.78rem;
  }
  .family-tbl th {
    background: #eef2f6;
    color: #374151;
    padding: 6px 8px;
    text-align: left;
    font-weight: 600;
    border: 1px solid #d1d5db;
  }
  .family-tbl td {
    padding: 5px 8px;
    border: 1px solid #e5e7eb;
    text-transform: uppercase;
  }
  .family-tbl tr:nth-child(even) td { background: #f9fafb; }

  .results-count {
    font-size: 0.8rem;
    color: #9ca3af;
    margin-top: 0.75rem;
    text-align: right;
  }
</style>
