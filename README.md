# 🦋 Colorfly Studio

Generador de paletas de colores aleatorias con soporte para HSL y HEX.

🔗 **Demo en vivo:** https://juanelizondo-mx.github.io/ProyectoM1_Juan-Elizondo/  
📁 **Repositorio:** https://github.com/JuanElizondo-MX/ProyectoM1_Juan-Elizondo

---

## Manual de usuario

### Generar una paleta

1. Elige cuántos colores quieres: **6, 8 o 9**
2. Elige el formato principal: **HSL o HEX**
3. Haz clic en **Generar Paleta**

Cada tarjeta muestra los dos formatos. El que elegiste aparece arriba destacado, y el otro abajo más tenue.

---

### Copiar un color

Cada tarjeta tiene dos botones:

- **Copiar HSL** → copia el valor en formato `hsl(240, 80%, 55%)`
- **Copiar HEX** → copia el valor en formato `#4D6ECC`

Al copiar, el botón muestra un ✔ y aparece una notificación en la parte inferior confirmando la acción.

---

### Bloquear un color

Haz clic sobre el **rectángulo de color** para bloquearlo 🔒. Mientras esté bloqueado, ese color no cambia al generar una nueva paleta. Haz clic de nuevo para desbloquearlo 🔓.

---

### Guardar una paleta

Haz clic en **💾 Guardar Paleta** para guardar la paleta actual.

- Puedes guardar hasta **5 paletas**
- Aparecen en la sección **Paletas Guardadas** al final de la página
- Haz clic sobre cualquier cuadradito de color para ver y copiar sus códigos HSL y HEX
- Haz clic en **✕** para eliminar una paleta guardada

---

### Cambiar la cantidad de colores

Puedes cambiar entre **6, 8 o 9 colores** en cualquier momento usando los botones de la parte superior. Al cambiar, los colores bloqueados se liberan y se genera una nueva paleta con la cantidad elegida.

---

### Cambiar el formato de color

Usa los botones **HSL** y **HEX** para elegir qué formato aparece destacado en las tarjetas. El otro formato siempre sigue visible debajo, más tenue. Puedes cambiar el formato en cualquier momento sin perder los colores actuales.

---

### Notificaciones

Cada acción que realizas muestra una pequeña notificación en la parte inferior de la pantalla: al generar, copiar, bloquear, guardar o eliminar una paleta. Desaparece sola después de unos segundos.

---

## Decisiones técnicas

- Se usó **HTML, CSS y JavaScript** porque son los lenguajes base del desarrollo web y los que estamos aprendiendo en el módulo.
- Se usó **JavaScript puro**, sin frameworks, para practicar la lógica desde cero.
- Los colores se generan en formato **HSL** porque es más fácil de controlar: puedes ajustar qué tan brillante o saturado es un color con números simples.
- Las paletas se guardan con **localStorage**, que es una forma de guardar información en el navegador sin necesitar una base de datos.
- Las tarjetas de color se crean con JavaScript de forma dinámica, lo que significa que el HTML no las tiene escritas, sino que se generan según lo que el usuario elige.
- Se agregaron **animaciones en CSS** para que la app se sienta más pulida al generar colores.
- Se tomaron en cuenta aspectos de **accesibilidad** básica: los botones tienen etiquetas descriptivas y se puede navegar con el teclado.

---

## Ejecutar en local

### Paso 1 — Clonar el repositorio

Abre una terminal y ejecuta:

```bash
git clone https://github.com/JuanElizondo-MX/ProyectoM1_Juan-Elizondo.git
```

Luego entra a la carpeta del proyecto:

```bash
cd ProyectoM1_Juan-Elizondo
```

### Paso 2 — Abrir la app

**Opción A — Abrir directo en el navegador**

Abre el archivo `index.html` con doble clic.

> ⚠️ La función de copiar puede no funcionar en Chrome al abrir con doble clic. Usa la Opción B para evitarlo.

**Opción B — Live Server en VS Code (recomendado)**

1. Instala la extensión **Live Server** en VS Code
2. Abre la carpeta del proyecto en VS Code
3. Clic derecho sobre `index.html` → **Open with Live Server**
4. La app abre en `http://127.0.0.1:5500`

---

## Desplegar la aplicación

El proyecto usa **GitHub Pages**, que publica sitios web directamente desde un repositorio de GitHub de forma gratuita.

1. Sube el proyecto a [github.com](https://github.com)
2. Ve a **Settings → Pages**
3. En **Source**, selecciona la rama `main` y la carpeta `/ (root)`
4. Haz clic en **Save**
5. GitHub genera tu URL pública:
   ```
   https://tu-usuario.github.io/nombre-del-repo/
   ```

> ✅ Al estar en HTTPS, todas las funciones de la app (incluyendo copiar al portapapeles) funcionan correctamente.