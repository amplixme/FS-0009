/**
 * Seed de datos de demo (FS0009-71)
 *
 * Crea un dataset completo para demos y presentaciones:
 *   - 1 usuario ADMIN + 3 usuarios USER
 *   - 5 categorías
 *   - 15 posts (con cover images) sobre tecnología, desarrollo y carrera
 *   - 30 comentarios
 *
 * Idempotencia: limpia las tablas (comment -> post -> category -> user,
 * respetando el orden de las foreign keys) antes de reinsertar todo.
 * Puede correrse tantas veces como se quiera y siempre deja la BD en el
 * mismo estado conocido. OJO: elimina TODOS los datos existentes.
 *
 * Cover images y avatares: se usan URLs públicas de Unsplash
 * (images.unsplash.com) apuntando a fotos estables, servidas con parámetros
 * de optimización (?auto=format&fit=crop&w=1200&q=80). Se optó por hotlinking
 * en lugar de subir assets a Cloudinary para que el seed sea rápido,
 * determinista y no dependa de credenciales externas ni consuma cuota del
 * bucket. El frontend ya renderiza cualquier URL en <img src>, así que no
 * requiere cambios de código.
 *
 * Ejecutar con: pnpm run seed
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const DEMO_PASSWORD = "demo1234";

const unsplash = (photoId) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=1200&q=80`;

const daysAgo = (days) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);

const usersData = [
  {
    email: "admin@amplifix.dev",
    name: "Laura Giménez",
    role: "ADMIN",
    bio: "Editora jefe de Amplifix Blog. Organizo el calendario editorial y reviso cada publicación antes de salir al aire.",
    avatarUrl: unsplash("photo-1494790108377-be9c29b29330"),
  },
  {
    email: "david.perez@amplifix.dev",
    name: "David Pérez",
    role: "USER",
    bio: "Full-stack developer. Escribo sobre JavaScript, bases de datos y las lecciones que deja construir productos reales.",
    avatarUrl: unsplash("photo-1472099645785-5658abf4ff4e"),
  },
  {
    email: "marina.torres@amplifix.dev",
    name: "Marina Torres",
    role: "USER",
    bio: "Diseñadora UX/UI obsesionada con la tipografía y los sistemas de diseño escalables.",
    avatarUrl: unsplash("photo-1438761681033-6461ffad8d80"),
  },
  {
    email: "diego.fernandez@amplifix.dev",
    name: "Diego Fernández",
    role: "USER",
    bio: "Ingeniero DevOps. Automatizo pipelines, contenedores y todo lo que se pueda automatizar.",
    avatarUrl: unsplash("photo-1500648767791-00dcc994a43e"),
  },
];

const categoriesData = [
  { name: "Tecnología", slug: "tecnologia" },
  { name: "Diseño", slug: "diseno" },
  { name: "Programación", slug: "programacion" },
  { name: "DevOps", slug: "devops" },
  { name: "Opinión", slug: "opinion" },
];

const postsData = [
  {
    title: "TypeScript en 2026: ¿sigue valiendo la pena?",
    authorEmail: "david.perez@amplifix.dev",
    categorySlugs: ["programacion", "tecnologia"],
    published: true,
    createdAt: daysAgo(2),
    coverImage: unsplash("photo-1555066931-4365d14bab8c"),
    content: `Cada tanto vuelve el debate en Twitter: ¿TypeScript sigue siendo necesario o ya es burocracia innecesaria? Después de dos años migrando proyectos grandes, mi respuesta corta es sí, pero con matices.

El valor real no está en anotar todo, sino en que los tipos funcionan como documentación ejecutable. Cuando un equipo rota personas, el tipado estricto en los bordes del sistema —respuestas de API, payloads de formularios, resultados de servicios— evita la mayoría de los bugs tontos que antes solo aparecían en producción.

Mi recomendación práctica: activá strict desde el día uno en proyectos nuevos, y en proyectos heredados empezá por los tipos inferidos y avanzá hacia el dominio. No hace falta tipar el 100% del código para obtener el 90% del beneficio.`,
  },
  {
    title: "Patrones de diseño que realmente uso en producción",
    authorEmail: "admin@amplifix.dev",
    categorySlugs: ["programacion"],
    published: true,
    createdAt: daysAgo(5),
    coverImage: unsplash("photo-1504639725590-34d0984388bd"),
    content: `Los catálogos de patrones tienen 23 entradas y la mayoría de nosotros usamos cuatro o cinco en toda nuestra carrera. La diferencia entre un junior y un senior muchas veces no es conocer más patrones, sino saber cuándo NO aplicarlos.

Los que sí aparecen una y otra vez en mi código: Strategy para validar reglas de negocio que cambian por cliente, Adapter para aislar proveedores externos (Cloudinary, pasarelas de pago, emails), y Repository para mantener Prisma lejos de mis controladores.

El anti-patrón más caro que vi en producción fue un Singleton global de configuración que volvió imposible testear. Desde entonces, cualquier estado global pasa por inyección de dependencias, aunque sea manual y sin framework.`,
  },
  {
    title: "Clean Code: más allá del hype",
    authorEmail: "david.perez@amplifix.dev",
    categorySlugs: ["programacion", "opinion"],
    published: true,
    createdAt: daysAgo(9),
    coverImage: unsplash("photo-1517694712202-14dd9538aa97"),
    content: `Clean Code cumple casi dos décadas y sigue generando guerras santas. La realidad es que el libro tiene ideas excelentes envueltas en dogmas que envejecieron mal: funciones de una línea, comentarios prohibidos, abstracciones por deporte.

Lo que sobrevivió la prueba del tiempo es el espíritu: nombres que cuentan la historia, funciones que hacen una cosa, y código que se lee como prosa. Lo que conviene revisar es la obsesión por la fragmentación extrema, que en equipos reales produce rastros de llamadas imposibles de seguir.

Si tuviera que quedarme con una sola métrica de calidad de código, sería esta: ¿un desarrollador nuevo entiende este módulo sin preguntar a nadie en menos de treinta minutos? Todo lo demás son detalles de implementación de ese objetivo.`,
  },
  {
    title: "La revolución de la IA en el diseño editorial",
    authorEmail: "marina.torres@amplifix.dev",
    categorySlugs: ["diseno", "tecnologia"],
    published: true,
    createdAt: daysAgo(1),
    coverImage: unsplash("photo-1677442136019-21780ecad995"),
    content: `Las redacciones digitales están viviendo su mayor cambio desde la llegada del responsive design. Los modelos generativos ya no solo producen texto: proponen jerarquías visuales, variantes de portada y sistemas de grillas completas.

En nuestro flujo de trabajo, la IA se convirtió en una primera borradora visual. Genera diez direcciones creativas en minutos, y el diseñador elige, refina y aplica criterio editorial. El resultado no es menos trabajo humano: es trabajo humano mejor enfocado.

El riesgo es la homogeneización. Si todos usamos los mismos modelos con los mismos prompts, todos los blogs van a parecerse. La personalidad de marca —tipografía propia, fotografía con voz, ritmo editorial— se vuelve más valiosa, no menos.`,
  },
  {
    title: "Edge computing: qué significa para tu próxima app",
    authorEmail: "diego.fernandez@amplifix.dev",
    categorySlugs: ["tecnologia"],
    published: true,
    createdAt: daysAgo(7),
    coverImage: unsplash("photo-1558494949-ef010cbdcc31"),
    content: `Durante quince años optimizamos para llevar todo al "cloud". El edge invierte la pregunta: ¿por qué procesar en Virginia una petición que nace en Buenos Aires?

Ejecutar código en puntos de presencia cercanos al usuario cambia las expectativas de latencia. Validaciones de tokens, personalización de contenido, redirecciones y caching inteligente son candidatos perfectos: lógica liviana con impacto enorme en la experiencia.

Donde todavía no recomiendo edge es en lógica con base de datos transaccional pesada. La distancia entre el edge runtime y tu Postgres puede volver el roundtrip peor que un servidor centralizado. Como siempre en arquitectura: medir primero, migrar después.`,
  },
  {
    title: "Bases de datos vectoriales explicadas sin matemáticas",
    authorEmail: "david.perez@amplifix.dev",
    categorySlugs: ["tecnologia", "programacion"],
    published: true,
    createdAt: daysAgo(12),
    coverImage: unsplash("photo-1635070041078-e363dbe005cb"),
    content: `Todas las demos de IA mencionan embeddings y bases vectoriales, pero pocas explican qué son sin soltar una fórmula. La idea central es simple: convertir contenido en listas de números donde cosas parecidas quedan cerca entre sí.

Un post sobre Docker y otro sobre Kubernetes terminan con vectores vecinos aunque no compartan ni una palabra clave. Eso habilita búsquedas semánticas: encontrar "cómo desplegar mi app" cuando el texto dice "publicar en producción".

La noticia práctica de este año es que quizás no necesites una nueva base de datos. Postgres con pgvector maneja millones de vectores sin drama, y sumar otra tecnología al stack solo se justifica cuando el volumen o la latencia lo exigen.`,
  },
  {
    title: "CI/CD sin dolor: una guía práctica con GitHub Actions",
    authorEmail: "diego.fernandez@amplifix.dev",
    categorySlugs: ["devops"],
    published: true,
    createdAt: daysAgo(4),
    coverImage: unsplash("photo-1618401471353-b98afee0b2eb"),
    content: `Un pipeline de CI/CD no debería ser un artefacto sagrado que nadie entiende. Empezá simple: lint, tests, build. Si esos tres pasos corren en menos de diez minutos, el equipo los va a querer usar; si tardan media hora, los van a esquivar.

El segundo nivel es automatizar el deploy a staging en cada merge a dev. Nada disciplina más al equipo que ver sus cambios desplegados en minutos: las integraciones se hacen chicas y los bugs se detectan temprano.

Tres consejos que me ahorraron semanas: cacheá node_modules entre runs, usá matrices para testear versiones de Node que realmente soportás, y protegé los secretos con environments en lugar de variables sueltas del repo.`,
  },
  {
    title: "Docker Compose para entornos de desarrollo consistentes",
    authorEmail: "diego.fernandez@amplifix.dev",
    categorySlugs: ["devops"],
    published: true,
    createdAt: daysAgo(10),
    coverImage: unsplash("photo-1605745341112-85968b19335b"),
    content: `El clásico "en mi máquina funciona" casi siempre es un desajuste de versiones: tu Postgres local es 14, el de producción es 16, y nadie sabe cómo llegó ahí. Docker Compose mata el problema declarándolo todo en un archivo versionado.

Para un stack Node + Express + Prisma + Postgres, un docker-compose.yml de veinte líneas le da a cualquier colaborador una base de datos idéntica a la tuya con un solo comando. Sin instalar Postgres nativo, sin configurar usuarios a mano.

El error más común es montar el código dentro del contenedor sin volúmenes y reconstruir la imagen en cada cambio. Con bind mounts y hot reload, desarrollás exactamente igual que antes, pero sobre una infraestructura reproducible.`,
  },
  {
    title: "Monitoreo de aplicaciones Node.js: de cero a dashboards",
    authorEmail: "diego.fernandez@amplifix.dev",
    categorySlugs: ["devops"],
    published: false,
    createdAt: daysAgo(3),
    coverImage: unsplash("photo-1460925895917-afdab827c52f"),
    content: `Publicar una app sin monitoreo es manejar de noche con las luces apagadas. Este artículo recorre el camino mínimo viable: logs estructurados en JSON, métricas básicas de proceso y health checks que respondan rápido.

Después agregamos las capas serias: tracing distribuido para entender dónde se va el tiempo entre Express, Prisma y Postgres, y alertas que despierten a alguien solo cuando importa.

Borrador pendiente: falta la sección de comparación entre self-hosted (Grafana stack) y SaaS (Datadog, New Relic), y capturas del dashboard final.`,
  },
  {
    title: "Design systems: cómo escalar tu UI sin perder coherencia",
    authorEmail: "marina.torres@amplifix.dev",
    categorySlugs: ["diseno"],
    published: true,
    createdAt: daysAgo(6),
    coverImage: unsplash("photo-1561070791-2526d30994b5"),
    content: `Todo producto exitoso llega al mismo momento: tres equipos construyeron tres botones distintos y nadie sabe cuál es el oficial. Un design system no es una librería de componentes, es un acuerdo social sobre cómo se construye la interfaz.

Empezá por los tokens —colores, espaciados, tipografía— antes que por los componentes. Material Design 3 lo llama roles semánticos: no definís "verde primario" sino "color de acción principal". Cuando llegue el dark mode, agradecerán esa decisión.

El mantenimiento es el verdadero desafío. Un sistema que nadie actualiza se vuelve deuda técnica con bonita documentación. Asignar ownership explícito y un proceso de contribución claro vale más que cualquier herramienta.`,
  },
  {
    title: "Tipografía digital: elegir fuentes que mejoran la lectura",
    authorEmail: "marina.torres@amplifix.dev",
    categorySlugs: ["diseno"],
    published: true,
    createdAt: daysAgo(14),
    coverImage: unsplash("photo-1455390582262-044cdead277a"),
    content: `En un blog, el 90% de la experiencia es leer texto. Sin embargo, la tipografía suele ser la última decisión del proyecto, tomada a las 3 AM antes del launch. Error: es la inversión con mejor retorno de toda la interfaz.

Para lectura prolongada en pantalla buscá tres cosas: altura de x generosa, apertura en las letras (la "a" y la "g" de doble planta bien diferenciadas) y una familia con varios pesos para jerarquía sin cambiar de fuente.

Variables CSS y fuentes variables cambiaron las reglas: hoy podemos ajustar peso óptico según el tamaño del viewport sin cargar cinco archivos. Y no olviden font-display: swap, porque una fuente que bloquea el render es la forma más rápida de perder un lector antes del primer párrafo.`,
  },
  {
    title: "Dark mode bien hecho: contraste, color y accesibilidad",
    authorEmail: "admin@amplifix.dev",
    categorySlugs: ["diseno", "tecnologia"],
    published: true,
    createdAt: daysAgo(18),
    coverImage: unsplash("photo-1550684848-fac1c5b4e853"),
    content: `Invertir los colores no es hacer dark mode. Blanco sobre negro genera halos molestos en pantallas OLED; los sistemas maduros usan superficies gris oscuro elevadas, reservando el negro puro para los bordes del espectro.

El contraste también juega distinto: un azul que funciona sobre blanco pierde legibilidad sobre gris oscuro. Las marcas suelen necesitar variantes más claras de sus colores de acento para modo oscuro, y WCAG exige verificar ratios en ambos temas.

El detalle final que separa lo profesional del amateur: respetar prefers-color-scheme y ofrecer override manual persistido. El usuario decide, el sistema sugiere, y la transición entre temas no debe producir saltos de layout ni flashes de blanco.`,
  },
  {
    title: "Cinco años como dev: lo que aprendí (y lo que me hubiera gustado saber)",
    authorEmail: "david.perez@amplifix.dev",
    categorySlugs: ["opinion"],
    published: true,
    createdAt: daysAgo(8),
    coverImage: unsplash("photo-1486312338219-ce68d2c6f44d"),
    content: `Cuando empecé creía que senior era quien sabía más frameworks. Cinco años después, mi conclusión es incómoda: la mitad de lo que estudié tan duro quedó obsoleto, y lo que me dio resultado fueron habilidades que entonces me parecían secundarias.

Leer código ajeno resultó más importante que escribir código propio. Hacer preguntas en el momento correcto valió más que aparentar seguridad. Y comunicar estimaciones honestas —"no sé, necesito investigarlo"— construyó más confianza que cualquier feature entregada antes de tiempo.

Si pudiera volver atrás, le diría al David junior algo simple: dejá de coleccionar tutoriales y construí cosas feas pero terminadas. Un proyecto publicado enseña más que veinte cursos guardados en favoritos.`,
  },
  {
    title: "Cómo preparar una entrevista técnica sin memorizar respuestas",
    authorEmail: "admin@amplifix.dev",
    categorySlugs: ["opinion"],
    published: true,
    createdAt: daysAgo(16),
    coverImage: unsplash("photo-1521791136064-7986c2920216"),
    content: `Las listas de "100 preguntas de entrevistas" están rotas por diseño: premian la memoria a corto plazo justo en la habilidad que la entrevista quiere evaluar de verdad, que es pensar en voz alta ante problemas nuevos.

Lo que sí prepara: repasá los fundamentos que usás todos los días sin entenderlos del todo. Event loop de JavaScript, índices de base de datos, códigos HTTP. Son los temas que aparecen disfrazados en cualquier ejercicio, sea React o system design.

Y practicá el formato: resolver problemas en vivo, narrando decisiones y trade-offs. Cuarenta y cinco minutos de mock interview con un amigo valen más que una semana de LeetCode en silencio. La entrevista es una conversación; entrenala como tal.`,
  },
  {
    title: "¿Vale la pena contribuir al open source?",
    authorEmail: "marina.torres@amplifix.dev",
    categorySlugs: ["opinion", "programacion"],
    published: false,
    createdAt: daysAgo(1),
    coverImage: unsplash("photo-1522071820081-009f0129c71c"),
    content: `La pregunta de siempre, con la respuesta de siempre: depende de qué busques. Si esperás reconocimiento inmediato o ascensos automáticos, vas a frustrarte. Si buscás aprender código de producción y construir una reputación verificable, pocas inversiones rinden tanto.

El camino que recomiendo no es proponer features gigantes: es leer issues etiquetados como good first issue, arreglar bugs pequeños, mejorar documentación. Parece menor, pero es así como los mantainers aprenden a confiar en tus PRs más grandes.

Borrador: falta agregar mi experiencia con el primer PR aceptado y links a proyectos que buscan contributors en español.`,
  },
];

const commentsData = [
  { postTitle: "TypeScript en 2026: ¿sigue valiendo la pena?", authorEmail: "marina.torres@amplifix.dev", createdAt: daysAgo(1), content: "Como diseñadora lo noto en las handoffs: los tipos de la API son la única documentación que realmente se mantiene actualizada." },
  { postTitle: "TypeScript en 2026: ¿sigue valiendo la pena?", authorEmail: "diego.fernandez@amplifix.dev", createdAt: daysAgo(1), content: "Totalmente de acuerdo con tipar los bordes del sistema. En los internos dejamos que la inferencia trabaje y el code review lo agradece." },
  { postTitle: "Patrones de diseño que realmente uso en producción", authorEmail: "david.perez@amplifix.dev", createdAt: daysAgo(4), content: "Lo del Singleton de configuración me tocó vivirlo. Testear ese módulo era imposible hasta que lo refactorizamos con inyección manual." },
  { postTitle: "Patrones de diseño que realmente uso en producción", authorEmail: "marina.torres@amplifix.dev", createdAt: daysAgo(3), content: "Me encantó la idea de que saber cuándo NO aplicar patrones es lo que hace al senior. Va directo a mi lista de lecturas para el equipo." },
  { postTitle: "Clean Code: más allá del hype", authorEmail: "diego.fernandez@amplifix.dev", createdAt: daysAgo(8), content: "La métrica de los treinta minutos es oro. La voy a proponer como criterio en el próximo code review." },
  { postTitle: "Clean Code: más allá del hype", authorEmail: "marina.torres@amplifix.dev", createdAt: daysAgo(7), content: "Funciones de una línea prohibiendo comentarios... me acuerdo de esos tiempos con terror jaja. Buen equilibrio el que planteás acá." },
  { postTitle: "La revolución de la IA en el diseño editorial", authorEmail: "david.perez@amplifix.dev", createdAt: daysAgo(1), content: "Lo de la homogeneización me pareció el punto clave. Si todos usamos los mismos prompts, adiós personalidad de marca." },
  { postTitle: "La revolución de la IA en el diseño editorial", authorEmail: "diego.fernandez@amplifix.dev", createdAt: daysAgo(0), content: "Desde infra lo vemos igual: la IA acelera la iteración, pero el criterio editorial sigue siendo el cuello de botella bueno." },
  { postTitle: "Edge computing: qué significa para tu próxima app", authorEmail: "marina.torres@amplifix.dev", createdAt: daysAgo(6), content: "Excelente explicación. ¿Hiciste pruebas de latencia reales comparando edge functions contra un CDN tradicional?" },
  { postTitle: "Edge computing: qué significa para tu próxima app", authorEmail: "david.perez@amplifix.dev", createdAt: daysAgo(5), content: "El punto sobre Postgres y el roundtrip es muy válido. Nos pasó literalmente eso con un worker en edge consultando una DB en us-east." },
  { postTitle: "Bases de datos vectoriales explicadas sin matemáticas", authorEmail: "diego.fernandez@amplifix.dev", createdAt: daysAgo(11), content: "pgvector nos salvó de sumar otro servicio al stack. Millones de vectores corriendo sobre la misma instancia de Postgres, cero drama." },
  { postTitle: "Bases de datos vectoriales explicadas sin matemáticas", authorEmail: "marina.torres@amplifix.dev", createdAt: daysAgo(10), content: "Por fin una explicación de embeddings que puedo contarle a mi mamá. El ejemplo de Docker/Kubernetes lo clava." },
  { postTitle: "CI/CD sin dolor: una guía práctica con GitHub Actions", authorEmail: "david.perez@amplifix.dev", createdAt: daysAgo(3), content: "Lo del límite de diez minutos es real. Redujimos nuestro pipeline de 25 a 8 minutos cacheando dependencias y ahora nadie lo esquiva." },
  { postTitle: "CI/CD sin dolor: una guía práctica con GitHub Actions", authorEmail: "marina.torres@amplifix.dev", createdAt: daysAgo(2), content: "¿Tenés algún repo de ejemplo con la config de environments para secretos? Me interesa especialmente esa parte." },
  { postTitle: "Docker Compose para entornos de desarrollo consistentes", authorEmail: "david.perez@amplifix.dev", createdAt: daysAgo(9), content: "Sumaría un punto: healthchecks en los servicios para que el backend espere a que Postgres esté listo. Evita los crashes del primer arranque." },
  { postTitle: "Docker Compose para entornos de desarrollo consistentes", authorEmail: "marina.torres@amplifix.dev", createdAt: daysAgo(8), content: "Como alguien que rompió su Postgres local dos veces este año: este artículo debí leerlo antes." },
  { postTitle: "Monitoreo de aplicaciones Node.js: de cero a dashboards", authorEmail: "david.perez@amplifix.dev", createdAt: daysAgo(2), content: "Quedo atento a la versión final. El tema de tracing entre Express y Prisma es justo lo que estamos necesitando." },
  { postTitle: "Design systems: cómo escalar tu UI sin perder coherencia", authorEmail: "admin@amplifix.dev", createdAt: daysAgo(5), content: "\"Es un acuerdo social\" es la mejor definición de design system que leí. Lo vamos a citar en la próxima planning." },
  { postTitle: "Design systems: cómo escalar tu UI sin perder coherencia", authorEmail: "david.perez@amplifix.dev", createdAt: daysAgo(4), content: "Los tokens semánticos cambiaron nuestra vida cuando implementamos dark mode. Coincido: empiecen por ahí, no por los componentes." },
  { postTitle: "Tipografía digital: elegir fuentes que mejoran la lectura", authorEmail: "admin@amplifix.dev", createdAt: daysAgo(13), content: "Como editora confirmo: la legibilidad del cuerpo de texto decide si alguien termina el artículo o abandona a mitad del segundo párrafo." },
  { postTitle: "Tipografía digital: elegir fuentes que mejoran la lectura", authorEmail: "diego.fernandez@amplifix.dev", createdAt: daysAgo(12), content: "El dato de font-display: swap es de esos detalles que parecen menores y mueven la aguja del LCP completamente." },
  { postTitle: "Dark mode bien hecho: contraste, color y accesibilidad", authorEmail: "david.perez@amplifix.dev", createdAt: daysAgo(17), content: "Justo estamos evaluando esto en el blog. ¿Recomendás alguna herramienta para auditar los contrastes en ambos temas?" },
  { postTitle: "Dark mode bien hecho: contraste, color y accesibilidad", authorEmail: "diego.fernandez@amplifix.dev", createdAt: daysAgo(16), content: "El flash de blanco al cargar en dark mode es mi pet peeve #1. Buena señalización del detalle del override manual persistido." },
  { postTitle: "Cinco años como dev: lo que aprendí (y lo que me hubiera gustado saber)", authorEmail: "marina.torres@amplifix.dev", createdAt: daysAgo(7), content: "\"Construí cosas feas pero terminadas\" debería estar tatuado en cada bootcamp. Gran reflexión, David." },
  { postTitle: "Cinco años como dev: lo que aprendí (y lo que me hubiera gustado saber)", authorEmail: "admin@amplifix.dev", createdAt: daysAgo(6), content: "Lo de comunicar estimaciones honestas es aplicable a cualquier rol técnico. Excelente post, lo comparto con el equipo." },
  { postTitle: "Cómo preparar una entrevista técnica sin memorizar respuestas", authorEmail: "diego.fernandez@amplifix.dev", createdAt: daysAgo(15), content: "El consejo de repasar los fundamentos de todos los días es subestimado. En mi última entrevista cayó event loop y lo resolví gracias a haberlo estudiado de verdad." },
  { postTitle: "Cómo preparar una entrevista técnica sin memorizar respuestas", authorEmail: "marina.torres@amplifix.dev", createdAt: daysAgo(14), content: "Como entrevistadora confirmo: valoro mucho más a quien piensa en voz alta que al que recita la respuesta perfecta." },
  { postTitle: "¿Vale la pena contribuir al open source?", authorEmail: "admin@amplifix.dev", createdAt: daysAgo(0), content: "Esperando la versión final. Me interesa mucho la lista de proyectos que buscan contributors hispanohablantes." },
  { postTitle: "¿Vale la pena contribuir al open source?", authorEmail: "diego.fernandez@amplifix.dev", createdAt: daysAgo(0), content: "Arrancar por documentación es el mejor advice. Mi primer PR fue corregir un typo y hoy soy maintainer de esa librería." },
  { postTitle: "La revolución de la IA en el diseño editorial", authorEmail: "admin@amplifix.dev", createdAt: daysAgo(0), content: "Gran artículo, Marina. Lo destacamos en la newsletter interna de esta semana." },
];

async function main() {
  console.log("🌱 Iniciando seed de datos de demo...");

  await prisma.$transaction([
    prisma.comment.deleteMany(),
    prisma.post.deleteMany(),
    prisma.category.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);

  const usersByEmail = {};
  for (const userData of usersData) {
    const user = await prisma.user.create({
      data: { ...userData, password: hashedPassword },
    });
    usersByEmail[user.email] = user.id;
  }
  console.log(`   👥 ${usersData.length} usuarios creados`);

  const categoriesBySlug = {};
  for (const categoryData of categoriesData) {
    const category = await prisma.category.create({ data: categoryData });
    categoriesBySlug[category.slug] = category.id;
  }
  console.log(`   📁 ${categoriesData.length} categorías creadas`);

  const postIdsByTitle = {};
  for (const postData of postsData) {
    const { categorySlugs, authorEmail, ...data } = postData;
    const post = await prisma.post.create({
      data: {
        ...data,
        author: { connect: { email: authorEmail } },
        categories: {
          connect: categorySlugs.map((slug) => ({ slug })),
        },
      },
    });
    postIdsByTitle[post.title] = post.id;
  }
  console.log(`   📝 ${postsData.length} posts creados`);

  const commentsToCreate = commentsData.map((commentData) => ({
    content: commentData.content,
    createdAt: commentData.createdAt,
    postId: postIdsByTitle[commentData.postTitle],
    authorId: usersByEmail[commentData.authorEmail],
  }));
  await prisma.comment.createMany({ data: commentsToCreate });
  console.log(`   💬 ${commentsToCreate.length} comentarios creados`);

  const [users, categories, posts, comments] = await Promise.all([
    prisma.user.count(),
    prisma.category.count(),
    prisma.post.count(),
    prisma.comment.count(),
  ]);

  console.log("\n✅ Seed completado. Resumen:");
  console.log(`   Usuarios:     ${users} (${usersData.filter((u) => u.role === "ADMIN").length} admin, ${usersData.filter((u) => u.role === "USER").length} user)`);
  console.log(`   Categorías:   ${categories}`);
  console.log(`   Posts:        ${posts} (${postsData.filter((p) => p.published).length} publicados, ${postsData.filter((p) => !p.published).length} borradores)`);
  console.log(`   Comentarios:  ${comments}`);
  console.log(`\n🔑 Password de todos los usuarios demo: "${DEMO_PASSWORD}"`);
}

main()
  .catch((e) => {
    console.error("❌ Error ejecutando seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
