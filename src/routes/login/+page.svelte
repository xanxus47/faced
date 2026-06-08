<script>
  import { login, getSession } from '$lib/auth.js';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let showPassword = false;
  let status = 'idle'; // 'idle' | 'loading' | 'error'
  let errorMessage = '';

  onMount(() => {
    const checkAuth = () => {
      if (getSession()) {
        goto('/records', { replaceState: true });
      }
    };
    
    checkAuth();
    window.addEventListener('pageshow', checkAuth);
    
    return () => {
      window.removeEventListener('pageshow', checkAuth);
    };
  });

  async function handleLogin() {
    if (!email || !password) {
      status = 'error';
      errorMessage = 'Please fill in all fields.';
      return;
    }

    status = 'loading';
    errorMessage = '';

    const result = await login({ email, password });

    if (result.success) {
      // Redirect to records page on success
      window.location.href = '/records';
    } else {
      status = 'error';
      errorMessage = result.message || 'Login failed. Please check your credentials.';
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') handleLogin();
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-background p-6 font-sans">
  <div class="w-full max-w-md bg-card text-card-foreground border border-border rounded-xl shadow-lg overflow-hidden flex flex-col">

    <!-- Header -->
    <div class="bg-primary text-primary-foreground p-8 text-center flex flex-col items-center">
      <div class="inline-block bg-background/20 border border-background/30 text-primary-foreground text-[11px] font-bold tracking-widest px-3 py-1 rounded-full mb-4 uppercase">
        DSWD
      </div>
      <h1 class="text-2xl font-bold mb-1">Welcome back</h1>
      <p class="text-sm text-primary-foreground/80 m-0">Sign in to access FACED records</p>
    </div>

    <!-- Form -->
    <div class="p-8 flex flex-col gap-5">
      <div class="flex flex-col gap-2">
        <label for="email" class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email address</label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          bind:value={email}
          on:keydown={handleKeydown}
          disabled={status === 'loading'}
          autocomplete="email"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="password" class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Password</label>
        <div class="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            bind:value={password}
            on:keydown={handleKeydown}
            disabled={status === 'loading'}
            autocomplete="current-password"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors pr-10"
          />
          <button
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors opacity-70 hover:opacity-100 p-1"
            on:click={() => showPassword = !showPassword}
            tabindex="-1"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
      </div>

      {#if status === 'error'}
        <div class="bg-destructive/15 text-destructive border border-destructive/20 px-4 py-3 rounded-md text-sm font-medium" role="alert">
          ⚠ {errorMessage}
        </div>
      {/if}

      <button
        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 mt-2"
        on:click={handleLogin}
        disabled={status === 'loading'}
      >
        {#if status === 'loading'}
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Signing in…
        {:else}
          Sign In
        {/if}
      </button>
    </div>

    <!-- Footer -->
    <div class="p-6 text-center border-t border-border bg-muted/20">
      <p class="text-sm text-muted-foreground m-0">
        Don't have an account? 
        <a href="/register" class="font-semibold text-primary hover:underline hover:text-primary/80 transition-colors">
          Create one
        </a>
      </p>
    </div>

  </div>
</div>