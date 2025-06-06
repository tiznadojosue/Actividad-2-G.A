// Referencias a elementos del DOM
const listaTareas = document.getElementById('lista-tareas');
const formulario = document.getElementById('formulario-tarea');
const entradaTarea = document.getElementById('entrada-tarea');
const mensaje = document.getElementById('mensaje');
const motivacion = document.getElementById('motivacion');
const botonExportar = document.getElementById('exportar-json');
const campoBusqueda = document.getElementById('busqueda');
const tipoTarea = document.getElementById('tipo-tarea');
const detalleTarea = document.getElementById('titulo-detalle');
const formularioPaso = document.getElementById('formulario-paso');
const entradaPaso = document.getElementById('entrada-paso');
const listaPasos = document.getElementById('lista-pasos');
const cerrarDetalle = document.getElementById('cerrar-detalle');
const panelPrincipal = document.getElementById('panel-principal');
const panelPasos = document.getElementById('panel-pasos');

let tareas = [];
let indiceTareaSeleccionada = null;

// Frases motivacionales
const frasesMotivacionales = [
    "¡Sigue adelante, puedes lograrlo!",
    "¡Un paso a la vez, cada tarea cuenta!",
    "¡Hoy es un gran día para avanzar!",
    "¡No te rindas, tu esfuerzo vale la pena!",
    "¡Organiza tu día y conquista tus metas!"
];

// Utilidad: Mostrar mensajes
function mostrarMensaje(texto, error = false) {
    mensaje.textContent = texto;
    mensaje.style.color = error ? "#A34054" : "#ED9E59";
    if (!error) setTimeout(() => mensaje.textContent = "", 1500);
}

// Utilidad: Guardar y cargar tareas
function cargarTareas() {
    const guardadas = localStorage.getItem('tareas');
    tareas = guardadas ? JSON.parse(guardadas) : [];
}
function guardarTareas() {
    localStorage.setItem('tareas', JSON.stringify(tareas));
}

// Validar entrada
function validarEntrada(texto) {
    if (!texto.trim()) {
        mostrarMensaje("Por favor, escribe una tarea o contacto.", true);
        return false;
    }
    if (tareas.find(t => t.nombre === texto.trim())) {
        mostrarMensaje("¡Ese elemento ya está en la lista!", true);
        return false;
    }
    return true;
}

// Mostrar tareas/contactos en la lista
function mostrarTareas(filtro = "") {
    listaTareas.innerHTML = "";
    tareas
        .filter(t => t.nombre.toLowerCase().includes(filtro.toLowerCase()))
        .forEach((tarea, indice) => {
            const elemento = document.createElement('li');
            elemento.innerHTML = `<strong>[${tarea.tipo === "tarea" ? "Tarea" : "Contacto"}]</strong> ${indice + 1}. ${tarea.nombre}`;
            if (tarea.completada) {
                elemento.classList.add('tarea-completada');
                const cartel = document.createElement('span');
                cartel.className = 'cartel-completada';
                cartel.textContent = 'Tarea Completada con éxito';
                elemento.appendChild(cartel);
                // Cambia el cartel por una tilde después de 5 segundos
                setTimeout(() => {
                    if (cartel.parentNode) cartel.textContent = '✔️';
                }, 5000);
                // Permitir eliminar aunque esté completada
                elemento.style.pointerEvents = "auto";
            }
            elemento.onclick = () => mostrarPanelPasos(indice);
            const botonEliminar = document.createElement('button');
            botonEliminar.textContent = "Eliminar";
            botonEliminar.className = "eliminar-btn";
            botonEliminar.onclick = e => {
                e.stopPropagation();
                eliminarTarea(indice);
            };
            elemento.appendChild(botonEliminar);
            listaTareas.appendChild(elemento);
        });
}

// Agregar tarea/contacto
formulario.addEventListener('submit', evento => {
    evento.preventDefault();
    const nombre = entradaTarea.value.trim();
    if (!validarEntrada(nombre)) return;
    tareas.push({ nombre, tipo: tipoTarea.value, pasos: [], celular: "" });
    guardarTareas();
    mostrarTareas(campoBusqueda.value);
    entradaTarea.value = "";
    mostrarMensaje("¡Guardado exitoso!");
});

// Eliminar tarea/contacto
function eliminarTarea(indice) {
    tareas.splice(indice, 1);
    guardarTareas();
    mostrarTareas(campoBusqueda.value);
}

