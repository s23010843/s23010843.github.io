<script lang="ts">
  import WebsiteCard from './WebsiteCard.svelte';
  import WebsiteTable from './WebsiteTable.svelte';

  export let websites: Array<{
    title: string;
    url: string;
    category: string;
    icon: string;
    color: string;
  }>;

  // Group websites by category
  $: groupedWebsites = websites.reduce((acc, site) => {
    if (!acc[site.category]) {
      acc[site.category] = [];
    }
    acc[site.category].push(site);
    return acc;
  }, {} as Record<string, typeof websites>);
</script>

<main class="mt-16 pt-6 pb-8 min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    <!-- Card Grid View for Mobile/Tablet -->
    <div class="lg:hidden space-y-8 relative z-10">
      {#each Object.entries(groupedWebsites) as [category, sites]}
        <div>
          <h2 class="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
            <span class="w-1 h-8 bg-gradient-to-b from-teal-500 to-cyan-400 rounded-full"></span>
            {category}
          </h2>
          <div class="grid gap-4 sm:grid-cols-2">
            {#each sites as site}
              <WebsiteCard {site} />
            {/each}
          </div>
        </div>
      {/each}
    </div>

    <!-- Table View for Desktop -->
    <div class="hidden lg:block space-y-8 relative z-10">
      {#each Object.entries(groupedWebsites) as [category, sites]}
        <WebsiteTable {category} {sites} />
      {/each}
    </div>

    <!-- Footer Stats -->
    <div class="mt-12 text-center">
      <div class="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-md border border-gray-100">
        <span class="text-2xl">📌</span>
        <span class="text-gray-600 font-medium">
          Total: <span class="font-bold text-teal-600">{websites.length}</span> websites
        </span>
      </div>
    </div>
  </div>
</main>
