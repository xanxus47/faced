<script>
  import { onMount, tick } from 'svelte';
  import dswdLogo from '$lib/assets/dswd.png';

  const CHECK = '\u2714';

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

  function downloadPdf() {
    window.print();
  }

  /** @type {any} */
  let printRecord = null;

  /** @param {any} r @param {MouseEvent} e */
  async function printFacedForm(r, e) {
    e.stopPropagation();
    printRecord = r;
    await tick();
    window.print();
    setTimeout(() => { printRecord = null; }, 800);
  }
</script>

<div class="page">
  <!-- Page Header -->
  <div class="page-header">
    <div>
      <h1>FACED Records</h1>
      <p>Family Assistance Card in Emergencies and Disasters — Encoded Entries</p>
    </div>
    <div class="header-actions">
      <button class="btn-pdf" on:click={downloadPdf}>⬇ Download PDF</button>
      <a href="/faced" class="btn-new">+ New Entry</a>
    </div>
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
            <th></th>
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
              <td class="pdf-cell"><a href="/faced?id={r.id}" class="btn-row-edit" on:click|stopPropagation title="Edit Record">✏️ Edit</a></td>
              <td class="pdf-cell"><button class="btn-row-pdf" on:click={(e) => printFacedForm(r, e)} title="Download FACED PDF">📄 PDF</button></td>
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

