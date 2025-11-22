## Vue Error

Failed to parse source for import analysis because the content contains invalid JS syntax. Install @vitejs/plugin-vue to handle .vue files.

```sh
pnpm add @astrojs/vue
```

## Build Time Error
Old code (in `index.astro`):
```astro
<ReactWelcome/>
<AngularWelcome/>
```

Corrected code (in `index.astro`):
```astro
<ReactWelcome client:only="react" />
<AngularWelcome client:load />
```