// Mostrar detalle de tarea/contacto y pasos o celular
function mostrarDetalleTarea(indice) {
    indiceTareaSeleccionada = indice;
    const tarea = tareas[indice];
    detalleTarea.textContent = `${tarea.tipo === "tarea" ? "Tarea" : "Contacto"}: ${tarea.nombre}`;

    // Campo celular solo para contactos
    let campoCelular = document.getElementById("campo-celular");
    let botonGuardarCelular = document.getElementById("guardar-celular");
    let botonModificarCelular = document.getElementById("modificar-celular");

    if (tarea.tipo === "contacto") {
        if (!campoCelular) {
            campoCelular = document.createElement("input");
            campoCelular.type = "tel";
            campoCelular.id = "campo-celular";
            campoCelular.placeholder = "Número de celular";
            campoCelular.pattern = "[0-9\\s\\-+()]{7,}";
            campoCelular.className = "input-celular";
            campoCelular.inputMode = "tel";
            formularioPaso.parentNode.insertBefore(campoCelular, formularioPaso);
        }
        campoCelular.classList.remove("oculto");
        campoCelular.value = tarea.celular || "";

        // Botón Guardar
        if (!botonGuardarCelular) {
            botonGuardarCelular = document.createElement("button");
            botonGuardarCelular.id = "guardar-celular";
            botonGuardarCelular.textContent = "Guardar";
            botonGuardarCelular.type = "button";
            botonGuardarCelular.className = "guardar-celular-btn";
            campoCelular.parentNode.insertBefore(botonGuardarCelular, formularioPaso);
        }

        // Botón Modificar
        if (!botonModificarCelular) {
            botonModificarCelular = document.createElement("button");
            botonModificarCelular.id = "modificar-celular";
            botonModificarCelular.textContent = "Modificar";
            botonModificarCelular.type = "button";
            botonModificarCelular.className = "guardar-celular-btn";
            campoCelular.parentNode.insertBefore(botonModificarCelular, formularioPaso);
        }

        // Lógica de visualización
        if (tarea.celular) {
            campoCelular.disabled = true;
            botonGuardarCelular.classList.add("oculto");
            botonModificarCelular.classList.remove("oculto");
        } else {
            campoCelular.disabled = false;
            botonGuardarCelular.classList.remove("oculto");
            botonModificarCelular.classList.add("oculto");
        }

        // Guardar número
        botonGuardarCelular.onclick = function(e) {
            e.preventDefault();
            const valor = campoCelular.value.trim();
            if (!/^[0-9\s\-+()]{7,}$/.test(valor)) {
                mostrarMensaje("Ingrese un número de celular válido.", true);
                return;
            }
            tareas[indiceTareaSeleccionada].celular = valor;
            guardarTareas();
            mostrarMensaje("¡Guardado con éxito!");
            campoCelular.disabled = true;
            botonGuardarCelular.classList.add("oculto");
            botonModificarCelular.classList.remove("oculto");
        };

        // Modificar número
        botonModificarCelular.onclick = function(e) {
            e.preventDefault();
            campoCelular.disabled = false;
            botonGuardarCelular.classList.remove("oculto");
            botonModificarCelular.classList.add("oculto");
            campoCelular.focus();
        };

        formularioPaso.classList.add("oculto");
        listaPasos.innerHTML = "";
    } else {
        if (campoCelular) campoCelular.classList.add("oculto");
        if (botonGuardarCelular) botonGuardarCelular.classList.add("oculto");
        if (botonModificarCelular) botonModificarCelular.classList.add("oculto");
        formularioPaso.classList.remove("oculto");
        mostrarPasos();
    }
}

