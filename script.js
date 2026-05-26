"use strict";


const estado = {
  cantidad: 6,
  formato: "hsl",
};


const btnsCantidad     = document.querySelectorAll("[data-cantidad]");
const btnsFormato      = document.querySelectorAll("[data-formato]");
const btnGenerar       = document.getElementById("btn-generar");
const paletaContenedor = document.getElementById("paleta-contenedor");
const btnGuardar       = document.getElementById("btn-guardar");
const seccionGuardadas = document.getElementById("seccion-guardadas");
const listaGuardadas   = document.getElementById("guardadas-lista");
const toast            = document.getElementById("toast");


function aleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generarColor() {
  const h = aleatorio(0, 360);
  const s = aleatorio(35, 100);
  const l = aleatorio(25, 75);
  return { h, s, l, hsl: `hsl(${h}, ${s}%, ${l}%)`, hex: hslAHex(h, s, l) };
}

function hslAHex(h, s, l) {
  s /= 100; l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const hex = (v) => Math.round(v * 255).toString(16).padStart(2, "0");
  return `#${hex(f(0))}${hex(f(8))}${hex(f(4))}`.toUpperCase();
}

let toastTimer = null;

function mostrarToast(msg, duracion = 2200) {
  toast.textContent = msg;
  toast.classList.add("visible");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), duracion);
}

async function copiarTexto(texto, btn, labelOriginal) {
  try {
    await navigator.clipboard.writeText(texto);
    btn.textContent = "✔";
    btn.classList.add("copiado");
    mostrarToast(`✔ ${texto} copiado`);
    setTimeout(() => {
      btn.textContent = labelOriginal;
      btn.classList.remove("copiado");
    }, 1800);
  } catch {
    mostrarToast("No se pudo copiar. Intentá manualmente.");
  }
}

const bloqueados = new Map();

function toggleBloqueo(index, card, color) {
  if (bloqueados.has(index)) {
    bloqueados.delete(index);
    card.classList.remove("bloqueado");
    card.querySelector(".lock-icon").textContent = "🔓";
    mostrarToast("🔓 Color desbloqueado");
  } else {
    bloqueados.set(index, color);
    card.classList.add("bloqueado");
    card.querySelector(".lock-icon").textContent = "🔒";
    mostrarToast("🔒 Color bloqueado");
  }
}

function crearBtnCopiar(codigo, label) {
  const btn = document.createElement("button");
  btn.className = "btn-copiar";
  btn.textContent = label;
  btn.setAttribute("aria-label", `Copiar ${label}: ${codigo}`);
  btn.addEventListener("click", () => copiarTexto(codigo, btn, label));
  return btn;
}


let coloresActuales = [];

function renderizarPaleta() {
  paletaContenedor.innerHTML = "";
  coloresActuales = [];

  for (let i = 0; i < estado.cantidad; i++) {
    const color = bloqueados.has(i) ? bloqueados.get(i) : generarColor();
    coloresActuales.push(color);

    const esPrincipalHSL = estado.formato === "hsl";
    const codPrincipal   = esPrincipalHSL ? color.hsl : color.hex;
    const labelPrincipal = esPrincipalHSL ? "Copiar HSL" : "Copiar HEX";
    const codSecundario  = esPrincipalHSL ? color.hex : color.hsl;
    const labelSecundario = esPrincipalHSL ? "Copiar HEX" : "Copiar HSL";


    const card = document.createElement("article");
    card.className = "color-card" + (bloqueados.has(i) ? " bloqueado" : "");
    card.style.animationDelay = `${i * 0.05}s`;
    card.setAttribute("aria-label", `Color ${i + 1}: ${codPrincipal}`);

    const muestra = document.createElement("div");
    muestra.className = "color-muestra";
    muestra.style.backgroundColor = color.hsl;
    muestra.setAttribute("role", "button");
    muestra.setAttribute("tabindex", "0");
    muestra.setAttribute("aria-label", `Bloquear/desbloquear color ${codPrincipal}`);
    muestra.title = "Clic para bloquear / desbloquear";
    muestra.addEventListener("click", () => toggleBloqueo(i, card, color));
    muestra.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); muestra.click(); }
    });

    const lockIcon = document.createElement("span");
    lockIcon.className = "lock-icon";
    lockIcon.textContent = bloqueados.has(i) ? "🔒" : "🔓";
    lockIcon.setAttribute("aria-hidden", "true");
    muestra.appendChild(lockIcon);

    
    const info = document.createElement("div");
    info.className = "color-info";

    const pPrincipal = document.createElement("p");
    pPrincipal.className = "codigo-principal";
    pPrincipal.textContent = codPrincipal;

    const filaPrincipal = document.createElement("div");
    filaPrincipal.className = "fila-copiar";
    filaPrincipal.appendChild(crearBtnCopiar(codPrincipal, labelPrincipal));

    const divider = document.createElement("div");
    divider.className = "formato-divider";
    divider.setAttribute("aria-hidden", "true");

    const pSecundario = document.createElement("p");
    pSecundario.className = "codigo-secundario";
    pSecundario.textContent = codSecundario;

    const filaSecundaria = document.createElement("div");
    filaSecundaria.className = "fila-copiar";
    filaSecundaria.appendChild(crearBtnCopiar(codSecundario, labelSecundario));

    info.append(pPrincipal, filaPrincipal, divider, pSecundario, filaSecundaria);
    card.append(muestra, info);
    paletaContenedor.appendChild(card);
}
}

const LS_KEY = "colorfly_paletas";
const MAX_GUARDADAS = 5;

function cargarLS() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; }
    catch { return []; }
}

function guardarLS(paletas) {
    localStorage.setItem(LS_KEY, JSON.stringify(paletas));
}

