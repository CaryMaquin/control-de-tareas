const formulario = document.getElementById("formulario");
const tareaInput = document.getElementById("tarea");
const fechaInput = document.getElementById("fecha");
const prioridadInput = document.getElementById("prioridad");

const lista = document.getElementById("lista");
const mensaje = document.getElementById("mensaje");

const buscar = document.getElementById("buscar");
const btnBuscar = document.getElementById("btnBuscar");
const btnMostrar = document.getElementById("btnMostrar");

const filtro = document.getElementById("filtro");
const limpiar = document.getElementById("limpiar");

const total = document.getElementById("total");
const pendientes = document.getElementById("pendientes");
const completadas = document.getElementById("completadas");
const porcentaje = document.getElementById("porcentaje");

const tema = document.getElementById("tema");

let tareas = JSON.parse(localStorage.getItem("misTareas")) || [];

let textoBusqueda = "";


/* GUARDAR */

function guardar() {
    localStorage.setItem("misTareas", JSON.stringify(tareas));
}


/* AGREGAR */

formulario.addEventListener("submit", function(e) {

    e.preventDefault();

    const nombre = tareaInput.value.trim();

    if (nombre === "") {
        alert("Escribe una tarea.");
        return;
    }

    const nuevaTarea = {
        id: Date.now(),
        nombre: nombre,
        fecha: fechaInput.value,
        prioridad: prioridadInput.value,
        completada: false
    };

    tareas.push(nuevaTarea);

    guardar();

    formulario.reset();

    prioridadInput.value = "media";

    textoBusqueda = "";
    buscar.value = "";

    mostrarTareas();

});


/* MOSTRAR TAREAS */

function mostrarTareas() {

    lista.innerHTML = "";

    let resultado = [...tareas];

    const tipo = filtro.value;

    /* FILTROS */

    if (tipo === "pendientes") {
        resultado = resultado.filter(t => !t.completada);
    }

    if (tipo === "completadas") {
        resultado = resultado.filter(t => t.completada);
    }

    if (tipo === "alta" ||
        tipo === "media" ||
        tipo === "baja") {

        resultado = resultado.filter(
            t => t.prioridad === tipo
        );
    }

    /* BUSQUEDA */

    if (textoBusqueda !== "") {

        resultado = resultado.filter(t =>
            t.nombre
                .toLowerCase()
                .includes(textoBusqueda.toLowerCase())
        );
    }

    /* MENSAJES */

    if (tareas.length === 0) {

        mensaje.textContent = "📭 No tienes tareas todavía.";
        mensaje.classList.remove("oculto");

    } else if (resultado.length === 0) {

        mensaje.textContent = "🔎 No se encontraron tareas.";
        mensaje.classList.remove("oculto");

    } else {

        mensaje.classList.add("oculto");
    }


    /* CREAR TAREAS */

    resultado.forEach(t => {

        const elemento = document.createElement("div");

        elemento.className = "tarea";

        if (t.completada) {
            elemento.classList.add("completada");
        }

        const check = document.createElement("input");

        check.type = "checkbox";
        check.className = "check";
        check.checked = t.completada;

        check.addEventListener("change", function() {
            completarTarea(t.id);
        });


        const info = document.createElement("div");

        info.className = "info";


        const nombre = document.createElement("div");

        nombre.className = "nombre";
        nombre.textContent = t.nombre;


        const detalles = document.createElement("div");

        detalles.className = "detalles";

        let textoFecha = t.fecha
            ? "📅 " + t.fecha
            : "📅 Sin fecha";

        detalles.textContent = textoFecha;


        const prioridad = document.createElement("span");

        prioridad.className =
            "prioridad " + t.prioridad;

        if (t.prioridad === "alta") {
            prioridad.textContent = "🔴 ALTA";
        }

        if (t.prioridad === "media") {
            prioridad.textContent = "🟡 MEDIA";
        }

        if (t.prioridad === "baja") {
            prioridad.textContent = "🟢 BAJA";
        }


        info.appendChild(nombre);
        info.appendChild(detalles);
        info.appendChild(prioridad);


        const acciones = document.createElement("div");

        acciones.className = "acciones";


        const editar = document.createElement("button");

        editar.className = "editar";
        editar.textContent = "✏️";

        editar.addEventListener("click", function() {
            editarTarea(t.id);
        });


        const eliminar = document.createElement("button");

        eliminar.className = "eliminar";
        eliminar.textContent = "🗑️";

        eliminar.addEventListener("click", function() {
            eliminarTarea(t.id);
        });


        acciones.appendChild(editar);
        acciones.appendChild(eliminar);


        elemento.appendChild(check);
        elemento.appendChild(info);
        elemento.appendChild(acciones);

        lista.appendChild(elemento);

    });


    actualizarEstadisticas();

}


