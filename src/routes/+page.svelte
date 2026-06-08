<script lang="ts">
  const features = [
    {
      icon: '�',
      title: 'Digital Intake',
      desc: 'Quickly log family assistance information with an intuitive and responsive form interface.',
    },
    {
      icon: '�️',
      title: 'A4 PDF Ready',
      desc: 'Instantly generate perfectly formatted A4 documents for signature and physical filing.',
    },
    {
      icon: '�',
      title: 'Centralized Records',
      desc: 'Securely store, retrieve, update, and manage all family records in a single database.',
    },
    {
      icon: '⚡',
      title: 'Smart Automation',
      desc: 'Automated age calculation and structured inputs reduce human error during data entry.',
    },
  ];
</script>

<div class="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-primary-foreground">
  <!-- Navbar -->
  <header class="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="container flex h-16 max-w-screen-2xl items-center justify-between px-4 mx-auto">
      <div class="flex items-center gap-2 font-bold text-lg tracking-tight">
        <span class="text-xl">🛡️</span> MDRRMO <span class="text-muted-foreground font-normal">| FACED</span>
      </div>
      <nav class="flex items-center gap-4 sm:gap-6 text-sm font-medium">
        <a href="/records" class="text-muted-foreground hover:text-foreground transition-colors">Database Records</a>
        <a href="/faced" class="bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-sm hover:opacity-90 transition-opacity">
          Open Form
        </a>
      </nav>
    </div>
  </header>

  <main class="flex-1">
    <!-- Hero Section -->
    <section class="relative py-24 md:py-32 overflow-hidden">
      <!-- Background subtle gradient -->
      <div class="absolute inset-0 bg-gradient-to-b from-primary/5 to-background z-0 pointer-events-none"></div>
      
      <div class="container relative z-10 mx-auto px-4 text-center max-w-4xl flex flex-col items-center">
        <div class="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground mb-8 bg-background shadow-sm">
          ✨ System Version 2.0
        </div>
        
        <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
          Family Assistance <br class="hidden sm:block" /> 
          <span class="text-primary">Data Entry System</span>
        </h1>
        
        <p class="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
          Modernize your municipal disaster response. Efficiently collect, process, update, and print family assistance records with our centralized platform.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <a href="/faced" class="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-lg font-medium text-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
            <span>Create New Record</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
          <a href="/records" class="bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground border border-border px-8 py-3 rounded-lg font-medium text-lg transition-all shadow-sm flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
            <span>View Database</span>
          </a>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 px-4 bg-muted/30 border-t border-border">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold tracking-tight mb-4">Core Capabilities</h2>
          <p class="text-muted-foreground text-lg max-w-2xl mx-auto">
            Purpose-built tools designed to accelerate disaster aid documentation and streamline administrative workflows.
          </p>
        </div>
        
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {#each features as feature}
            <div class="bg-card text-card-foreground border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group">
              <div class="text-3xl mb-5 bg-primary/10 w-14 h-14 flex items-center justify-center rounded-lg group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 class="font-semibold text-lg mb-2">{feature.title}</h3>
              <p class="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <!-- Call to Action Banner -->
    <section class="py-24 px-4">
      <div class="max-w-4xl mx-auto bg-primary rounded-3xl p-8 md:p-12 text-center shadow-lg relative overflow-hidden">
        <div class="relative z-10 text-primary-foreground">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Ready to start processing?</h2>
          <p class="text-primary-foreground/80 mb-8 max-w-xl mx-auto text-lg">
            Ensure accurate data collection and rapid response for affected families in your municipality.
          </p>
          <a href="/faced" class="inline-block bg-background text-foreground hover:bg-accent hover:text-accent-foreground px-8 py-3 rounded-lg font-medium text-lg transition-colors shadow-sm">
            Open FACED Form Now
          </a>
        </div>
        <!-- Decorative bg elements -->
        <div class="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-64 h-64 bg-background/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-64 h-64 bg-background/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>
    </section>
  </main>

  <!-- Footer -->
  <footer class="border-t border-border py-8 text-center bg-background">
    <div class="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <p class="text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} MDRRMO - FACED Information System.
      </p>
      <div class="text-sm text-muted-foreground flex gap-4">
        <span>Built for local government units</span>
      </div>
    </div>
  </footer>
</div>