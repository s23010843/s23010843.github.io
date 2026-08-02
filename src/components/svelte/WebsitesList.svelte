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

<main
  class="mt-16 pt-8 pb-10 min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50"
>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    <!-- Card Grid View for Mobile/Tablet -->
    <div class="lg:hidden space-y-10">
      {#each Object.entries(groupedWebsites) as [category, sites]}
        <section
          class="rounded-3xl bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-lg p-6"
        >
          <h2
            class="flex items-center gap-3 text-2xl font-bold text-slate-800 mb-6"
          >
            <span
              class="h-10 w-1.5 rounded-full bg-gradient-to-b from-cyan-500 via-teal-500 to-emerald-500"
            ></span>
            {category}
          </h2>

          <div class="grid gap-5 sm:grid-cols-2">
            {#each sites as site}
              <div
                class="transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]"
              >
                <WebsiteCard {site} />
              </div>
            {/each}
          </div>
        </section>
      {/each}
    </div>

    <!-- Table View for Desktop -->
    <div class="hidden lg:block space-y-10">
      {#each Object.entries(groupedWebsites) as [category, sites]}
        <section
          class="overflow-hidden rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-lg"
        >
          <div
            class="border-b border-slate-200 bg-gradient-to-r from-cyan-50 via-white to-teal-50 px-8 py-5"
          >
            <h2 class="text-2xl font-bold tracking-tight text-slate-800">
              {category}
            </h2>
          </div>

          <div class="p-6">
            <WebsiteTable {category} {sites} />
          </div>
        </section>
      {/each}
    </div>

    <!-- Footer Stats -->
    <div class="mt-14 flex justify-center">
      <div
        class="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-xl px-8 py-4 shadow-lg transition-shadow duration-300 hover:shadow-xl"
      >
        <div class="flex items-center gap-3">
          <span class="text-3xl">📌</span>

          <span class="text-slate-600 text-lg">
            Total:
            <span class="font-bold text-cyan-600">
              {websites.length}
            </span>
            websites
          </span>
        </div>
      </div>
    </div>

  </div>
</main>