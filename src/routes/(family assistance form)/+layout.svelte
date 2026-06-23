<script>
    import './layout.css';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { Button } from '$lib/components/ui/button';
    import {
        PanelLeftClose,
        PanelLeftOpen,
        ClipboardList,
        Database,
        LogOut
    } from 'lucide-svelte';
    import { logout, getSession } from '$lib/auth.js';

    let { children } = $props();
    let isCollapsed = $state(false);
    let isLoggingOut = $state(false);
    let showLogoutConfirm = $state(false);

    onMount(() => {
        const checkAuth = () => {
            if (!getSession()) {
                goto('/login', { replaceState: true });
            }
        };
        
        checkAuth();
        window.addEventListener('pageshow', checkAuth);
        
        return () => {
            window.removeEventListener('pageshow', checkAuth);
        };
    });

    function toggleSidebar() {
        isCollapsed = !isCollapsed;
    }

    async function handleLogout() {
    isLoggingOut = true;
    await logout();
    window.location.replace('/'); // 👈 change this line
}

    function confirmLogout() {
        showLogoutConfirm = true;
    }

    function cancelLogout() {
        showLogoutConfirm = false;
    }

    const navItems = [
        { label: 'Faced Form', href: '/faced', icon: ClipboardList },
        { label: 'Records', href: '/records', icon: Database }
    ];
</script>

<div class="dark flex h-screen w-full overflow-hidden bg-background text-foreground">
    <aside
        class="group relative flex flex-col border-r border-border bg-sidebar transition-all duration-300 ease-in-out
        {isCollapsed ? 'w-[4.5rem]' : 'w-64'}"
    >
        <div class="flex h-16 items-center border-b border-border px-4">
            <div class="flex items-center gap-2 overflow-hidden whitespace-nowrap">
                <img
                    src="/favicon.png"
                    alt="Logo"
                    class="h-8 w-8 shrink-0 rounded-lg object-contain"
                />
                <span
                    class="font-sans text-lg font-bold tracking-tight text-sidebar-foreground transition-opacity duration-300
                    {isCollapsed ? 'hidden opacity-0' : 'block opacity-100'}"
                >
                    Faced Form
                </span>
            </div>
        </div>

        <nav class="flex-1 space-y-1 overflow-y-auto p-2 py-4">
            {#each navItems as item}
                {@const isActive = $page.url.pathname === item.href}
                <a
                    href={item.href}
                    class="relative flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium no-underline transition-all duration-150
                          {isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold'
                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground'}
                          {isCollapsed ? 'justify-center px-0' : ''}"
                >
                    {#if isActive}
                        <div class="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-primary"></div>
                    {/if}
                    <item.icon class="h-5 w-5 shrink-0" />
                    {#if !isCollapsed}
                        <span class="whitespace-nowrap">{item.label}</span>
                    {/if}
                </a>
            {/each}
        </nav>

        <div class="border-t border-border p-2 space-y-1">
            <!-- Logout button -->
            <button
                onclick={confirmLogout}
                disabled={isLoggingOut}
                class="relative flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-150
                       text-red-400/80 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed
                       {isCollapsed ? 'justify-center px-0' : ''}"
                title="Logout"
            >
                {#if isLoggingOut}
                    <span class="logout-spinner"></span>
                {:else}
                    <LogOut class="h-5 w-5 shrink-0" />
                {/if}
                {#if !isCollapsed}
                    <span class="whitespace-nowrap">
                        {isLoggingOut ? 'Logging out…' : 'Logout'}
                    </span>
                {/if}
            </button>

            <!-- Collapse toggle -->
            <Button
                variant="ghost"
                size="icon"
                class="w-full text-sidebar-foreground/50 hover:text-sidebar-foreground"
                onclick={toggleSidebar}
            >
                {#if isCollapsed}
                    <PanelLeftOpen class="h-5 w-5" />
                {:else}
                    <div class="flex w-full items-center gap-4 px-2">
                        <PanelLeftClose class="h-5 w-5" />
                        <span class="text-sm font-medium">Collapse Menu</span>
                    </div>
                {/if}
            </Button>
        </div>
    </aside>

    <main class="flex-1 overflow-y-auto bg-background transition-all duration-300">
        <div class="h-full w-full p-6 animate-in fade-in duration-500">
            {@render children()}
        </div>
    </main>
</div>

{#if showLogoutConfirm}
    <!-- Backdrop -->
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <!-- Modal -->
        <div class="w-full max-w-sm overflow-hidden rounded-xl bg-card border border-border shadow-2xl animate-in zoom-in-95 duration-200">
            <div class="p-6">
                <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                    <LogOut class="h-6 w-6" />
                </div>
                <h3 class="mb-2 text-lg font-bold text-card-foreground">Sign out of account?</h3>
                <p class="text-sm text-muted-foreground">
                    You will need to sign in again to access the FACED system and manage records.
                </p>
            </div>
            <div class="flex items-center gap-3 bg-muted/50 p-4 border-t border-border">
                <button
                    onclick={cancelLogout}
                    disabled={isLoggingOut}
                    class="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    onclick={handleLogout}
                    disabled={isLoggingOut}
                    class="flex-1 flex justify-center items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                    {#if isLoggingOut}
                        <span class="logout-spinner border-t-white"></span>
                        Signing out...
                    {:else}
                        Sign out
                    {/if}
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    .logout-spinner {
        width: 1.25rem;
        height: 1.25rem;
        border: 2px solid rgba(248, 113, 113, 0.3);
        border-top-color: rgb(248, 113, 113);
        border-radius: 50%;
        animation: spin 0.7s linear infinite;
        flex-shrink: 0;
        display: inline-block;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
</style>