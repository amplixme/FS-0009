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
