<script>
  import { register } from '$lib/auth.js';

  let email = '';
  let username = '';
  let password = '';
  let confirmPassword = '';
  let showPassword = false;
  let showConfirm = false;
  let status = 'idle'; // 'idle' | 'loading' | 'error' | 'success'
  let errorMessage = '';

  // Client-side validation
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
      // Redirect to records page on success
      window.location.href = '/records';
    } else {
      status = 'error';
      // Handle specific error codes from the API
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

  // Live password match indicator
  $: passwordMatch = confirmPassword.length > 0 && password === confirmPassword;
  $: passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;
</script>

<div class="auth-bg">
  <div class="auth-card">

    <!-- Header -->
    <div class="auth-header">
      <div class="dswd-badge">DSWD</div>
      <h1>Create account</h1>
      <p>Register to access the FACED system</p>
    </div>

    <!-- Form -->
    <div class="auth-form">
      <div class="field-group">
        <label for="email">Email address</label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          bind:value={email}
          on:keydown={handleKeydown}
          disabled={status === 'loading'}
          autocomplete="email"
        />
      </div>

      <div class="field-group">
        <label for="username">Username</label>
        <input
          id="username"
          type="text"
          placeholder="your_username"
          bind:value={username}
          on:keydown={handleKeydown}
          disabled={status === 'loading'}
          autocomplete="username"
        />
      </div>

      <div class="field-group">
        <label for="password">Password</label>
        <div class="password-wrap">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Min. 6 characters"
            bind:value={password}
            on:keydown={handleKeydown}
            disabled={status === 'loading'}
            autocomplete="new-password"
          />
          <button
            type="button"
            class="toggle-pw"
            on:click={() => showPassword = !showPassword}
            tabindex="-1"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
      </div>

      <div class="field-group">
        <label for="confirm">
          Confirm password
          {#if passwordMatch}
            <span class="match-tag match">✓ Match</span>
          {:else if passwordMismatch}
            <span class="match-tag mismatch">✗ No match</span>
          {/if}
        </label>
        <div class="password-wrap">
          <input
            id="confirm"
            type={showConfirm ? 'text' : 'password'}
            placeholder="Re-enter password"
            bind:value={confirmPassword}
            on:keydown={handleKeydown}
            disabled={status === 'loading'}
            autocomplete="new-password"
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
            {showConfirm ? '🙈' : '👁️'}
          </button>
        </div>
      </div>

      {#if status === 'error'}
        <div class="alert alert-error" role="alert">
          ⚠ {errorMessage}
        </div>
      {/if}

      <button
        class="btn-submit"
        on:click={handleRegister}
        disabled={status === 'loading'}
      >
        {#if status === 'loading'}
          <span class="spinner"></span> Creating account…
        {:else}
          Create Account
        {/if}
      </button>
    </div>

    <!-- Footer -->
    <div class="auth-footer">
      <p>Already have an account? <a href="/login">Sign in</a></p>
    </div>

  </div>
</div>

<style>
  .auth-bg {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--background);
    padding: 1.5rem;
    font-family: 'JetBrains Mono Variable', monospace;
  }

  .auth-card {
    width: 100%;
    max-width: 420px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    overflow: hidden;
  }

  /* Header */
  .auth-header {
    background: #1c3d70;
    color: white;
    padding: 2rem 2rem 1.5rem;
    text-align: center;
  }

  .dswd-badge {
    display: inline-block;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    padding: 3px 10px;
    border-radius: 999px;
    margin-bottom: 1rem;
  }

  .auth-header h1 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 0.35rem;
    color: white;
  }

  .auth-header p {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
  }

  /* Form body */
  .auth-form {
    padding: 1.75rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.1rem;
  }

  .field-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .field-group label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--muted-foreground);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .match-tag {
    font-size: 0.7rem;
    font-weight: 700;
    padding: 1px 6px;
    border-radius: 999px;
    text-transform: none;
    letter-spacing: 0;
  }
  .match-tag.match { background: #dcfce7; color: #166534; }
  .match-tag.mismatch { background: #fee2e2; color: #b91c1c; }

  .field-group input {
    padding: 0.65rem 0.85rem;
    border: 1px solid var(--input);
    border-radius: var(--radius-md);
    background: var(--background);
    color: var(--foreground);
    font-family: inherit;
    font-size: 0.9rem;
    transition: border-color 0.15s, outline 0.15s;
    width: 100%;
    box-sizing: border-box;
  }

  .field-group input:focus {
    outline: 2px solid #1c3d70;
    outline-offset: -1px;
    border-color: transparent;
  }

  .field-group input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .field-group input.input-ok {
    border-color: #16a34a;
  }

  .field-group input.input-err {
    border-color: #dc2626;
  }

  .password-wrap {
    position: relative;
  }

  .password-wrap input {
    padding-right: 2.75rem;
  }

  .toggle-pw {
    position: absolute;
    right: 0.6rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    line-height: 1;
    padding: 0.25rem;
    opacity: 0.6;
    transition: opacity 0.15s;
  }
  .toggle-pw:hover { opacity: 1; }

  /* Alert */
  .alert {
    padding: 0.65rem 0.85rem;
    border-radius: var(--radius-md);
    font-size: 0.85rem;
    font-weight: 500;
  }

  .alert-error {
    background: #fee2e2;
    color: #b91c1c;
    border: 1px solid #fca5a5;
  }

  /* Submit button */
  .btn-submit {
    background: #1c3d70;
    color: white;
    border: none;
    border-radius: var(--radius-md);
    padding: 0.75rem 1.5rem;
    font-family: inherit;
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: opacity 0.15s, transform 0.1s;
    width: 100%;
    margin-top: 0.25rem;
  }

  .btn-submit:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  .btn-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  /* Spinner inside button */
  .spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.4);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    display: inline-block;
    flex-shrink: 0;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Footer */
  .auth-footer {
    padding: 1rem 2rem 1.5rem;
    text-align: center;
    border-top: 1px solid var(--border);
  }

  .auth-footer p {
    font-size: 0.85rem;
    color: var(--muted-foreground);
    margin: 0;
  }

  .auth-footer a {
    color: #1c3d70;
    font-weight: 600;
    text-decoration: none;
  }

  .auth-footer a:hover {
    text-decoration: underline;
  }
</style>