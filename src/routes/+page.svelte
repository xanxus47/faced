<script lang="ts">
  const stats = [
    { value: '24/7', label: 'Monitoring' },
    { value: '12', label: 'Active responders' },
    { value: '3', label: 'Open incidents' },
  ];

  const modules = [
    {
      icon: '🚨',
      title: 'Incident reports',
      desc: 'Log and track disaster incidents in real time.',
      color: 'danger',
    },
    {
      icon: '👥',
      title: 'Responder tracking',
      desc: 'Monitor personnel deployment and availability.',
      color: 'info',
    },
    {
      icon: '📍',
      title: 'Resource mapping',
      desc: 'Track equipment, evacuation centers, and supplies.',
      color: 'success',
    },
    {
      icon: '📋',
      title: 'After-action reports',
      desc: 'Generate post-incident summaries and analysis.',
      color: 'warning',
    },
  ];

  const alerts = [
    {
      title: 'Flood advisory — Barangay Sta. Cruz',
      desc: 'Rising water levels reported near the creek. Monitoring team deployed.',
      time: 'Today, 08:42 AM',
      level: 'Level 2',
      status: 'danger',
    },
    {
      title: 'Road obstruction — National Highway',
      desc: 'Fallen tree blocking traffic. Clearing operations in progress.',
      time: 'Today, 07:15 AM',
      level: 'Level 1',
      status: 'warning',
    },
    {
      title: 'Drill completed — Barangay Poblacion',
      desc: 'Quarterly earthquake drill conducted successfully with 240 participants.',
      time: 'Yesterday, 03:00 PM',
      level: 'Resolved',
      status: 'success',
    },
  ];

  const navLinks = ['Alerts', 'Reports', 'Resources', 'Contact'];
</script>

