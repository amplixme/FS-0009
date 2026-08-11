# Hardening contra Supply-Chain Attacks

## Contexto: El worm Shai-Hulud

**Shai-Hulud** es un worm de supply-chain que infecta paquetes del NPM registry.
Su mecanismo de propagacion es:

1. **Compromete paquetes ya publicados** y publica versiones trojanizadas.
2. Inyecta un script `postinstall` malicioso en el `package.json`.
3. Al instalarse, el `postinstall` descarga y ejecuta `bundle.js` (payload).
4. El payload usa `truffleHog` para buscar tokens y secretos en el filesystem.
5. Exfiltra los secretos (NPM_TOKEN, GITHUB_TOKEN, .env, etc.) a un webhook de `webhook.site`.
6. Usa los tokens robados para comprometer MAS paquetes y reiniciar el ciclo.

El vector de entrada mas comun es **paquetes publicados hace menos de 7 dias**,
porque los atacantes registran nombres parecidos o versiones nuevas de paquetes
legitimos y necesitan que los desarrolladores los instalen rapido antes de que
sean detectados.

## Hardening aplicado

Este proyecto usa **pnpm** con tres capas de defensa:

### 1. minimumReleaseAge (edad minima de paquetes)

Bloquea cualquier paquete publicado hace menos de N minutos.

| Carpeta    | minimumReleaseAge | Equivalente | Razon                    |
| :--------- | :---------------- | :---------- | :----------------------- |
| BackEnd    | 10080             | 7 dias      | Sin conflictos actuales  |
| Frontend   | 5760              | 4 dias      | Ver "Excepcion nanoid"   |

**Por que 7 dias en BackEnd?** Es la ventana tipica en la que se detectan y
retiran paquetes maliciosos del NPM registry.

**Por que 4 dias en Frontend?** Por el conflicto con el fix de nanoid (ver abajo).
Sigue bloqueando paquetes frescos (vector principal de Shai-Hulud) pero permite
el fix de nanoid@3.3.17 que tiene 4.5 dias de antiguedad.

### 2. allowBuilds (allowlist de scripts postinstall)

Por defecto pnpm bloquea TODOS los scripts `postinstall`, `preinstall`, etc.
Solo los paquetes listados en `allowBuilds` pueden ejecutarlos:

**BackEnd** (`pnpm-workspace.yaml`):
```yaml
allowBuilds:
  "@prisma/engines": true   # genera el cliente de Prisma
  "@prisma/client": true   # genera el cliente de Prisma
  prisma: true              # genera el CLI de Prisma
  bcrypt: true              # compila bindings nativos de C++
```

**Frontend** (`pnpm-workspace.yaml`):
```yaml
allowBuilds:
  esbuild: true             # compila el bundler nativo de esbuild
```

Si un paquete comprometido intenta ejecutar un `postinstall` que no este en
esta lista, pnpm lo bloquea automaticamente. **Este es el cerco principal
contra Shai-Hulud**: el worm no puede ejecutar su payload.

### 3. pnpm audit

`pnpm audit` verifica contra la base de datos de advisories del NPM.
Ambos proyectos (BackEnd y Frontend) pasan limpios:

```bash
cd BackEnd && pnpm audit   # No known vulnerabilities found
cd Frontend && pnpm audit  # No known vulnerabilities found
```

## Excepcion nanoid: por que minimumReleaseAge es 4 dias en Frontend

### El problema

`pnpm audit` detecto 1 vulnerabilidad **HIGH** en Frontend:

