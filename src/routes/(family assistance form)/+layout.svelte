<script>
    import './layout.css';
    import { page } from '$app/stores';
    import { Button } from '$lib/components/ui/button';
    import {
        PanelLeftClose,
        PanelLeftOpen,
        ClipboardList,
        Database
    } from 'lucide-svelte';

    let { children } = $props();
    let isCollapsed = $state(false);

    function toggleSidebar() {
        isCollapsed = !isCollapsed;
    }

    const navItems = [
        { label: 'FACED Form', href: '/faced', icon: ClipboardList },
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
                    Refugeex
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

        <div class="border-t border-border p-2">
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