{#if printRecord}
<div class="print-record-container">
  <div class="a4-page">
    <div class="form-border">
      <div class="header-section">
        <div class="logo-col"><img src={dswdLogo} alt="DSWD Logo" class="dswd-logo" /></div>
        <div class="title-col">
          <div class="rep">Republic of the Philippines</div>
          <div class="dept">Department of Social Welfare and Development</div>
          <div class="faced-title">FAMILY ASSISTANCE CARD IN EMERGENCIES AND DISASTERS (FACED)</div>
        </div>
        <div class="serial-col">
          <div class="not-for-sale">THIS CARD IS NOT FOR SALE<br/>BENEFICIARYS COPY</div>
          <div class="official-use">OFFICIAL USE ONLY</div>
          <div class="serial-box">
            <span class="serial-label">SERIAL NUMBER</span>
            <span class="serial-value">{printRecord.serial_number || ''}</span>
          </div>
        </div>
      </div>

      <div class="middle-content">
        <div class="section-title">LOCATION OF THE AFFECTED FAMILY</div>
        <div class="pgrid-2 pad-sm">
          <div class="pinput-row"><label>1. REGION</label><div class="pbox w-full">{printRecord.region || ''}</div></div>
          <div class="pinput-row"><label>4. DISTRICT</label><div class="pbox w-full">{printRecord.district || ''}</div></div>
          <div class="pinput-row"><label>2. PROVINCE</label><div class="pbox w-full">{printRecord.province || ''}</div></div>
          <div class="pinput-row"><label>5. BARANGAY</label><div class="pbox w-full">{printRecord.barangay || ''}</div></div>
          <div class="pinput-row"><label>3. CITY/MUNICIPALITY</label><div class="pbox w-full">{printRecord.city_municipality || ''}</div></div>
          <div class="pinput-row"><label>6. EVACUATION CENTER/<br/>EVACUATION SITE</label><div class="pbox w-full">{printRecord.evacuation_center || ''}</div></div>
        </div>

        <div class="section-title">HEAD OF THE FAMILY</div>
        <div class="pgrid-2 pad-sm pborder-bottom">
          <div class="pleft">
            <div class="pinput-row"><label>7. LAST NAME</label><div class="pbox w-full">{printRecord.last_name || ''}</div></div>
            <div class="pinput-row"><label>8. FIRST NAME</label><div class="pbox w-full">{printRecord.first_name || ''}</div></div>
            <div class="pinput-row"><label>9. MIDDLE NAME</label><div class="pbox w-full">{printRecord.middle_name || ''}</div></div>
            <div class="pinput-row"><label>10. NAME EXT.<br/><span class="psub">(Jr., Sr., I)</span></label><div class="pbox w-full">{printRecord.name_ext || ''}</div></div>
            <div class="pinput-row"><label>11. BIRTHDATE<br/><span class="psub">(Ex. 01 January 2021)</span></label><div class="pbox w-full">{printRecord.birthdate || ''}</div></div>
            <div class="pinput-row"><label>12. AGE</label><div class="pbox w-full">{printRecord.age || ''}</div></div>
            <div class="pinput-row"><label>13. BIRTHPLACE</label><div class="pbox w-full">{printRecord.birthplace || ''}</div></div>
            <div class="pinput-row">
              <label>14. SEX</label>
              <div style="display:flex;align-items:center;flex:1;gap:8px;">
                <div class="pcheck">{printRecord.sex === 'MALE' ? CHECK : ''}</div><span style="font-size:10px;">MALE</span>
                <div class="pcheck">{printRecord.sex === 'FEMALE' ? CHECK : ''}</div><span style="font-size:10px;">FEMALE</span>
              </div>
            </div>
          </div>
          <div class="pright">
            <div class="pinput-row"><label>15. CIVIL STATUS</label><div class="pbox w-full">{printRecord.civil_status || ''}</div></div>
            <div class="pinput-row"><label>16. MOTHER'S MAIDEN<br/>NAME</label><div class="pbox w-full">{printRecord.mothers_maiden_name || ''}</div></div>
            <div class="pinput-row"><label>17. RELIGION</label><div class="pbox w-full">{printRecord.religion || ''}</div></div>
            <div class="pinput-row"><label>18. OCCUPATION</label><div class="pbox w-full">{printRecord.occupation || ''}</div></div>
            <div class="pinput-row"><label>19. MONTHLY FAMILY<br/>NET INCOME</label><div class="pbox w-full">{printRecord.monthly_income || ''}</div></div>
            <div class="pinput-row"><label>20. ID CARD PRESENTED</label><div class="pbox w-full">{printRecord.id_card_presented || ''}</div></div>
            <div class="pinput-row"><label>21. ID CARD NUMBER</label><div class="pbox w-full">{printRecord.id_card_number || ''}</div></div>
            <div class="pinput-row" style="align-items:flex-start;">
              <label>22. CONTACT NUMBER</label>
              <div class="pbox pcontact flex-1" style="position:relative;height:28px;padding-top:10px;"><span class="ptiny">PRIMARY</span>{printRecord.contact_primary || ''}</div>
              <div class="pbox pcontact flex-1" style="position:relative;height:28px;padding-top:10px;"><span class="ptiny">ALTERNATE</span>{printRecord.contact_alternate || ''}</div>
            </div>
          </div>
        </div>

        <div class="pad-sm pborder-bottom" style="padding-top:4px;padding-bottom:6px;">
          <div style="display:flex;">
            <label style="font-weight:bold;font-size:10px;width:100px;flex-shrink:0;">23. PERMANENT<br/>ADDRESS</label>
            <div class="w-full">
              <div class="pbox w-full" style="height:24px;font-size:11px;padding:1px 4px;">
                {printRecord.addr_house_no || ''} {printRecord.addr_street || ''} {printRecord.addr_subdivision || ''} {printRecord.addr_barangay || ''} {printRecord.addr_city || ''} {printRecord.addr_province || ''} {printRecord.addr_zipcode || ''}
              </div>
              <div style="display:flex;justify-content:space-between;font-size:8px;font-style:italic;color:#4b5563;padding-top:2px;">
                <span>House/Block/Lot No.</span><span>Street</span><span>Subdivision/Village</span><span>Barangay</span><span>City/Municipality</span><span>Province</span><span>Zipcode</span>
              </div>
            </div>
          </div>
          <div style="display:flex;align-items:center;margin-top:6px;">
            <span class="pbold" style="font-size:10px;margin-right:16px;">24. OTHERS</span>
            <div class="pcheck" style="margin-right:4px;">{printRecord.is_4ps ? CHECK : ''}</div><span style="font-size:10px;margin-right:24px;">4Ps Beneficiary</span>
            <div class="pcheck" style="margin-right:4px;">{printRecord.ip_ethnicity ? CHECK : ''}</div><span style="font-size:10px;">IP- Type of Ethnicity <span style="border-bottom:1px solid black;display:inline-block;min-width:100px;text-align:center;">{printRecord.ip_ethnicity || ''}</span></span>
          </div>
        </div>

        <div class="section-title-light" style="text-align:left;padding-left:8px;">25. FAMILY INFORMATION</div>
        <table class="pfamily-table">
          <thead>
            <tr>
              <th style="width:20%;">FAMILY MEMBERS</th>
              <th style="width:15%;">RELATION TO<br/>FAMILY HEAD</th>
              <th style="width:10%;">BIRTHDATE</th>
              <th style="width:5%;">AGE</th>
              <th style="width:5%;">SEX</th>
              <th style="width:20%;">HIGHEST EDUCATIONAL<br/>ATTAINMENT</th>
              <th style="width:15%;">OCCUPATION</th>
              <th style="width:10%;">TYPE OF<br/>VULNERABILITY</th>
            </tr>
          </thead>
          <tbody>
            {#each Array.from({length: Math.max(15, (printRecord.family_members || []).length)}, (_, i) => (printRecord.family_members || [])[i] || {}) as m}
              <tr>
                <td>{m.name || ''}</td><td>{m.relation || ''}</td><td>{m.birthdate || ''}</td>
                <td>{m.age || ''}</td><td>{m.sex || ''}</td><td>{m.education || ''}</td>
                <td>{m.occupation || ''}</td><td>{m.vulnerability || ''}</td>
              </tr>
            {/each}
          </tbody>
        </table>

      </div>

      <div style="display:flex;margin-top:4px;flex-shrink:0;">
        <div style="flex:1;border:1px solid #1c3d70;margin-right:4px;">
          <div class="ppurple">26. HOUSE OWNERSHIP</div>
          <div style="display:flex;justify-content:center;gap:24px;padding:6px 0;font-size:10px;">
            <span><div class="pcheck" style="display:inline-flex;margin-right:4px;">{printRecord.house_ownership === 'Owner' ? CHECK : ''}</div>Owner</span>
            <span><div class="pcheck" style="display:inline-flex;margin-right:4px;">{printRecord.house_ownership === 'Renter' ? CHECK : ''}</div>Renter</span>
            <span><div class="pcheck" style="display:inline-flex;margin-right:4px;">{printRecord.house_ownership === 'Sharer' ? CHECK : ''}</div>Sharer</span>
          </div>
        </div>
        <div style="flex:1;border:1px solid #1c3d70;">
          <div class="ppurple">27. SHELTER DAMAGE CLASSIFICATION</div>
          <div style="display:flex;justify-content:center;gap:24px;padding:6px 0;font-size:10px;">
            <span><div class="pcheck" style="display:inline-flex;margin-right:4px;">{printRecord.shelter_damage === 'Partially Damaged' ? CHECK : ''}</div>Partially Damaged</span>
            <span><div class="pcheck" style="display:inline-flex;margin-right:4px;">{printRecord.shelter_damage === 'Totally Damaged' ? CHECK : ''}</div>Totally Damaged</span>
          </div>
        </div>
      </div>

      <div class="pbottom">
        <div style="display:flex;gap:20px;padding:0 10px;">
          <div style="width:80px;">
            <div style="width:80px;height:70px;border:1px solid #1c3d70;"></div>
            <div style="text-align:center;font-size:8px;font-weight:bold;margin-top:2px;border:1px solid #1c3d70;border-top:none;padding:2px;">RIGHT THUMBMARK</div>
          </div>
          <div style="flex:1;padding-top:20px;">
            <div style="display:flex;justify-content:space-between;">
              <div style="width:45%;text-align:center;"><div style="border-bottom:1px solid black;height:14px;margin-bottom:3px;"></div><div style="font-size:9px;">Signature/Thumbmark of Family Head</div></div>
              <div style="width:45%;text-align:center;"><div style="border-bottom:1px solid black;height:14px;margin-bottom:3px;"></div><div style="font-size:9px;">Name/Signature of Brgy. Captain</div></div>
            </div>
            <div style="display:flex;justify-content:space-between;margin-top:28px;">
              <div style="width:45%;text-align:center;"><div style="border-bottom:1px solid black;height:14px;margin-bottom:3px;"></div><div style="font-size:9px;">Date Registered</div></div>
              <div style="width:45%;text-align:center;"><div style="border-bottom:1px solid black;height:14px;margin-bottom:3px;"></div><div style="font-size:9px;">Name/Signature of LSWDO</div></div>
            </div>
          </div>
        </div>
        <div style="text-align:center;margin-top:30px;padding:0 20px 4px;">
          <div style="font-weight:bold;font-size:11px;margin-bottom:4px;">28. DATA PRIVACY DECLARATION</div>
          <div style="font-size:9px;font-style:italic;color:#4b5563;">All data and information indicated herein shall be used for identification purposes for the implementation of disaster risk reduction and management (DRRM) programs, projects and activities and its disclosure shall be in compliance to Republic Act 10173 (Data Privacy Act of 2012).</div>
        </div>
      </div>
    </div>
  </div>
</div>
{/if}

<style>
  .page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: sans-serif;
    color: #111827;
    background: #ffffff;
    color-scheme: light;
    min-height: 100%;
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

  .header-actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
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
  .btn-pdf {
    background: #16a34a;
    color: white;
    padding: 0.6rem 1.25rem;
    border-radius: 6px;
    font-weight: 600;
    font-size: 0.875rem;
    border: none;
    cursor: pointer;
    white-space: nowrap;
  }
  .btn-pdf:hover { background: #15803d; }
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

  .pdf-cell { width: 70px; }
  .btn-row-pdf {
    background: #7c3aed;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 3px 8px;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
  }
  .btn-row-pdf:hover { background: #6d28d9; }
  
  .btn-row-edit {
    display: inline-block;
    background: #eab308;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 3px 8px;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    text-decoration: none;
  }
  .btn-row-edit:hover { background: #ca8a04; }

  /* A4 Print template styles */
  .print-record-container { display: none; font-family: Arial, Helvetica, sans-serif; color: black; font-size: 10px; line-height: 1.2; margin: 0 auto; width: 100%; max-width: 210mm; }
  .a4-page { width: 100%; padding: 2mm; box-sizing: border-box; }
  .form-border { border: 2px solid #1c3d70; padding: 3px; display: flex; flex-direction: column; }
  .header-section { display: flex; justify-content: space-between; align-items: center; padding: 2px; margin-bottom: 2px; }
  .logo-col { width: 15%; text-align: center; }
  .dswd-logo { max-width: 50px; height: auto; }
  .title-col { width: 60%; text-align: center; }
  .rep { font-size: 11px; } .dept { font-size: 12px; font-weight: bold; margin-bottom: 2px; }
  .faced-title { font-size: 11px; font-weight: bold; color: #1c3d70; }
  .serial-col { width: 25%; text-align: right; }
  .not-for-sale { font-weight: bold; font-size: 10px; margin-bottom: 2px; }
  .official-use { background: #4b6382; color: white; text-align: center; font-weight: bold; font-size: 9px; padding: 2px; }
  .serial-box { border: 1px solid #1c3d70; height: 24px; position: relative; }
  .serial-label { position: absolute; top: 1px; left: 2px; font-size: 7px; }
  .serial-value { display: block; margin-top: 8px; text-align: center; font-weight: bold; font-size: 12px; }
  .section-title { background: #1c3d70; color: white; font-weight: 800; text-align: center; padding: 3px; font-size: 11px; margin-top: 3px; margin-bottom: 3px; }
  .section-title-light { color: #1c3d70; font-weight: 800; font-size: 11px; margin-top: 4px; margin-bottom: 2px; }
  .pgrid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 12px; }
  .pad-sm { padding: 4px 8px; } .pborder-bottom { border-bottom: 1px solid #1c3d70; padding-bottom: 8px; }
  .pleft, .pright { display: flex; flex-direction: column; gap: 2px; }
  .pinput-row { display: flex; align-items: center; margin-bottom: 2px; }
  .pinput-row label { font-weight: bold; font-size: 10px; width: 130px; flex-shrink: 0; }
  .pbox { border: 1px solid #6b7280; height: 18px; padding: 1px 4px; font-size: 11px; box-sizing: border-box; overflow: hidden; text-transform: uppercase; }
  .psub { font-size: 8px; font-weight: normal; font-style: italic; }
  .ptiny { position: absolute; top: 1px; left: 2px; font-size: 7px; font-style: italic; color: #6b7280; }
  .pcontact { position: relative; }
  .pcheck { width: 14px; height: 14px; border: 1px solid #1c3d70; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; }
  .pfamily-table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
  .pfamily-table th, .pfamily-table td { border: 1px solid #1c3d70; text-align: center; font-size: 9px; padding: 2px; }
  .pfamily-table th { background: #eef2f6; font-weight: bold; font-size: 8px; }
  .pfamily-table td { height: 18px; text-transform: uppercase; }
  .ppurple { background: #6b2154; color: white; text-align: center; font-weight: 800; font-size: 9px; padding: 3px; }
  .middle-content { overflow: hidden; flex: 1; }
  .pbottom { flex-shrink: 0; margin-top: 12px; }
  .w-full { width: 100%; } .flex-1 { flex: 1; }
  .pbold { font-weight: 800 !important; }

  @media print {
    @page { size: A4 portrait; margin: 8mm; }
    :global(body *) { visibility: hidden; }
    .print-record-container, .print-record-container * { 
      visibility: visible !important; 
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .print-record-container {
      display: block !important;
      position: fixed;
      left: 0; top: 0;
      width: 100%; height: 100%;
      background: white;
      margin: 0; padding: 0;
      max-width: none;
    }
    .a4-page { height: 100%; padding: 2mm; box-sizing: border-box; }
    .form-border { height: 100%; }

    .section-title { font-weight: 900 !important; color: black !important; background: transparent !important; }
    .section-title-light { font-weight: 900 !important; color: #1c3d70 !important; }
    .ppurple { font-weight: 900 !important; color: black !important; background: transparent !important; }
    .pfamily-table th { font-weight: 900 !important; color: black !important; }
    .pbold { font-weight: 900 !important; color: black !important; }
  }
</style>