// Mostrar pasos de la tarea
function mostrarPasos() {
    listaPasos.innerHTML = "";
    const tarea = tareas[indiceTareaSeleccionada];
    tarea.pasos.forEach((paso, i) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${i + 1}. ${paso.texto}</span>`;
        if (paso.completado) {
            li.classList.add('paso-completado');
            // Si el paso fue recién completado, agrega animación
            if (paso.animarTachado) {
                li.classList.add('animado');
                setTimeout(() => {
                    li.classList.remove('animado');
                    delete paso.animarTachado;
                }, 700);
            }
        }
        // Botón completar
        const btnOk = document.createElement('button');
        btnOk.innerHTML = "✔️";
        btnOk.className = "boton-paso boton-completar";
        btnOk.disabled = paso.completado;
        btnOk.onclick = () => completarPaso(i);
        // Botón saltar
        const btnX = document.createElement('button');
        btnX.innerHTML = "❌";
        btnX.className = "boton-paso boton-saltar";
        btnX.disabled = paso.completado;
        btnX.onclick = () => saltarPaso(i);
        li.appendChild(btnOk);
        li.appendChild(btnX);
        listaPasos.appendChild(li);
    });
}

// Agregar paso a la tarea
formularioPaso.addEventListener('submit', e => {
    e.preventDefault();
    const texto = entradaPaso.value.trim();
    if (!texto) return;
    tareas[indiceTareaSeleccionada].pasos.push({ texto, completado: false });
    guardarTareas();
    mostrarPasos();
    entradaPaso.value = "";
});

// Completar paso
function completarPaso(indicePaso) {
    const tarea = tareas[indiceTareaSeleccionada];
    tarea.pasos[indicePaso].completado = true;
    tarea.pasos[indicePaso].animarTachado = true; // Marca para animar
    guardarTareas();
    mostrarPasos();
    mostrarMensaje(`Paso ${indicePaso + 1} completado con éxito ✅`);
    // Si todos los pasos están completos
    if (tarea.pasos.length > 0 && tarea.pasos.every(p => p.completado)) {
        tarea.completada = true; // Marca la tarea como completada
        guardarTareas();
        setTimeout(() => {
            mostrarMensaje(`¡Tarea completada con éxito!`);
            volverAlPanelPrincipal();
            mostrarTareas(); // Refresca la lista para mostrar el estado opaco
        }, 1200);
    }
}

// Saltar paso
function saltarPaso(indicePaso) {
    mostrarMensaje(frasesMotivacionales[Math.floor(Math.random() * frasesMotivacionales.length)]);
}

// Exportar a JSON
botonExportar.addEventListener('click', () => {
    const datos = JSON.stringify(tareas, null, 2);
    const archivo = new Blob([datos], {type: "application/json"});
    const url = URL.createObjectURL(archivo);

    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = "tareas-contactos.json";
    enlace.click();

    URL.revokeObjectURL(url);
    mostrarMensaje("¡Datos exportados!");
});

// Buscar/filtro en tiempo real
campoBusqueda.addEventListener('input', () => {
    mostrarTareas(campoBusqueda.value);
});

// Autocompletado para el input de búsqueda
const busquedaInput = document.getElementById('busqueda');
let autocompleteList;

busquedaInput.addEventListener('input', function() {
    cerrarListaAutocomplete();
    const valor = this.value.toLowerCase();
    if (!valor) return;
    autocompleteList = document.createElement('div');
    autocompleteList.setAttribute('id', 'busqueda-autocomplete-list');
    this.parentNode.appendChild(autocompleteList);

    tareas
        .filter(t => t.nombre.toLowerCase().includes(valor))
        .slice(0, 8)
        .forEach(t => {
            const item = document.createElement('div');
            item.innerHTML = t.nombre.replace(
                new RegExp(valor, "gi"),
                match => `<strong>${match}</strong>`
            );
            item.addEventListener('mousedown', function(e) {
                e.preventDefault();
                busquedaInput.value = t.nombre;
                mostrarTareas(t.nombre);
                cerrarListaAutocomplete();
            });
            autocompleteList.appendChild(item);
        });
});

busquedaInput.addEventListener('blur', cerrarListaAutocomplete);

function cerrarListaAutocomplete() {
    const lista = document.getElementById('busqueda-autocomplete-list');
    if (lista) lista.parentNode.removeChild(lista);
}

// Animación de máquina de escribir para el mensaje motivacional
async function escribirMotivacion(texto) {
    motivacion.textContent = "";
    motivacion.style.animation = 'none';
    void motivacion.offsetWidth;
    motivacion.style.animation = 'aparecerMotivacion 1s';
    for (let i = 0; i <= texto.length; i++) {
        motivacion.textContent = texto.slice(0, i);
        await new Promise(resolver => setTimeout(resolver, 40));
    }
}
async function borrarMotivacion() {
    let texto = motivacion.textContent;
    for (let i = texto.length; i >= 0; i--) {
        motivacion.textContent = texto.slice(0, i);
        await new Promise(resolver => setTimeout(resolver, 20));
    }
}
let indiceMotivacion = 0;
async function cicloMotivacional() {
    while (true) {
        const frase = frasesMotivacionales[indiceMotivacion % frasesMotivacionales.length];
        await escribirMotivacion(frase);
        await new Promise(resolver => setTimeout(resolver, 2500));
        await borrarMotivacion();
        await new Promise(resolver => setTimeout(resolver, 400));
        indiceMotivacion++;
    }
}
cicloMotivacional();

// Sugerir nombre aleatorio usando fetch 
entradaTarea.addEventListener('focus', async () => {
    if (entradaTarea.value) return;
    try {
        const respuesta = await fetch('https://randomuser.me/api/');
        const datos = await respuesta.json();
        const nombre = datos.results[0].name.first + " " + datos.results[0].name.last;
        entradaTarea.placeholder = `Ej: ${nombre}`;
    } catch {
        entradaTarea.placeholder = "Escribe una tarea o contacto";
    }
});

// Panel de pasos: mostrar y ocultar con desenfoque
function mostrarPanelPasos(indice) {
    mostrarDetalleTarea(indice);
    panelPrincipal.classList.add('desenfocado');
    panelPasos.classList.remove('oculto');
    setTimeout(() => {
        panelPasos.classList.add('mostrar');
    }, 10);
}
function volverAlPanelPrincipal() {
    panelPasos.classList.remove('mostrar');
    panelPrincipal.classList.remove('desenfocado');
    setTimeout(() => {
        panelPasos.classList.add('oculto');
    }, 400); // Debe coincidir con el transition de opacity
}
cerrarDetalle.onclick = volverAlPanelPrincipal;

// Inicializar
cargarTareas();
mostrarTareas();