<script lang="ts">
  import { onMount } from 'svelte';

  let visible = $state(false);
  onMount(() => { visible = true; });

  const steps = [
    { num: '01', title: 'Login', desc: 'Authenticate securely with your MDRRMO credentials.' },
    { num: '02', title: 'Fill out FACED', desc: 'Enter family and disaster information via the guided digital form.' },
    { num: '03', title: 'Save & Print', desc: 'Records are saved to the database and can be exported as A4 PDFs instantly.' },
  ];

  const features = [
    {
      title: 'Digital Intake',
      desc: 'Guided step-by-step form designed for speed and accuracy during field operations.',
    },
    {
      title: 'A4 PDF Export',
      desc: 'Generate official DSWD-formatted documents ready for signature and filing.',
    },
    {
      title: 'Centralized Database',
      desc: 'All records stored securely in one place — searchable, filterable, and exportable.',
    },
    {
      title: 'Smart Automation',
      desc: 'Auto-calculated age fields, structured dropdowns, and validation to minimize errors.',
    },
  ];
</script>

<div class="landing" class:visible>
  <!-- Navbar -->
  <header class="nav">
    <div class="nav-inner">
      <a href="/" class="logo">
        <div class="logo-mark">F</div>
        <div class="logo-text">
          <span class="logo-name">FACED</span>
          <span class="logo-sub">MDRRMO System</span>
        </div>
      </a>
      <nav class="nav-links">
        <a href="/records" class="nav-link">Records</a>
        <a href="/login" class="nav-btn">Login</a>
      </nav>
    </div>
  </header>

  <main>
    <!-- Hero -->
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-content">
          <div class="hero-badge">Family Assistance Card System</div>
          <h1 class="hero-title">
            Disaster response<br/>data entry,<br/><span class="hero-accent">simplified.</span>
          </h1>
          <p class="hero-desc">
            A centralized platform for encoding, managing, and printing FACED forms. Built for LGU field workers and MDRRMO staff.
          </p>
          <div class="hero-actions">
            <a href="/login" class="btn-primary">
              Login to System
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
            <a href="/records" class="btn-secondary">Browse Records</a>
          </div>
        </div>
        <div class="hero-visual">
          <div class="hero-card card-1">
            <div class="card-dot"></div>
            <div class="card-line w60"></div>
            <div class="card-line w80"></div>
            <div class="card-line w40"></div>
          </div>
          <div class="hero-card card-2">
            <div class="card-header-bar">
              <div class="card-dot"></div>
              <div class="card-line-sm"></div>
            </div>
            <div class="card-rows">
              <div class="card-row"></div>
              <div class="card-row"></div>
              <div class="card-row"></div>
              <div class="card-row"></div>
            </div>
          </div>
          <div class="hero-card card-3">
            <div class="card-stat">
              <div class="card-stat-num">247</div>
              <div class="card-stat-label">Records</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="steps-section">
      <div class="section-inner">
        <div class="section-header">
          <span class="section-tag">How it works</span>
          <h2 class="section-title">Three simple steps</h2>
          <p class="section-desc">From login to printed document in minutes.</p>
        </div>
        <div class="steps-grid">
          {#each steps as step}
            <div class="step-card">
              <div class="step-num">{step.num}</div>
              <h3 class="step-title">{step.title}</h3>
              <p class="step-desc">{step.desc}</p>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="features-section">
      <div class="section-inner">
        <div class="section-header">
          <span class="section-tag">Features</span>
          <h2 class="section-title">Built for the field</h2>
          <p class="section-desc">Purpose-built tools for disaster aid documentation and administrative workflows.</p>
        </div>
        <div class="features-grid">
          {#each features as feat, i}
            <div class="feature-card">
              <div class="feature-index">{String(i + 1).padStart(2, '0')}</div>
              <h3 class="feature-title">{feat.title}</h3>
              <p class="feature-desc">{feat.desc}</p>
              <div class="feature-line"></div>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <div class="section-inner">
        <div class="cta-box">
          <h2 class="cta-title">Ready to start processing?</h2>
          <p class="cta-desc">Ensure accurate data collection and rapid response for affected families in your municipality.</p>
          <a href="/login" class="btn-primary btn-lg">
            Get Started
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>
      </div>
    </section>
  </main>

  <!-- Footer -->
  <footer class="footer">
    <div class="footer-inner">
      <span class="footer-brand">MDRRMO FACED System</span>
      <span class="footer-copy">&copy; {new Date().getFullYear()} All rights reserved.</span>
      <span class="footer-note">Built for local government units</span>
    </div>
  </footer>
</div>

<style>
  /* ===== Reset & Base ===== */
  .landing {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    font-family: 'JetBrains Mono Variable', system-ui, sans-serif;
    color: var(--foreground);
    background: var(--background);
    opacity: 0;
    transition: opacity 0.6s ease;
  }
  .landing.visible { opacity: 1; }

  /* ===== Navbar ===== */
  .nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--background);
    border-bottom: 1px solid var(--border);
  }
  .nav-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    height: 4rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    color: var(--foreground);
  }
  .logo-mark {
    width: 2.25rem;
    height: 2.25rem;
    background: var(--primary);
    color: var(--primary-foreground);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 1rem;
    letter-spacing: -0.02em;
  }
  .logo-text {
    display: flex;
    flex-direction: column;
    line-height: 1.15;
  }
  .logo-name {
    font-weight: 700;
    font-size: 0.95rem;
    letter-spacing: 0.04em;
  }
  .logo-sub {
    font-size: 0.65rem;
    color: var(--muted-foreground);
    letter-spacing: 0.02em;
  }
  .nav-links {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
  .nav-link {
    font-size: 0.85rem;
    color: var(--muted-foreground);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.15s;
  }
  .nav-link:hover { color: var(--foreground); }
  .nav-btn {
    font-size: 0.8rem;
    font-weight: 600;
    text-decoration: none;
    padding: 0.45rem 1.25rem;
    background: var(--primary);
    color: var(--primary-foreground);
    border-radius: var(--radius-md);
    transition: opacity 0.15s;
  }
  .nav-btn:hover { opacity: 0.88; }

  /* ===== Buttons ===== */
  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.75rem;
    background: var(--primary);
    color: var(--primary-foreground);
    border-radius: var(--radius-md);
    font-weight: 600;
    font-size: 0.9rem;
    text-decoration: none;
    transition: opacity 0.15s, transform 0.15s;
  }
  .btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
  .btn-primary.btn-lg { padding: 1rem 2.25rem; font-size: 1rem; }
  .btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.75rem;
    background: transparent;
    color: var(--foreground);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    font-weight: 600;
    font-size: 0.9rem;
    text-decoration: none;
    transition: background 0.15s, transform 0.15s;
  }
  .btn-secondary:hover { background: var(--muted); transform: translateY(-1px); }

  /* ===== Hero ===== */
  .hero {
    padding: 5rem 2rem 6rem;
    position: relative;
    overflow: hidden;
  }
  .hero::before {
    content: '';
    position: absolute;
    top: -120px;
    right: -80px;
    width: 500px;
    height: 500px;
    background: var(--primary);
    opacity: 0.04;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
  }
  .hero-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
  }
  .hero-badge {
    display: inline-block;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--primary);
    background: var(--muted);
    border: 1px solid var(--border);
    padding: 0.35rem 0.85rem;
    border-radius: 9999px;
    margin-bottom: 1.5rem;
  }
  .hero-title {
    font-size: clamp(2.2rem, 4vw, 3.5rem);
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.03em;
    margin: 0 0 1.25rem;
    color: var(--foreground);
  }
  .hero-accent {
    color: var(--primary);
  }
  .hero-desc {
    font-size: 1.05rem;
    color: var(--muted-foreground);
    line-height: 1.65;
    max-width: 460px;
    margin: 0 0 2rem;
  }
  .hero-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  /* Hero Visual — Abstract Card Stack */
  .hero-visual {
    position: relative;
    height: 380px;
    display: none;
  }
  .hero-card {
    position: absolute;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 1.25rem;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  }
  .card-1 {
    top: 0;
    left: 10%;
    width: 220px;
    animation: float1 6s ease-in-out infinite;
  }
  .card-2 {
    top: 80px;
    right: 0;
    width: 240px;
    animation: float2 7s ease-in-out infinite;
  }
  .card-3 {
    bottom: 20px;
    left: 25%;
    width: 160px;
    text-align: center;
    animation: float3 5s ease-in-out infinite;
  }
  .card-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--primary);
    margin-bottom: 0.75rem;
  }
  .card-line {
    height: 8px;
    background: var(--muted);
    border-radius: 4px;
    margin-bottom: 0.5rem;
  }
  .card-line.w60 { width: 60%; }
  .card-line.w80 { width: 80%; }
  .card-line.w40 { width: 40%; }
  .card-line-sm {
    height: 6px;
    width: 50px;
    background: var(--muted);
    border-radius: 3px;
  }
  .card-header-bar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--border);
  }
  .card-rows {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .card-row {
    height: 10px;
    background: var(--muted);
    border-radius: 4px;
  }
  .card-row:nth-child(odd) { width: 90%; }
  .card-row:nth-child(even) { width: 70%; }
  .card-stat-num {
    font-size: 2rem;
    font-weight: 800;
    color: var(--primary);
    line-height: 1;
  }
  .card-stat-label {
    font-size: 0.7rem;
    color: var(--muted-foreground);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-top: 0.25rem;
  }

  @keyframes float1 {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-12px); }
  }
  @keyframes float2 {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  @keyframes float3 {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  /* ===== Section Shared ===== */
  .section-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }
  .section-header {
    text-align: center;
    margin-bottom: 3.5rem;
  }
  .section-tag {
    display: inline-block;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--primary);
    margin-bottom: 0.75rem;
  }
  .section-title {
    font-size: clamp(1.75rem, 3vw, 2.5rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    margin: 0 0 0.75rem;
    color: var(--foreground);
  }
  .section-desc {
    font-size: 1rem;
    color: var(--muted-foreground);
    max-width: 520px;
    margin: 0 auto;
    line-height: 1.6;
  }

  /* ===== Steps ===== */
  .steps-section {
    padding: 5rem 2rem;
    background: var(--muted);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }
  .steps-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
  .step-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 2rem;
    position: relative;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .step-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0,0,0,0.08);
  }
  .step-num {
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--primary);
    opacity: 0.2;
    line-height: 1;
    margin-bottom: 1rem;
    letter-spacing: -0.04em;
  }
  .step-title {
    font-size: 1.1rem;
    font-weight: 700;
    margin: 0 0 0.5rem;
    color: var(--foreground);
  }
  .step-desc {
    font-size: 0.85rem;
    color: var(--muted-foreground);
    line-height: 1.6;
    margin: 0;
  }

  /* ===== Features ===== */
  .features-section {
    padding: 5rem 2rem;
  }
  .features-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  .feature-card {
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 2rem;
    position: relative;
    overflow: hidden;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .feature-card:hover {
    border-color: var(--primary);
    box-shadow: 0 0 0 1px var(--primary);
  }
  .feature-index {
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--primary);
    letter-spacing: 0.05em;
    margin-bottom: 0.75rem;
    opacity: 0.6;
  }
  .feature-title {
    font-size: 1.15rem;
    font-weight: 700;
    margin: 0 0 0.5rem;
    color: var(--foreground);
  }
  .feature-desc {
    font-size: 0.875rem;
    color: var(--muted-foreground);
    line-height: 1.6;
    margin: 0;
  }
  .feature-line {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--primary);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }
  .feature-card:hover .feature-line {
    transform: scaleX(1);
  }

  /* ===== CTA ===== */
  .cta-section {
    padding: 2rem 2rem 6rem;
  }
  .cta-box {
    background: var(--primary);
    color: var(--primary-foreground);
    border-radius: 1.5rem;
    padding: 4rem 2rem;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .cta-box::before {
    content: '';
    position: absolute;
    top: -60px;
    right: -60px;
    width: 300px;
    height: 300px;
    background: var(--primary-foreground);
    opacity: 0.06;
    border-radius: 50%;
    pointer-events: none;
  }
  .cta-box::after {
    content: '';
    position: absolute;
    bottom: -80px;
    left: -40px;
    width: 250px;
    height: 250px;
    background: var(--primary-foreground);
    opacity: 0.04;
    border-radius: 50%;
    pointer-events: none;
  }
  .cta-title {
    font-size: clamp(1.75rem, 3vw, 2.5rem);
    font-weight: 800;
    margin: 0 0 1rem;
    letter-spacing: -0.02em;
    position: relative;
    color: var(--primary-foreground);
  }
  .cta-desc {
    font-size: 1.05rem;
    opacity: 0.8;
    max-width: 500px;
    margin: 0 auto 2rem;
    line-height: 1.6;
    position: relative;
  }
  .cta-box .btn-primary {
    background: var(--primary-foreground);
    color: var(--primary);
    position: relative;
  }
  .cta-box .btn-primary:hover {
    opacity: 0.92;
  }

  /* ===== Footer ===== */
  .footer {
    border-top: 1px solid var(--border);
    padding: 1.5rem 2rem;
    margin-top: auto;
  }
  .footer-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.75rem;
    font-size: 0.78rem;
    color: var(--muted-foreground);
  }
  .footer-brand {
    font-weight: 600;
  }

  /* ===== Responsive ===== */
  @media (min-width: 768px) {
    .hero-visual { display: block; }
  }
  @media (max-width: 767px) {
    .hero-inner { grid-template-columns: 1fr; gap: 2rem; }
    .hero { padding: 3rem 1.5rem 4rem; }
    .steps-grid { grid-template-columns: 1fr; }
    .features-grid { grid-template-columns: 1fr; }
    .footer-inner { flex-direction: column; text-align: center; }
  }
  @media (max-width: 1024px) and (min-width: 768px) {
    .steps-grid { grid-template-columns: 1fr 1fr; }
    .step-card:last-child { grid-column: 1 / -1; max-width: 50%; margin: 0 auto; }
  }
</style>