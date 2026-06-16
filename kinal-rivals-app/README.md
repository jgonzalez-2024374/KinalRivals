# Kinal Rivals

**Kinal Rivals** es un juego arcade construido con **Phaser 4**, **React** y **Vite**.

## Descripción del proyecto

El juego incluye:

- una pantalla de inicio (`Boot`) y reglas (`Rules`)
- un selector de personajes (`CharacterSelect`)
- un selector de escenarios (`StageSelect`)
- la escena de juego principal (`Game`)
- comunicación entre React y Phaser con `src/game/EventBus.js`
- activos del juego en `public/assets`

El proyecto combina React para la interfaz y Phaser para la lógica de juego.

## Estructura del proyecto

- `index.html` — página base del juego.
- `package.json` — scripts y dependencias.
- `pnpm-lock.yaml` / `pnpm-workspace.yaml` — bloqueo de dependencias.
- `public/style.css` — estilos globales.
- `public/assets/` — imágenes usadas por el juego.
- `src/main.jsx` — entrada React principal.
- `src/App.jsx` — componente React raíz.
- `src/PhaserGame.jsx` — puente React ↔ Phaser.
- `src/game/EventBus.js` — bus de eventos para la comunicación.
- `src/game/main.jsx` — arranca la aplicación Phaser.
- `src/game/scenes/` — escenas del juego:
  - `Boot.js`
  - `Preloader.js`
  - `MainMenu.js`
  - `Rules.js`
  - `CharacterSelect.js`
  - `StageSelect.js`
  - `Game.js`
- `vite/` — configuración de Vite para desarrollo y producción.

## Cómo ejecutar el proyecto

1. Instala dependencias:

```bash
pnpm install
```

2. Inicia el servidor de desarrollo:

```bash
pnpm run dev
```

3. Abre el juego en el navegador:

```text
http://localhost:8080
```

4. Para generar la versión de producción:

```bash
pnpm run build
```



## Cómo está compuesto el juego

- `Boot.js` carga la primera imagen e inicia la escena de reglas.
- `Preloader.js` muestra una barra de carga y carga los assets del juego.
- `MainMenu.js` muestra el menú principal.
- `Rules.js` muestra las reglas antes de seleccionar personajes.
- `CharacterSelect.js` permite elegir dos personajes.
- `StageSelect.js` permite elegir el escenario.
- `Game.js` crea los sprites de los jugadores, el fondo, el suelo y la lógica de juego.


## Añadir nuevos personajes o escenarios

1. Coloca las nuevas imágenes en `public/assets`.
2. Carga los nuevos archivos en `Preloader.js`.
3. Añade las opciones correspondientes en `CharacterSelect.js` o `StageSelect.js`.
4. Usa los valores seleccionados en `Game.js` para mostrar los sprites correctos.

## Ejemplo rápido

Para ejecutar el juego después de clonar el repositorio:

```bash
pnpm install
pnpm run dev
```

Luego abre `http://localhost:8080`.


```bash
pnpm run build-nolog
```

Or, to disable the log entirely, simply delete the file `log.js` and remove the call to it in the `scripts` section of `package.json`:

Before:

```json
"scripts": {
    "dev": "node log.js dev & dev-template-script",
    "build": "node log.js build & build-template-script"
},
```

After:

```json
"scripts": {
    "dev": "dev-template-script",
    "build": "build-template-script"
},
```

Cualquiera de estas opciones detendrá la ejecución de `log.js`. Si decides hacer esto, puedes unirte a nuestro Discord y decirnos qué plantilla estás usando, o enviarnos un correo breve.

## Únete a la comunidad de Phaser

Nos encanta ver lo que desarrolladores como tú crean con Phaser. Eso nos ayuda a mejorar, así que comparte tu proyecto y participa en la comunidad.

**Visita:** el [sitio web de Phaser](https://phaser.io) y sigue en [Phaser Twitter](https://twitter.com/phaser_)<br />
**Juega:** algunos de los increíbles juegos en [#madewithphaser](https://twitter.com/search?q=%23madewithphaser&src=typed_query&f=live)<br />
**Aprende:** [Documentación API](https://newdocs.phaser.io), [Foro de soporte](https://phaser.discourse.group/) y [StackOverflow](https://stackoverflow.com/questions/tagged/phaser-framework)<br />
**Discord:** únete a [Discord](https://discord.gg/phaser)<br />
**Código:** más de 2000 [ejemplos](https://labs.phaser.io)<br />
**Lee:** el boletín [Phaser World](https://phaser.io/community/newsletter)<br />

Creado por [Phaser Studio](mailto:support@phaser.io). Diseñado con café, anime, píxeles y cariño.

El logo de Phaser y los personajes son © 2011 - 2025 Phaser Studio Inc.

Todos los derechos reservados.
