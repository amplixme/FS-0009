# Descripción del proyecto

Blog completo con comentarios. Node.js + Express + Prisma + PostgreSQL | Vite + React (JS) | JWT auth.

# Tecnologías utilizadas en este proyecto (Tech Stack)

| Componente | Tecnologías |
| :--- | :--- |
| **Backend** | Node.js + Express + JWT Auth |
| **ORM / Database** | Prisma + PostgreSQL |
| **Frontend** | Vite + React (JavaScript) |

# Prerrequisitos

- **Node.js >= 22** (verificá con `node --version`)
- **pnpm >= 9** (instalá con `npm install -g pnpm` si no lo tenés)

# Instrucciones de instalación

Clonar el repositorio:
```bash
git clone https://github.com/amplixme/FS-0009.git .
```

# Backend

1. Ingresar a la carpeta e instalar las dependencias:
```bash
cd BackEnd
pnpm install
```

2. Configurar un archivo `.env` con las variables de entorno necesarias (ver `BackEnd/.env.example` para referencia):
```bash
cp .env.example .env
# luego editar .env con tus valores reales
```

3. Aplicar las migraciones de Prisma y generar el cliente:
```bash
pnpm exec prisma migrate deploy
pnpm exec prisma generate
```

4. Iniciar el servidor:
```bash
pnpm run dev      # modo desarrollo con nodemon (watch)
pnpm start        # modo producción
```

> [!NOTE]
> Si modificás `schema.prisma` ejecutá estos comandos para que impacte en la BD:
> ```bash
> pnpm exec prisma migrate dev
> pnpm exec prisma generate
> ```

> [!NOTE]
> Para visualizar la BD con Prisma Studio:
> ```bash
> pnpm exec prisma studio
> ```

## Datos de demo (seed)

El script `BackEnd/prisma/seed.js` crea un dataset completo para demos y presentaciones:

| Recurso     | Cantidad | Detalle                                              |
| :---------- | :------- | :--------------------------------------------------- |
| Usuarios    | 4        | 1 ADMIN + 3 USER, con bio y avatar                   |
| Categorías  | 5        | Tecnología, Diseño, Programación, DevOps, Opinión    |
| Posts       | 15       | Con cover image; 13 publicados + 2 borradores        |
| Comentarios | 30       | Distribuidos entre posts y autores                   |

Ejecutarlo desde `BackEnd`:
```bash
pnpm run seed
```

- **Idempotente**: puede correrse múltiples veces; antes de insertar limpia las tablas (`comment` → `post` → `category` → `user`) y deja siempre la BD en el mismo estado.
- **Contenido realista en español** sobre tecnología, desarrollo y carrera (sin lorem ipsum).

> [!WARNING]
> El seed **elimina todos los datos existentes** de las tablas User, Post, Category y Comment antes de insertar. No lo corras sobre una base de datos con información que quieras conservar.

### Credenciales de los usuarios demo

Todos los usuarios comparten la misma contraseña para simplificar las demos:

| Email                          | Rol   | Nombre          |
| :----------------------------- | :---- | :-------------- |
| `admin@amplifix.dev`           | ADMIN | Laura Giménez   |
| `david.perez@amplifix.dev`     | USER  | David Pérez     |
| `marina.torres@amplifix.dev`   | USER  | Marina Torres   |
| `diego.fernandez@amplifix.dev` | USER  | Diego Fernández |

Contraseña: `demo1234`

> [!CAUTION]
> Estas credenciales son **solo para desarrollo/demo**. Nunca usarlas en producción.

### Sobre las imágenes (cover images y avatares)