function guardarPaleta() {
    if (!coloresActuales.length) {
    mostrarToast("⚠ Primero generá una paleta");
    return;
  }

  const paletas = cargarLS();
  if (paletas.length >= MAX_GUARDADAS) {
    mostrarToast(`⚠ Máximo ${MAX_GUARDADAS} paletas. Eliminá una primero.`);
    return;
  }

  paletas.unshift({
    colores: coloresActuales.map(({ hsl, hex }) => ({ hsl, hex })),
    fecha: new Date().toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" }),
  });

  guardarLS(paletas);
  renderizarGuardadas();
  mostrarToast("💾 Paleta guardada");
}

function borrarPaleta(index) {
  const paletas = cargarLS();
  paletas.splice(index, 1);
  guardarLS(paletas);
  renderizarGuardadas();
  mostrarToast("🗑 Paleta eliminada");
}

function renderizarGuardadas() {
  const paletas = cargarLS();
  listaGuardadas.innerHTML = "";

  if (!paletas.length) {
    seccionGuardadas.classList.remove("visible");
    return;
  }

  seccionGuardadas.classList.add("visible");

  paletas.forEach((paleta, i) => {
    const fila = document.createElement("div");
    fila.className = "paleta-guardada";

    const chips = document.createElement("div");
    chips.className = "guardada-chips";

    paleta.colores.forEach(({ hsl, hex }) => {
      const wrapper = document.createElement("div");
      wrapper.className = "chip-wrapper";

      const chip = document.createElement("div");
      chip.className = "chip-color";
      chip.style.backgroundColor = hsl;
      chip.setAttribute("role", "button");
      chip.setAttribute("tabindex", "0");
      chip.setAttribute("aria-label", `Ver códigos del color ${hex}`);
      chip.title = "Clic para ver y copiar los códigos";

      const tooltip = document.createElement("div");
      tooltip.className = "chip-tooltip";

      
      const filaHsl = document.createElement("div");
      filaHsl.className = "tooltip-fila";
      const spanHsl = document.createElement("span");
      spanHsl.className = "tooltip-codigo";
      spanHsl.textContent = hsl;
      const btnHsl = document.createElement("button");
      btnHsl.className = "btn-chip-copiar";
      btnHsl.textContent = "Copiar HSL";
      btnHsl.setAttribute("aria-label", `Copiar HSL ${hsl}`);
      btnHsl.addEventListener("click", (e) => {
        e.stopPropagation();
        copiarTexto(hsl, btnHsl, "Copiar HSL");
      });
      filaHsl.append(spanHsl, btnHsl);

    
      const filaHex = document.createElement("div");
      filaHex.className = "tooltip-fila";
      const spanHex = document.createElement("span");
      spanHex.className = "tooltip-codigo";
      spanHex.textContent = hex;
      const btnHex = document.createElement("button");
      btnHex.className = "btn-chip-copiar";
      btnHex.textContent = "Copiar HEX";
      btnHex.setAttribute("aria-label", `Copiar HEX ${hex}`);
      btnHex.addEventListener("click", (e) => {
        e.stopPropagation();
        copiarTexto(hex, btnHex, "Copiar HEX");
      });
      filaHex.append(spanHex, btnHex);

      tooltip.append(filaHsl, filaHex);

      
      chip.addEventListener("click", (e) => {
        e.stopPropagation();
       
        document.querySelectorAll(".chip-tooltip.abierto").forEach((t) => {
          if (t !== tooltip) t.classList.remove("abierto");
        });
        tooltip.classList.toggle("abierto");
      });
      chip.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); chip.click(); }
      });

      wrapper.append(chip, tooltip);
      chips.appendChild(wrapper);
    });

    const meta = document.createElement("div");
    meta.className = "guardada-meta";

    const fecha = document.createElement("span");
    fecha.className = "guardada-fecha";
    fecha.textContent = paleta.fecha;

    const contador = document.createElement("span");
    contador.className = "guardada-contador";
    contador.textContent = `${i + 1}/${MAX_GUARDADAS}`;

    const btnBorrar = document.createElement("button");
    btnBorrar.className = "btn-borrar";
    btnBorrar.textContent = "✕";
    btnBorrar.setAttribute("aria-label", `Eliminar paleta guardada ${i + 1}`);
    btnBorrar.addEventListener("click", () => borrarPaleta(i));

    meta.append(fecha, contador);
    fila.append(chips, meta, btnBorrar);
    listaGuardadas.appendChild(fila);
  });
}

function activar(btns, btnClickeado) {
  btns.forEach((b) => b.setAttribute("aria-pressed", "false"));
  btnClickeado.setAttribute("aria-pressed", "true");
}

btnsCantidad.forEach((btn) => {
  btn.addEventListener("click", () => {
    activar(btnsCantidad, btn);
    estado.cantidad = parseInt(btn.dataset.cantidad, 10);
    bloqueados.clear();
    mostrarToast(`Paleta ajustada a ${estado.cantidad} colores`);
  });
});

btnsFormato.forEach((btn) => {
  btn.addEventListener("click", () => {
    activar(btnsFormato, btn);
    estado.formato = btn.dataset.formato;
    if (coloresActuales.length) renderizarPaleta();
    mostrarToast(`Formato principal: ${btn.dataset.formato.toUpperCase()}`);
  });
});

btnGenerar.addEventListener("click", () => {
  renderizarPaleta();
  mostrarToast("🎨 ¡Nueva paleta generada!");
});

btnGuardar.addEventListener("click", guardarPaleta);

document.addEventListener("click", () => {
  document.querySelectorAll(".chip-tooltip.abierto").forEach((t) => t.classList.remove("abierto"));
});

renderizarPaleta();
renderizarGuardadas();