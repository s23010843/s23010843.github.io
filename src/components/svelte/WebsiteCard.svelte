<script lang="ts">
  export let site: {
    title: string;
    url: string;
    category: string;
    icon: string;
    color: string;
  };
</script>

<div class="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-teal-200">
  <div class="p-6">
    <div class="flex items-start justify-between mb-3">
      <div class={`text-4xl ${site.color}`}>
        <i class={site.icon}></i>
      </div>
      <span class="px-2 py-1 text-xs font-medium text-teal-700 bg-teal-50 rounded-full">
        {site.category}
      </span>
    </div>
    <h3 class="text-lg font-bold text-gray-900 mb-2">
      {site.title}
    </h3>
    <a
      href={site.url}
      target="_blank"
      rel="noopener noreferrer"
      class="text-sm text-teal-600 hover:text-teal-700 font-medium break-all flex items-center gap-1 group"
    >
      <span>{site.url}</span>
      <i class="fas fa-external-link-alt text-xs opacity-0 group-hover:opacity-100 transition-opacity"></i>
    </a>
  </div>
</div>