Las imágenes del seed son **URLs públicas de [Unsplash](https://unsplash.com)** servidas desde `images.unsplash.com`, apuntando a fotos estables y con parámetros de optimización (`?auto=format&fit=crop&w=1200&q=80`).

Decisión técnica: se optó por *hotlinking* en lugar de subir los assets a Cloudinary (el servicio de uploads de la app) porque:

1. El seed queda **rápido y determinista**: no hace requests salientes ni consume cuota del bucket.
2. **No depende de credenciales** de Cloudinary para funcionar (solo de `DATABASE_URL`).
3. El frontend renderiza cualquier URL en `<img src>` (`PostCard.jsx`, `PostDetail.jsx`), así que no requiere cambios de código.

Si preferís imágenes propias, basta reemplazar las URLs por las de tu bucket de Cloudinary.

# URL Backend en Render

```bash
https://fs-0009.onrender.com
```

# Frontend

1. Ingresar a la carpeta e instalar las dependencias:
```bash
cd Frontend
pnpm install
```

2. Configurar un archivo `.env` con la URL base del Backend (ver `Frontend/.env.example`):
```bash
cp .env.example .env
# luego editar .env con tu valor real
```

3. Iniciar el servidor de desarrollo:
```bash
pnpm run dev      # Vite dev server con HMR
pnpm run build    # build de producción en dist/
pnpm run preview  # servir el build localmente
pnpm run lint     # ESLint
```

# URL Frotend en Vercel

```bash
https://fs-0009-front.vercel.app/
```

# Seguridad y Hardening contra Supply-Chain Attacks

Este proyecto usa **pnpm** con medidas de defensa contra ataques de supply-chain estilo Shai-Hulud (worm de NPM):

- **`minimumReleaseAge`**: bloquea paquetes publicados hace menos de N días, principal vector de infección del worm. BackEnd usa 7 días (10080 min); Frontend usa 4 días (5760 min) por excepción del fix de nanoid (ver [`docs/SUPPLY-CHAIN-HARDENING.md`](docs/SUPPLY-CHAIN-HARDENING.md)).
- **`allowBuilds` (allowlist explícita)**: solo los paquetes aprobados (`@prisma/engines`, `@prisma/client`, `prisma`, `bcrypt` en Backend; `esbuild` en Frontend) pueden ejecutar scripts `postinstall`. Cualquier otro script es bloqueado por defecto.
- **`pnpm audit`**: ejecutá regularmente para detectar vulnerabilidades conocidas.

> [!IMPORTANT]
> Para entender por qué `minimumReleaseAge` difiere entre BackEnd y Frontend, y el razonamiento completo detrás del fix de nanoid, leer [`docs/SUPPLY-CHAIN-HARDENING.md`](docs/SUPPLY-CHAIN-HARDENING.md).

Si necesitás instalar una dependencia publicada hace menos de X días (ej. un fix crítico), leé [`docs/SUPPLY-CHAIN-HARDENING.md`](docs/SUPPLY-CHAIN-HARDENING.md) para el procedimiento seguro.

Para verificar la integridad de los lockfiles después de instalar:
```bash
cd BackEnd && pnpm audit
cd Frontend && pnpm audit
```

# Documentación de la API

## 🔐 Autenticación

| Método | Endpoint | Descripción | Datos de entrada | Datos de salida | Errores conocidos |
|--------|----------|-------------|------------------|-----------------|-------------------|
| `GET` | `/api/health` | Retorna status OK | N/A | `{ status: 'ok' }` | N/A |
| `POST` | `/api/auth/register` | Registro de usuario | `nombre`, `email`, `contraseña` | Usuario registrado exitosamente | El nombre es requerido / El email es requerido / La contraseña es requerida |
| `POST` | `/api/auth/login` | Login de usuario | `email`, `contraseña` | `Token`, `User` | El email es requerido / La contraseña es requerida / `401`: Credenciales inválidas |

---

## 📝 Posts

| Método | Endpoint | Descripción | Datos de entrada | Datos de salida | Errores conocidos |
|--------|----------|-------------|------------------|-----------------|-------------------|
| `GET` | `/api/posts` | Devuelve todos los posts creados | N/A | `id`, `title`, `content`, `coverImage`, `published`, `createdAt`, `updatedAt`, `author: {id, name}`, `categories: [{id, name, slug}]`, `count: comments`, `total`, `page`, `totalPages` | N/A |
| `GET` | `/api/posts/:id` | Devuelve los datos del post por ID | `id` (parámetro) | `id`, `title`, `content`, `coverImage`, `published`, `createdAt`, `updatedAt`, `author: {name}`, `categories: [{id, name, slug}]` | `{ "message": "Post no encontrado" }` |
| `POST` | `/api/posts` | Creación de post | `title`, `content`, `coverImage`, `published`, `categoryIds`, `authorId` | `title`, `content`, `coverImage`, `authorId`, `published`, `categoryIds` | El título es requerido / El contenido es requerido / URL de imagen inválida |
| `PUT` | `/api/posts/:id` | Actualizar datos del post | `id`, `title`, `content`, `coverImage`, `published`, `categoryIds` | `id`, `title`, `content`, `coverImage`, `published`, `categoryIds` | El título no puede estar vacío / El contenido no puede estar vacío / URL de imagen inválida / `404`: Post no encontrado / `403`: No tienes permiso para modificar este post |
| `DELETE` | `/api/posts/:id` | Eliminar un post | `id` | `{ message: 'Post eliminado correctamente' }` | `404`: Post no encontrado / `403`: No tienes permiso para modificar este post |

---

## 🗂️ Categorías

| Método | Endpoint | Descripción | Datos de entrada | Datos de salida | Errores conocidos |
|--------|----------|-------------|------------------|-----------------|-------------------|
| `GET` | `/api/categories` | Devuelve todas las categorías | N/A | `id`, `name`, `slug` | N/A |
| `POST` | `/api/categories` | Creación de categoría *(requiere rol admin)* | `name`, `slug` | `name`, `slug` | El nombre es requerido / El slug es requerido / `400`: error prisma / `409`: Ya existe una categoría con ese nombre o slug |
| `PUT` | `/api/categories` | Actualizar datos de categoría *(requiere rol admin)* | `id`, `name`, `slug` | `id`, `name`, `slug` | El nombre no puede estar vacío / El slug no puede estar vacío / `400`: error prisma / `404`: Categoría no encontrada / `409`: Ya existe una categoría con ese nombre o slug |
| `DELETE` | `/api/categories/:id` | Eliminar una categoría por ID *(requiere rol admin)* | `id` | `{ message: "Categoría eliminada correctamente" }` | `404`: Categoría no encontrada / `409`: No se puede eliminar una categoría con posts asociados |

---

## 🖼️ Imágenes

| Método | Endpoint | Descripción | Datos de entrada | Datos de salida | Errores conocidos |
|--------|----------|-------------|------------------|-----------------|-------------------|
| `POST` | `/api/upload` | Subida de imagen | `req.file` (con multer) | `URL` | `400`: No se envió ninguna imagen |

---

## 💬 Comentarios

| Método | Endpoint | Descripción | Datos de entrada | Datos de salida | Errores conocidos |
|--------|----------|-------------|------------------|-----------------|-------------------|
| `POST` | `/api/posts/:postId/comments` | Creación de comentario en un post | `content`, `postId`, `authorId` | `autor`, `comentario` | `404`: Post no encontrado / El contenido es requerido |
| `GET` | `/api/posts/:postId/comments` | Devuelve todos los comentarios del post | `postId` | `id`, `content`, `authorId`, `createdAt`, `updateAt`, `author: { name }` | `404`: `{ message: 'Post no encontrado' }` |
| `PUT` | `/api/comments/:id` | Actualizar un comentario por ID | `id`, `content` | `id`, `content`, `createdAt`, `updateAt`, `authorId`, `author: { name }` | `403`: `{ message: 'No autorizado' }` / `404`: `{ message: 'Comentario no encontrado' }` |
| `DELETE` | `/api/comments/:id` | Eliminar un comentario *(requiere ser autor o ADMIN)* | `id` | `{ message: 'Comentario eliminado correctamente' }` | `403`: `{ message: 'No autorizado' }` / `404`: `{ message: 'Comentario no encontrado' }` |

---

## 👤 Usuarios

| Método | Endpoint | Descripción | Datos de entrada | Datos de salida | Errores conocidos |
|--------|----------|-------------|------------------|-----------------|-------------------|
| `GET` | `/api/users/:id` | Recuperar datos públicos de un usuario | `id` | `id`, `name`, `bio`, `avatarUrl`, `createdAt`, `postsCount` | `404`: Usuario no encontrado |
| `PUT` | `/api/users/me` | Actualizar datos del usuario *(ruta protegida)* | `name`, `bio`, `avatarUrl` | `{ message: "Perfil actualizado correctamente", user: updatedUser }` | — |

---

## 🛡️ Admin

| Método | Endpoint | Descripción | Datos de entrada | Datos de salida | Errores conocidos |
|--------|----------|-------------|------------------|-----------------|-------------------|
| `GET` | `/api/admin/stats` | Devuelve estadísticas generales | N/A | `totalUsers`, `totalPosts`, `totalComments`, `postToday`, `postByCategory` | N/A |
| `GET` | `/api/admin/users` | Devuelve todos los usuarios | N/A | `id`, `name`, `email`, `role`, `createdAt`, `postCount` | N/A |
| `POST` | `/api/admin/users` | Crear un usuario | `name`, `email`, `password`, `role` | `id`, `name`, `email`, `role`, `createdAt` | `409`: Ya existe un usuario con ese email |
| `PATCH` | `/api/admin/users/:id/role` | Actualizar rol del usuario (USER ↔ ADMIN) | `id` | `id`, `name`, `email`, `role`, `createdAt` | `403`: No podés cambiar tu propio rol |
| `PATCH` | `/api/admin/users/:id` | Actualizar datos del usuario por ID | `id`, `name`, `email`, `role` | `id`, `name`, `email`, `role`, `createdAt` | `409`: Ya existe un usuario con ese email |
| `DELETE` | `/api/admin/users/:id` | Eliminar un usuario por ID | `id` | `{ message: "Usuario eliminado correctamente" }` | `403`: No podés eliminar tu propia cuenta |
| `DELETE` | `/api/admin/posts/:id` | Eliminar un post por ID | `id` | `{ message: "Post eliminado correctamente" }` | N/A |
| `GET` | `/api/admin/comments` | Devuelve todos los comentarios | N/A | `id`, `content`, `createAt`, `author: { name }`, `post: { id, title }` | N/A |
| `DELETE` | `/api/admin/comments/:id` | Eliminar un comentario por ID | `id` | `{ message: "Comentario eliminado correctamente" }` | N/A |


# Estructura del proyecto

```
FS-0009/
├── docs/
│   └── SUPPLY-CHAIN-HARDENING.md # hardening y razonamiento de seguridad
├── BackEnd/
│   ├── pnpm-workspace.yaml       # hardening (allowBuilds, minimumReleaseAge)
│   ├── .env.example              # plantilla de variables de entorno
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.js                 # datos de demo (npm run seed)
│   │   └── migrations/
│   └── src/
│       ├── app.js
│       ├── controllers/
│       ├── services/
│       ├── routes/
│       ├── middlewares/
│       └── schema/
└── Frontend/
    ├── pnpm-workspace.yaml
    ├── .env.example
    ├── package.json
    ├── pnpm-lock.yaml
    └── src/
        ├── components/
        ├── pages/
        ├── services/
        └── context/
```
