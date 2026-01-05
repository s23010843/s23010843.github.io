<script lang="ts">
  export let category: string;
  export let sites: Array<{
    title: string;
    url: string;
    category: string;
    icon: string;
    color: string;
  }>;
</script>

<div class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 relative z-10">
  <div class="bg-gradient-to-r from-teal-500 via-cyan-400 to-blue-500 px-5 py-3">
    <h2 class="text-lg font-bold text-white flex items-center gap-2">
      <span class="text-xl">
        <i class={sites[0].icon}></i>
      </span>
      {category}
    </h2>
  </div>
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead class="bg-gray-50 border-b border-gray-200">
        <tr>
          <th class="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
            Website
          </th>
          <th class="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
            URL
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        {#each sites as site}
          <tr class="hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50 transition-all duration-200 group">
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <span class={`text-lg group-hover:scale-110 transition-transform duration-200 ${site.color}`}>
                  <i class={site.icon}></i>
                </span>
                <span class="text-sm font-semibold text-gray-900">
                  {site.title}
                </span>
              </div>
            </td>
            <td class="px-4 py-3">
              <a
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                class="text-xs text-teal-600 hover:text-teal-700 font-mono bg-gray-50 px-2 py-1 rounded group-hover:bg-teal-50 transition-colors inline-flex items-center gap-1.5 hover:underline"
              >
                <span>{site.url}</span>
                <i class="fas fa-external-link-alt text-xs"></i>
              </a>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