<div class="page">
  <!-- Navbar -->
  <nav class="nav">
    <div class="nav-brand">
      <div class="nav-logo">🛡️</div>
      <span>MDRRMO Portal</span>
    </div>
    <div class="nav-links">
      {#each navLinks as link}
        <a href="/{link.toLowerCase()}">{link}</a>
      {/each}
      <a href="/faced" style="color: var(--primary); font-weight: bold;">FACED Form</a>
    </div>
  </nav>

  <!-- Hero -->
  <section class="hero">
    <div class="badge">🔴 System active</div>
    <h1>Municipal Disaster Risk Reduction<br />&amp; Management Office</h1>
    <p>
      Centralized platform for disaster monitoring, incident reporting,
      and emergency coordination for your municipality.
    </p>
    <div class="hero-btns">
      <a href="/incidents" class="btn-primary">View incident reports</a>
      <a href="/about" class="btn-secondary">Learn more</a>
    </div>
  </section>

  <!-- Stats -->
  <div class="stats">
    {#each stats as stat}
      <div class="stat">
        <div class="stat-num">{stat.value}</div>
        <div class="stat-label">{stat.label}</div>
      </div>
    {/each}
  </div>

  <!-- Modules -->
  <section class="section">
    <div class="section-label">Modules</div>
    <h2>What this system covers</h2>
    <p>Manage disaster preparedness and response operations from a single dashboard.</p>
    <div class="modules">
      {#each modules as mod}
        <div class="module-card module-{mod.color}">
          <div class="module-icon">{mod.icon}</div>
          <h3>{mod.title}</h3>
          <p>{mod.desc}</p>
        </div>
      {/each}
    </div>
  </section>

  <!-- Alerts -->
  <section class="section">
    <div class="section-label">Recent alerts</div>
    <h2>Latest activity</h2>
    <p>Most recent incidents and system notifications.</p>
    <div class="alerts">
      {#each alerts as alert}
        <div class="alert-item">
          <div class="alert-dot dot-{alert.status}"></div>
          <div class="alert-content">
            <h4>{alert.title}</h4>
            <p>{alert.desc}</p>
            <div class="alert-time">{alert.time} · {alert.level}</div>
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <p>MDRRMO Information System · Built with SvelteKit &amp; Cloudflare Pages</p>
  </footer>
</div>

<style>
  .page {
    font-family: 'JetBrains Mono Variable', monospace;
    max-width: 960px;
    margin: 0 auto;
    color: var(--foreground);
  }

  /* Nav */
  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 2rem;
    border-bottom: 1px solid var(--border);
    background: var(--background);
  }
  .nav-brand {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
    color: var(--foreground);
  }
  .nav-logo {
    width: 30px;
    height: 30px;
    border-radius: var(--radius-md);
    background: var(--destructive);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
  }
  .nav-links {
    display: flex;
    gap: 20px;
  }
  .nav-links a {
    font-size: 13px;
    color: var(--muted-foreground);
    text-decoration: none;
    transition: color 0.15s;
  }
  .nav-links a:hover {
    color: var(--foreground);
  }

  /* Hero */
  .hero {
    padding: 3rem 2rem 2.5rem;
    text-align: center;
    border-bottom: 1px solid var(--border);
    background: var(--background);
  }
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--secondary);
    color: var(--secondary-foreground);
    font-size: 12px;
    padding: 4px 12px;
    border-radius: var(--radius-sm);
    margin-bottom: 1.25rem;
    border: 1px solid var(--border);
  }
  .hero h1 {
    font-size: 26px;
    font-weight: 500;
    line-height: 1.35;
    margin-bottom: 0.75rem;
    color: var(--foreground);
  }
  .hero p {
    font-size: 15px;
    color: var(--muted-foreground);
    max-width: 480px;
    margin: 0 auto 1.75rem;
    line-height: 1.7;
  }
  .hero-btns {
    display: flex;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
  }
  .btn-primary {
    background: var(--primary);
    color: var(--primary-foreground);
    padding: 10px 22px;
    border-radius: var(--radius-md);
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    transition: opacity 0.15s;
    font-family: inherit;
  }
  .btn-primary:hover {
    opacity: 0.85;
  }
  .btn-secondary {
    background: var(--background);
    color: var(--foreground);
    border: 1px solid var(--border);
    padding: 10px 22px;
    border-radius: var(--radius-md);
    font-size: 14px;
    text-decoration: none;
    transition: background 0.15s;
    font-family: inherit;
  }
  .btn-secondary:hover {
    background: var(--accent);
  }

  /* Stats */
  .stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    padding: 1.5rem 2rem;
    border-bottom: 1px solid var(--border);
    background: var(--background);
  }
  .stat {
    background: var(--muted);
    border-radius: var(--radius-md);
    padding: 1rem;
    text-align: center;
    border: 1px solid var(--border);
  }
  .stat-num {
    font-size: 22px;
    font-weight: 500;
    color: var(--foreground);
  }
  .stat-label {
    font-size: 12px;
    color: var(--muted-foreground);
    margin-top: 3px;
  }

  /* Sections */
  .section {
    padding: 2rem;
    border-bottom: 1px solid var(--border);
    background: var(--background);
  }
  .section-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--muted-foreground);
    margin-bottom: 0.5rem;
  }
  .section h2 {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 0.4rem;
    color: var(--foreground);
  }
  .section > p {
    font-size: 14px;
    color: var(--muted-foreground);
    line-height: 1.7;
    margin-bottom: 1.5rem;
  }

  /* Modules */
  .modules {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 10px;
  }
  .module-card {
    background: var(--card);
    color: var(--card-foreground);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 1rem;
    transition: background 0.15s;
  }
  .module-card:hover {
    background: var(--accent);
  }
  .module-icon {
    font-size: 22px;
    margin-bottom: 10px;
  }
  .module-card h3 {
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 4px;
    color: var(--card-foreground);
  }
  .module-card p {
    font-size: 12px;
    color: var(--muted-foreground);
    line-height: 1.5;
    margin: 0;
  }
  .module-danger { border-top: 3px solid var(--destructive); }
  .module-info    { border-top: 3px solid var(--ring); }
  .module-success { border-top: 3px solid oklch(0.6 0.15 145); }
  .module-warning { border-top: 3px solid oklch(0.75 0.15 80); }

  /* Alerts */
  .alerts {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .alert-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    transition: background 0.15s;
  }
  .alert-item:hover {
    background: var(--accent);
  }
  .alert-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-top: 5px;
    flex-shrink: 0;
  }
  .dot-danger  { background: var(--destructive); }
  .dot-warning { background: oklch(0.75 0.15 80); }
  .dot-success { background: oklch(0.6 0.15 145); }
  .alert-content h4 {
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 2px;
    color: var(--card-foreground);
  }
  .alert-content p {
    font-size: 12px;
    color: var(--muted-foreground);
    margin: 0;
    line-height: 1.5;
  }
  .alert-time {
    font-size: 11px;
    color: var(--muted-foreground);
    margin-top: 4px;
  }

  /* Footer */
  .footer {
    padding: 1.5rem 2rem;
    text-align: center;
    background: var(--background);
  }
  .footer p {
    font-size: 12px;
    color: var(--muted-foreground);
  }
</style>