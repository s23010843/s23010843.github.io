 <template>
  // <p>Bookmark this page to stay informed about the latest updates and developments on my projects.</p>
  // <p>Stay updated on the latest developments and projects by bookmarking this page. You can navigate through different sections using the menu above.</p>
  
      <div>
        <h1>{{ message }}</h1>

      </div>
    </template>

    <script setup>
    import { ref } from 'vue';

    const message = ref('Vue is working!');
    </script>

    <style scoped>
    h1 {
      color: green;
    }
    </style>
