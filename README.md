# Descripción del proyecto
Blog completo con comentarios. Node.js + Express + Prisma + PostgreSQL | Vite + React (JS) | JWT auth.

# Tecnologías utilizadas en este proyecto (Tech Stack)

| Componente | Tecnologías |
| :--- | :--- |
| **Backend** | Node.js + Express + JWT Auth |
| **ORM / Database** | Prisma + PostgreSQL |
| **Frontend** | Node.js + Express |

<h3> Instrucciones de instalación del proyecto: </h3>

Clonar el repositorio:
```bash
git clone https://github.com/amplixme/FS-0009.git .
```

# Backend

1. Ingresar a la carpeta e Instalar las dependencias:
```bash
cd BackeEnd
npm install
```
2. Configurar un archivo .env con las siguientes variables de entorno:

```bash
DATABASE_URL=
JWT_SECRET =
PORT=
```
3. Iniciar proyecto:
```bash
npm start
```
Tener en cuenta que para correr correctamente el proyecto se necesita tener instalado Node con la versión 22 o superior a la misma.

Para saber la versión de node instalada deberías correr el siguiente comando:

```bash
node --version
```

>[!NOTE]
> Si hago un cambio en el archivo schema.prisma ejecutar estos 2 comandos para que impacte en la BD:
```bash
npx prisma migrate dev
npx prisma generate
```

>[!NOTE]
> Si se quiere visualizar la BD se debe de ejecutar el siguiente comando dentro de la carpeta BackEnd:
```bash
npx prisma studio
```

# Frontend

1. Ingresar a la carpeta e Instalar las dependencias:
```bash
cd Frontend
npm install
```

2. Configurar un archivo .env con la siguiente variable de entorno. Ahí debe ir la BASE_URL del backend:
```bash
VITE_API_URL=
```

3. Iniciar proyecto:
```bash
npm run dev
```
