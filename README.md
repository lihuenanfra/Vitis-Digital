# Vitis Digital — sitio estático

Archivos:
- `index.html`
- `css/styles.css` (todos los tokens como variables CSS en `:root`)
- `js/main.js` (pestañas, celular, chat de preguntas, regalos)

## Fuentes (Google Fonts)
- **Playfair Display** (itálica): títulos destacados y logo
- **Poppins**: títulos en mayúscula, textos y botones
- **Comfortaa**: incluida en el link para pasajes cálidos

## WhatsApp
El número está en `js/main.js`, en `CONFIG.whatsapp` (solo dígitos, con código de país).

## Imágenes
Si una imagen no existe, se muestra un recuadro rosa con su nombre. Subí las fotos con estas rutas:

- `img/trabajos/humor.jpg`, `img/trabajos/informativo.jpg`, `img/trabajos/colaboraciones.jpg`
- `img/perfiles/{julie|af|sofi}/avatar.jpg`
- `img/perfiles/{julie|af|sofi}/post-1.jpg` … `post-9.jpg` (4:5, por ejemplo 1080×1350)
- `img/perfiles/{julie|af|sofi}/historia-1.jpg` … `historia-4.jpg` (9:16)
- `img/regalos/calendario.jpg`, `img/regalos/checklist.jpg`, `img/regalos/reels.jpg`

## Links de descarga
En `js/main.js`, en `RESOURCES`, cambiá `href: '#'` por el link de cada recurso.

## Publicar en Vercel
Subí la carpeta a un repo de GitHub, importalo en Vercel y elegí "Other" como framework. No requiere build.

## Contactos de los regalos (formulario de descarga)
Antes de descargar un regalo, la persona deja su WhatsApp **o** su mail. Para que esos datos se guarden en una hoja de Google Sheets:
1. Seguí los pasos de `extras/guardar-contactos.gs` (se instala una sola vez).
2. Pegá la URL que te da Google en `js/main.js`, en `CONFIG.leadsEndpoint`.
Mientras ese campo esté vacío, la descarga funciona igual pero el contacto no se guarda.

## Pop up de salida
Aparece una sola vez por visita: en compu cuando el mouse sale por arriba de la ventana, y en celular cuando la persona sube rápido al inicio después de navegar un rato. No aparece mientras alguien está jugando Vitis Run.

## Juego Vitis Run
`js/juego.js`. La meta para ganar la auditoría está en `META` (400 me gusta).