/* COMPLETAR */

function completarTarea(id) {

    const tarea = tareas.find(t => t.id === id);

    if (tarea) {
        tarea.completada = !tarea.completada;
    }

    guardar();
    mostrarTareas();
}


/* EDITAR */

function editarTarea(id) {

    const tarea = tareas.find(t => t.id === id);

    if (!tarea) return;

    const nuevoNombre = prompt(
        "Editar tarea:",
        tarea.nombre
    );

    if (nuevoNombre === null) return;

    const nombre = nuevoNombre.trim();

    if (nombre === "") {
        alert("La tarea no puede estar vacía.");
        return;
    }

    tarea.nombre = nombre;

    guardar();
    mostrarTareas();
}


/* ELIMINAR */

function eliminarTarea(id) {

    const confirmar = confirm(
        "¿Quieres eliminar esta tarea?"
    );

    if (!confirmar) return;

    tareas = tareas.filter(t => t.id !== id);

    guardar();
    mostrarTareas();
}


/* BUSCAR */

btnBuscar.addEventListener("click", function() {

    textoBusqueda = buscar.value.trim();

    mostrarTareas();

});


/* BUSCAR CON ENTER */

buscar.addEventListener("keydown", function(e) {

    if (e.key === "Enter") {

        e.preventDefault();

        textoBusqueda = buscar.value.trim();

        mostrarTareas();
    }

});


/* MOSTRAR TODAS */

btnMostrar.addEventListener("click", function() {

    buscar.value = "";

    textoBusqueda = "";

    filtro.value = "todas";

    mostrarTareas();

});


/* FILTRO */

filtro.addEventListener("change", function() {

    mostrarTareas();

});


/* LIMPIAR COMPLETADAS */

limpiar.addEventListener("click", function() {

    const cantidad = tareas.filter(
        t => t.completada
    ).length;

    if (cantidad === 0) {

        alert("No hay tareas completadas.");

        return;
    }

    const confirmar = confirm(
        "¿Eliminar las " +
        cantidad +
        " tareas completadas?"
    );

    if (!confirmar) return;

    tareas = tareas.filter(
        t => !t.completada
    );

    guardar();

    mostrarTareas();

});


/* ESTADÍSTICAS */

function actualizarEstadisticas() {

    const totalTareas = tareas.length;

    const completadasTareas =
        tareas.filter(t => t.completada).length;

    const pendientesTareas =
        totalTareas - completadasTareas;

    let progreso = 0;

    if (totalTareas > 0) {
        progreso = Math.round(
            (completadasTareas / totalTareas) * 100
        );
    }

    total.textContent = totalTareas;

    pendientes.textContent = pendientesTareas;

    completadas.textContent = completadasTareas;

    porcentaje.textContent = progreso + "%";
}


/* MODO OSCURO */

tema.addEventListener("click", function() {

    document.body.classList.toggle("oscuro");

    if (document.body.classList.contains("oscuro")) {

        tema.textContent = "☀️";

        localStorage.setItem("tema", "oscuro");

    } else {

        tema.textContent = "🌙";

        localStorage.setItem("tema", "claro");
    }

});


/* CARGAR TEMA */

if (localStorage.getItem("tema") === "oscuro") {

    document.body.classList.add("oscuro");

    tema.textContent = "☀️";
}


/* INICIAR */

mostrarTareas();
