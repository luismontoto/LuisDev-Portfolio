# LuisDev Portfolio

Portfolio personal y blog de Luis Montoto. Sitio web moderno construido con Astro, Tailwind CSS y TypeScript, desplegado en Vercel.

**URL:** [luismontoto.dev](https://luismontoto.dev)

---

## 🚀 Stack Tecnológico

- **Framework:** [Astro 7](https://astro.build/) - SSG con zero-JS por defecto y View Transitions
- **Estilos:** [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/) - Type-safe development
- **Deploy:** [Vercel](https://vercel.com/) - Hosting y CI/CD automático
- **Dominio:** [luismontoto.dev](https://luismontoto.dev)

---

## 📁 Estructura del Proyecto

```
LuisDev/
├── src/
│   ├── components/          # Componentes Astro reutilizables
│   │   ├── About.astro      # Sección "Sobre mí"
│   │   ├── Contact.astro    # Sección de contacto con enlaces
│   │   ├── Hero.astro       # Sección principal con animaciones
│   │   ├── Navbar.astro     # Navegación scroll-aware + móvil
│   │   ├── Projects.astro   # Listado de proyectos
│   │   └── Skills.astro     # Grid de habilidades técnicas
│   ├── content/
│   │   └── blog/            # Artículos del blog (Markdown)
│   │       ├── hello-world.md
│   │       └── wh40k-tournament-analyzer-architecture.md
│   ├── data/                # Datos tipados (single source of truth)
│   │   ├── cv.ts            # Información del CV/Resume
│   │   └── projects.ts      # Información de proyectos
│   ├── layouts/
│   │   └── Layout.astro     # Layout base con meta tags, SEO, View Transitions
│   ├── lib/
│   │   └── utils.ts         # Utilidades (reading time, etc.)
│   ├── pages/
│   │   ├── index.astro      # Página principal (portfolio)
│   │   ├── cv.astro         # Página de CV/Resume
│   │   └── blog/
│   │       ├── index.astro  # Listado de posts con filtros por tag
│   │       └── [slug].astro # Página individual de post
│   └── styles/
│       └── global.css       # Estilos globales
├── public/                  # Assets estáticos
├── astro.config.mjs         # Configuración de Astro
├── tailwind.config.mjs      # Configuración de Tailwind
├── vercel.json              # Configuración de Vercel
├── tsconfig.json            # Configuración de TypeScript
└── package.json             # Dependencias y scripts
```

---

## 🎨 Características

### Portfolio Principal
- **Hero Section** con animaciones de entrada (fade-in)
- **Sección About** con información personal
- **Proyectos** con datos tipados desde `src/data/projects.ts`
- **Skills** organizados por categorías
- **Contacto** con enlaces a redes sociales

### Blog
- Sistema de **Content Collections** con Astro
- **Filtrado por tags** (`/blog?tag=personal`)
- **Reading time** calculado automáticamente
- **SEO optimizado** con JSON-LD structured data
- **Markdown** para escribir posts

### CV/Resume
- Página dedicada en `/cv`
- Datos estructurados en `src/data/cv.ts`
- Experiencia, educación, habilidades e idiomas

### UX/UI
- **Dark theme** minimalista con acentos indigo
- **View Transitions** para navegación suave entre páginas
- **Navbar scroll-aware** (se oculta al hacer scroll down)
- **Mobile-first** con menú hamburguesa
- **Reduced motion** support para accesibilidad
- **Skip-to-content** link para lectores de pantalla

### SEO & Performance
- Meta tags Open Graph y Twitter Cards
- JSON-LD structured data (WebSite, BlogPosting)
- Canonical URLs
- Client prerendering experimental habilitado
- Zero-JS por defecto (solo hidratación donde es necesario)

---

## 🛠️ Comandos

Todos los comandos se ejecutan desde la raíz del proyecto:

| Comando | Descripción |
|---------|-------------|
| `npm install` | Instala dependencias |
| `npm run dev` | Inicia servidor local en `localhost:4321` |
| `npm run build` | Construye el sitio para producción en `./dist/` |
| `npm run preview` | Previsualiza el build localmente |
| `npx astro dev --background` | Inicia servidor en background |
| `npx astro dev stop` | Detiene el servidor en background |
| `npx astro dev status` | Muestra estado del servidor |

---

## 📝 Cómo Agregar Contenido

### Nuevo Post del Blog

Crea un archivo Markdown en `src/content/blog/`:

```markdown
---
title: "Título del Post"
description: "Breve descripción del post (50-160 caracteres)"
pubDate: 2026-07-13
tags: ["tag1", "tag2"]
---

Contenido del post en Markdown...
```

El sistema generará automáticamente:
- URL: `/blog/titulo-del-post`
- Reading time
- JSON-LD structured data
- Meta tags SEO

### Actualizar Proyectos

Edita `src/data/projects.ts`:

```typescript
{
  id: 'mi-proyecto',
  title: 'Nombre del Proyecto',
  description: 'Descripción del proyecto',
  tags: ['React', 'TypeScript', 'Node.js'],
  architecture: ['Punto 1', 'Punto 2'], // Opcional
  status: 'Live', // 'Live' | 'In Progress' | 'Planned'
  link: 'https://...', // Opcional
  repo: 'https://github.com/...', // Opcional
  year: 2026,
}
```

### Actualizar CV

Edita `src/data/cv.ts` con tu información:
- Experiencia laboral
- Educación
- Habilidades técnicas
- Idiomas

---

## 🌐 Deploy

El sitio se despliega automáticamente en **Vercel** al hacer push a la rama `master`.

### Configuración Inicial

1. Conecta el repositorio en [vercel.com](https://vercel.com)
2. Vercel detecta automáticamente Astro
3. Configura el dominio personalizado en **Settings → Domains**
4. Actualiza los DNS según las instrucciones de Vercel

### Variables de Entorno

No se requieren variables de entorno para el build estático.

---

## 📄 Licencia

MIT License - ver archivo [LICENSE](LICENSE) para detalles.

---

## 🤝 Contacto

- **Web:** [luismontoto.dev](https://luismontoto.dev)
- **Email:** luisirk.montoto@gmail.com
- **GitHub:** [github.com/luismontoto](https://github.com/luismontoto)

---

**Desarrollado con ❤️ usando Astro**
