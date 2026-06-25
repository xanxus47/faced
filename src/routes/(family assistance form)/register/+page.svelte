<script>
  import { register } from '$lib/auth.js';

  let email = '';
  let username = '';
  let password = '';
  let confirmPassword = '';
  let showPassword = false;
  let showConfirm = false;
  let status = 'idle';
  let errorMessage = '';

  function validate() {
    if (!email || !username || !password || !confirmPassword) {
      return 'Please fill in all fields.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Please enter a valid email address.';
    }
    if (username.length < 3) {
      return 'Username must be at least 3 characters.';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters.';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match.';
    }
    return null;
  }

  async function handleRegister() {
    const validationError = validate();
    if (validationError) {
      status = 'error';
      errorMessage = validationError;
      return;
    }

    status = 'loading';
    errorMessage = '';

    const result = await register({ email, username, password, confirmPassword });

    if (result.success) {
      window.location.href = '/records';
    } else {
      status = 'error';
      if (result.message?.toLowerCase().includes('already taken') || result.message?.toLowerCase().includes('409')) {
        errorMessage = 'That email or username is already taken.';
      } else {
        errorMessage = result.message || 'Registration failed. Please try again.';
      }
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Enter') handleRegister();
  }

  $: passwordMatch = confirmPassword.length > 0 && password === confirmPassword;
  $: passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;
</script>

<div class="register-page">
  <!-- Left Brand Panel -->
  <div class="brand-panel">
    <div class="brand-content">
      <div class="brand-logo">F</div>
      <h1 class="brand-title">FACED</h1>
      <p class="brand-sub">Family Assistance Card in<br/>Emergencies and Disasters</p>
      <div class="brand-divider"></div>
      <p class="brand-org">MDRRMO Information System</p>
    </div>

    <div class="brand-decoration d1"></div>
    <div class="brand-decoration d2"></div>
    <div class="brand-decoration d3"></div>
  </div>

  <!-- Right Form Panel -->
  <div class="form-panel">
    <div class="form-wrapper">
      <!-- Mobile logo -->
      <div class="mobile-logo">
        <div class="brand-logo sm">F</div>
        <span class="mobile-logo-text">FACED</span>
      </div>

      <div class="form-header">
        <h2 class="form-title">Create account</h2>
        <p class="form-subtitle">Register to access the FACED system</p>
      </div>

      <form class="form-body" on:submit|preventDefault={handleRegister}>
        <!-- Email -->
        <div class="field">
          <label for="email" class="field-label">Email address</label>
          <div class="input-wrap">
            <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              bind:value={email}
              on:keydown={handleKeydown}
              disabled={status === 'loading'}
              autocomplete="email"
              class="input"
            />
          </div>
        </div>

        <!-- Username -->
        <div class="field">
          <label for="username" class="field-label">Username</label>
          <div class="input-wrap">
            <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <input
              id="username"
              type="text"
              placeholder="your_username"
              bind:value={username}
              on:keydown={handleKeydown}
              disabled={status === 'loading'}
              autocomplete="username"
              class="input"
            />
          </div>
        </div>

        <!-- Password -->
        <div class="field">
          <label for="password" class="field-label">Password</label>
          <div class="input-wrap">
            <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 6 characters"
              bind:value={password}
              on:keydown={handleKeydown}
              disabled={status === 'loading'}
              autocomplete="new-password"
              class="input input-password"
            />
            <button
              type="button"
              class="toggle-pw"
              on:click={() => showPassword = !showPassword}
              tabindex="-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {#if showPassword}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>
              {:else}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
              {/if}
            </button>
          </div>
        </div>

        <!-- Confirm Password -->
        <div class="field">
          <label for="confirm" class="field-label">
            Confirm password
            {#if passwordMatch}
              <span class="match-tag match">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                Match
              </span>
            {:else if passwordMismatch}
              <span class="match-tag mismatch">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                No match
              </span>
            {/if}
          </label>
          <div class="input-wrap">
            <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/></svg>
            <input
              id="confirm"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Re-enter password"
              bind:value={confirmPassword}
              on:keydown={handleKeydown}
              disabled={status === 'loading'}
              autocomplete="new-password"
              class="input input-password"
              class:input-ok={passwordMatch}
              class:input-err={passwordMismatch}
            />
            <button
              type="button"
              class="toggle-pw"
              on:click={() => showConfirm = !showConfirm}
              tabindex="-1"
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              {#if showConfirm}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>
              {:else}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
              {/if}
            </button>
          </div>
        </div>

        <!-- Error -->
        {#if status === 'error'}
          <div class="error-msg" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            <span>{errorMessage}</span>
          </div>
        {/if}

        <!-- Submit -->
        <button
          type="submit"
          class="submit-btn"
          disabled={status === 'loading'}
        >
          {#if status === 'loading'}
            <span class="spinner"></span>
            Creating account...
          {:else}
            Create Account
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
          {/if}
        </button>
      </form>

      <div class="form-footer">
        <p>Already have an account? <a href="/login">Sign in</a></p>
      </div>

      <a href="/" class="back-link">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
        Back to homepage
      </a>
    </div>
  </div>
</div>

<style>
  /* ===== Page Layout ===== */
  .register-page {
    display: flex;
    min-height: 100vh;
    font-family: 'JetBrains Mono Variable', system-ui, sans-serif;
    color: var(--foreground);
    background: var(--background);
  }

  /* ===== Left Brand Panel ===== */
  .brand-panel {
    display: none;
    width: 45%;
    background: var(--primary);
    color: var(--primary-foreground);
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
  }
  .brand-content {
    position: relative;
    z-index: 2;
    text-align: center;
    padding: 3rem;
  }
  .brand-logo {
    width: 4rem;
    height: 4rem;
    background: var(--primary-foreground);
    color: var(--primary);
    border-radius: var(--radius-lg);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 1.75rem;
    margin-bottom: 1.5rem;
    letter-spacing: -0.02em;
  }
  .brand-logo.sm {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1.1rem;
    margin-bottom: 0;
    background: var(--primary);
    color: var(--primary-foreground);
    border-radius: var(--radius-md);
  }
  .brand-title {
    font-size: 2.25rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    margin: 0 0 0.5rem;
  }
  .brand-sub {
    font-size: 0.9rem;
    opacity: 0.75;
    line-height: 1.5;
    margin: 0;
  }
  .brand-divider {
    width: 3rem;
    height: 2px;
    background: var(--primary-foreground);
    opacity: 0.3;
    margin: 1.75rem auto;
    border-radius: 1px;
  }
  .brand-org {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    opacity: 0.5;
    margin: 0;
    font-weight: 600;
  }

  .brand-decoration {
    position: absolute;
    border-radius: 50%;
    background: var(--primary-foreground);
    pointer-events: none;
  }
  .d1 { width: 350px; height: 350px; opacity: 0.04; top: -100px; right: -80px; }
  .d2 { width: 250px; height: 250px; opacity: 0.03; bottom: -60px; left: -60px; }
  .d3 { width: 120px; height: 120px; opacity: 0.06; bottom: 25%; right: 15%; }

  /* ===== Right Form Panel ===== */
  .form-panel {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: var(--background);
    overflow-y: auto;
  }
  .form-wrapper {
    width: 100%;
    max-width: 420px;
  }

  /* Mobile Logo */
  .mobile-logo {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 2.5rem;
  }
  .mobile-logo-text {
    font-weight: 800;
    font-size: 1.1rem;
    letter-spacing: 0.1em;
    color: var(--foreground);
  }

  /* Form Header */
  .form-header {
    margin-bottom: 2rem;
  }
  .form-title {
    font-size: 1.75rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin: 0 0 0.4rem;
    color: var(--foreground);
  }
  .form-subtitle {
    font-size: 0.9rem;
    color: var(--muted-foreground);
    margin: 0;
  }

  /* Form Body */
  .form-body {
    display: flex;
    flex-direction: column;
    gap: 1.15rem;
  }

  /* Fields */
  .field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .field-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--muted-foreground);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  /* Match Tags */
  .match-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
    font-size: 0.65rem;
    font-weight: 700;
    padding: 0.1rem 0.45rem;
    border-radius: 9999px;
    text-transform: none;
    letter-spacing: 0;
    border: 1px solid transparent;
  }
  .match-tag.match {
    background: color-mix(in oklch, var(--primary) 12%, transparent);
    color: var(--primary);
    border-color: color-mix(in oklch, var(--primary) 25%, transparent);
  }
  .match-tag.mismatch {
    background: color-mix(in oklch, var(--destructive) 12%, transparent);
    color: var(--destructive);
    border-color: color-mix(in oklch, var(--destructive) 25%, transparent);
  }

  /* Inputs */
  .input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }
  .input-icon {
    position: absolute;
    left: 0.85rem;
    color: var(--muted-foreground);
    pointer-events: none;
    opacity: 0.5;
    flex-shrink: 0;
  }
  .input {
    width: 100%;
    height: 2.75rem;
    padding: 0 0.85rem 0 2.75rem;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--background);
    color: var(--foreground);
    font-size: 0.875rem;
    font-family: inherit;
    transition: border-color 0.15s, box-shadow 0.15s;
    outline: none;
    box-sizing: border-box;
  }
  .input::placeholder {
    color: var(--muted-foreground);
    opacity: 0.5;
  }
  .input:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--primary) 15%, transparent);
  }
  .input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .input-password {
    padding-right: 3rem;
  }
  .input.input-ok {
    border-color: var(--primary);
  }
  .input.input-err {
    border-color: var(--destructive);
  }

  /* Toggle Password */
  .toggle-pw {
    position: absolute;
    right: 0.65rem;
    background: none;
    border: none;
    padding: 0.3rem;
    cursor: pointer;
    color: var(--muted-foreground);
    opacity: 0.5;
    transition: opacity 0.15s, color 0.15s;
    display: flex;
    align-items: center;
    border-radius: var(--radius-sm);
  }
  .toggle-pw:hover {
    opacity: 1;
    color: var(--foreground);
  }

  /* Error */
  .error-msg {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: color-mix(in oklch, var(--destructive) 10%, transparent);
    color: var(--destructive);
    border: 1px solid color-mix(in oklch, var(--destructive) 25%, transparent);
    border-radius: var(--radius-md);
    font-size: 0.825rem;
    font-weight: 500;
    line-height: 1.4;
  }
  .error-msg svg {
    flex-shrink: 0;
  }

  /* Submit Button */
  .submit-btn {
    width: 100%;
    height: 2.85rem;
    margin-top: 0.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background: var(--primary);
    color: var(--primary-foreground);
    border: none;
    border-radius: var(--radius-md);
    font-size: 0.9rem;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    transition: opacity 0.15s, transform 0.15s;
  }
  .submit-btn:hover:not(:disabled) {
    opacity: 0.88;
    transform: translateY(-1px);
  }
  .submit-btn:active:not(:disabled) {
    transform: translateY(0);
  }
  .submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Spinner */
  .spinner {
    width: 1rem;
    height: 1rem;
    border: 2px solid var(--primary-foreground);
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Footer */
  .form-footer {
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border);
    text-align: center;
  }
  .form-footer p {
    font-size: 0.85rem;
    color: var(--muted-foreground);
    margin: 0;
  }
  .form-footer a {
    color: var(--primary);
    font-weight: 600;
    text-decoration: none;
    transition: opacity 0.15s;
  }
  .form-footer a:hover {
    opacity: 0.75;
    text-decoration: underline;
  }

  /* Back Link */
  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    margin-top: 1.25rem;
    font-size: 0.8rem;
    color: var(--muted-foreground);
    text-decoration: none;
    transition: color 0.15s;
  }
  .back-link:hover {
    color: var(--foreground);
  }

  /* ===== Responsive ===== */
  @media (min-width: 900px) {
    .brand-panel {
      display: flex;
    }
    .mobile-logo {
      display: none;
    }
  }
</style>