| Campo       | Valor                                                    |
| :---------- | :------------------------------------------------------- |
| Paquete     | `nanoid` < 3.3.17                                        |
| Tipo        | DoS (Denegacion de Servicio)                             |
| Advisory    | [GHSA-2v37-7h3g-55p8](https://github.com/advisories/GHSA-2v37-7h3g-55p8) |
| Descripcion | Generadores personalizados pueden entrar en loop infinito cuando `size` es 0 |
| Severidad   | HIGH                                                     |
| Cadenas     | `vite -> postcss -> nanoid` y `@vitejs/plugin-react -> vite -> postcss -> nanoid` |

nanoid es una **dependencia transitiva** (no la instalamos directamente),
traida por `vite` y `postcss`.

### El fix

Las unicas versiones parchadas de la linea 3.x son:

| Version   | Fecha de publicacion  | Edad (al 2026-08-07) |
| :-------- | :-------------------- | :------------------- |
| 3.3.17    | 2026-08-03            | 4.5 dias             |
| 3.3.18    | 2026-08-07            | 0 dias (hoy)         |

### El conflicto

Con `minimumReleaseAge: 10080` (7 dias), **ninguna** de las dos versiones
parchadas pasaba el filtro:

- `3.3.17` tiene 4.5 dias  ->  bloqueada (necesita 7)
- `3.3.18` tiene 0 dias     ->  bloqueada (necesita 7)

El hardening y el fix eran incompatibles.

### La decision

**Pin nanoid a 3.3.17 + bajar minimumReleaseAge a 5760 (4 dias) en Frontend.**

```yaml
# Frontend/pnpm-workspace.yaml
minimumReleaseAge: 5760   # 4 dias (antes 10080 / 7 dias)

overrides:
  nanoid: 3.3.17          # pin exacto (no ^3.3.17 para que no resuelva a 3.3.18)
```

**Por que 3.3.17 y no 3.3.18?** Porque 3.3.17 tiene mas edad (4.5 dias)
y reduce riesgo. 3.3.18 se publico el mismo dia y tendria edad 0.

**Por que pin exacto (`3.3.17`) y no rango (`^3.3.17`)?** Porque con rango,
pnpm resuelve a la version mas nueva que cumpla (3.3.18), que sigue
dentro del cutoff de 4 dias por muy poco. El pin garantiza 3.3.17.

**Por que 4 dias y no mantener 7?** Porque las unicas versiones parchadas
tienen menos de 7 dias. 4 dias mantiene el cerco (bloquea paquetes frescos
de 0-4 dias, que son el vector principal de Shai-Hulud) mientras permite
el fix de seguridad.

**Por que solo Frontend y no BackEnd?** Porque BackEnd no tiene nanoid
en su arbol de dependencias y no necesita el override ni el ajuste.
BackEnd mantiene 7 dias de hardening completo.

### Que pasar si alguien hace pnpm install despues de un fresh clone?

Con minimumReleaseAge en 5760 (4 dias) y nanoid@3.3.17 (4.5 dias de edad
al momento de escribir esto), la instalacion funciona. **Sin embargo**,
hay una window temporal a tener en cuenta:

- **Antes del 2026-08-10**: nanoid@3.3.17 tiene < 4 dias. `pnpm install`
  fallara con `ERR_PNPM_NO_MATURE_MATCHING_VERSION`. Solucion temporal:
  bajar `minimumReleaseAge` a 0, instalar, restaurar.
- **Despues del 2026-08-10 (aprox)**: nanoid@3.3.17 tendra 7+ dias.
  Se puede subir `minimumReleaseAge` de vuelta a 10080 (7 dias) en
  Frontend sin conflicto. **TODO**: hacer este ajuste despues del 2026-08-10.

### Cundo se puede restaurar minimumReleaseAge a 7 dias en Frontend?

Despues del **2026-08-10**, nanoid@3.3.17 tendra 7+ dias de antiguedad
y podremos restaurar:

```yaml
# Frontend/pnpm-workspace.yaml (despues del 2026-08-10)
minimumReleaseAge: 10080   # volver a 7 dias

overrides:
  nanoid: 3.3.17            # mantener el override
```

El override `nanoid: 3.3.17` se puede quitar una vez que `vite` y
`postcss` actualicen sus dependencias a nanoid >= 3.3.17 por defecto.

## Verificacion de integridad

Despues de la migracion a pnpm, se verifico:

| Check                          | BackEnd | Frontend |
| :----------------------------- | :------ | :------- |
| `pnpm install` exitoso         | OK      | OK       |
| `pnpm audit` limpio            | OK      | OK       |
| IoC Shai-Hulud scan            | 0 found | 0 found  |
| SHA-512 hashes vs NPM registry | 35/35   | 134/134  |
| `pnpm run dev` arranca         | OK      | OK       |

## Como pasar los filtros de seguridad del equipo

Para que este cambio mergee sin problemas, verificar:

1. **`pnpm install` limpio** en ambas carpetas (sin `ERR_PNPM_NO_MATURE_MATCHING_VERSION`).
2. **`pnpm audit`** reporte 0 vulnerabilidades en ambas carpetas.
3. **No hay `postinstall` scripts** no aprobados en `pnpm-workspace.yaml` (allowBuilds).
4. **Lockfiles commiteados** (`pnpm-lock.yaml` en ambas carpetas).
5. **`.env.example`** commiteado, `.env` en `.gitignore`.
6. **`README.md`** tiene instrucciones de pnpm (no npm).

```bash
# Script de verificacion rapida
cd BackEnd && pnpm install && pnpm audit && echo "BackEnd OK"
cd ../Frontend && pnpm install && pnpm audit && echo "Frontend OK"
```

## Referencias

- [Shai-Hulud NPM worm analysis](https://www.darkreading.com/cyber-risk/npm-package-shai-hulud-worm)
- [GHSA-2v37-7h3g-55p8 (nanoid DoS)](https://github.com/advisories/GHSA-2v37-7h3g-55p8)
- [pnpm minimumReleaseAge](https://pnpm.io/settings#minimumreleaseage)
- [pnpm allowBuilds](https://pnpm.io/settings#allowbuilds)
- [pnpm overrides](https://pnpm.io/settings#overrides)
