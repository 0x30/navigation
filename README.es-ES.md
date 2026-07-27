# Navigation

Una potente librería de navegación para Vue & React que proporciona una experiencia de transición de páginas a nivel nativo.

## ✨ Características

- 🚀 **Experiencia Nativa** - Animaciones de transición de página fluidas, con soporte para gestos de retorno estilo iOS.
- 📦 **Soporte Multi-framework** - Compatible simultáneamente con Vue 3 y React.
- 🎯 **Sencillo de Usar** - Diseño de API basado en componentes, listo para usar.
- 🔄 **Caché de Páginas** - Gestión automática del estado de las páginas, manteniendo la posición del scroll al regresar.
- 🎨 **Altamente Personalizable** - Soporta animaciones de transición y estilos de página personalizados.

## 📚 Documentación

👉 **[Ver documentación completa](https://0x30.github.io/navigation/)**

## 📦 Paquetes

| Nombre del Paquete | Versión |
| --- | --- |
| [@0x30/navigation-core](packages/navigation-core) | [![npm](https://img.shields.io/npm/v/@0x30/navigation-core)](https://www.npmjs.com/package/@0x30/navigation-core) |
| [@0x30/navigation-vue](packages/navigation-vue) | [![npm](https://img.shields.io/npm/v/@0x30/navigation-vue)](https://www.npmjs.com/package/@0x30/navigation-vue) |
| [@0x30/navigation-react](packages/navigation-react) | [![npm](https://img.shields.io/npm/v/@0x30/navigation-react)](https://www.npmjs.com/package/@0x30/navigation-react) |

## 🚀 Inicio Rápido

### Vue

```bash
pnpm add @0x30/navigation-vue
```

```vue
<script setup lang="ts">
import { Navigator, Page } from '@0x30/navigation-vue'
import Home from './views/Home.vue'
</script>

<template>
  <Navigator>
    <Page>
      <Home />
    </Page>
  </Navigator>
</template>
```

### React

```bash
pnpm add @0x30/navigation-react
```

```tsx
import { Navigator, Page } from '@0x30/navigation-react'
import Home from './views/Home'

function App() {
  return (
    <Navigator>
      <Page>
        <Home />
      </Page>
    </Navigator>
  )
}
```

## 📖 Leer más

- [Inicio Rápido](https://0x30.github.io/navigation/guide/getting-started)
- [Navegación](https://0x30.github.io/navigation/guide/navigation)
- [Componentes de Página](https://0x30.github.io/navigation/guide/page-components)
- [Gesto de Retorno](https://0x30.github.io/navigation/guide/gesture)

## License

MIT
