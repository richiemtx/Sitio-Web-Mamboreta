import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { doc, getDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBqyMAMByTX0b0bqvHu-o9IoJSG3voYjsw",
    authDomain: "mambo-4f8ba.firebaseapp.com",
    projectId: "mambo-4f8ba",
    storageBucket: "mambo-4f8ba.appspot.com",
    messagingSenderId: "326320108967",
    appId: "1:326320108967:web:2076ef0192aebbc7657282"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para cargar reservaciones desde Firestore
async function cargarReservaciones() {
    try {
        // Limpiar la lista de reservaciones antes de agregar las nuevas
        const reservacionesList = document.getElementById("reservaciones-list");
        reservacionesList.innerHTML = '';

        const reservacionesRef = collection(db, "reservaciones");
        const querySnapshot = await getDocs(reservacionesRef);

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const row = document.createElement("tr");
            row.setAttribute("data-id", doc.id);
            row.innerHTML = `
                <td>${data.nombre}</td>
                <td>${data.correo}</td>
                <td>${data.telefono}</td>
                <td>${data.fecha}</td>
                <td>${data.personas}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarReservacion('${doc.id}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarReservacion('${doc.id}')">Eliminar</button>
                </td>
            `;
            reservacionesList.appendChild(row);
        });
    } catch (error) {
        console.error("Error al cargar las reservaciones:", error);
    }
}
window.onload = cargarReservaciones;

// Función para editar una reservación
async function editarReservacion(id) {
    try {
        const docRef = doc(db, "reservaciones", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();

            document.getElementById('nombre').value = data.nombre || "";
            document.getElementById('correo').value = data.correo || "";
            document.getElementById('telefono').value = data.telefono || "";

            if (data.fecha && data.fecha.seconds) {
                const fecha = new Date(data.fecha.seconds * 1000).toISOString().slice(0, 16);
                document.getElementById('fecha').value = fecha;
            } else {
                document.getElementById('fecha').value = "";
            }

            document.getElementById('personas').value = data.personas || "";
            document.getElementById('reservacion-id').value = id || "";

            $('#modalEditarReservacion').modal('show');
        } else {
            alert("No se encontró la reservación.");
        }
    } catch (error) {
        console.error("Error al cargar los datos de la reservación para edición:", error);
    }
}

// Manejo del evento de guardar cambios en el formulario de edición
document.getElementById('formEditarReservacion').addEventListener('submit', async function (e) {
    e.preventDefault();

    const id = document.getElementById('reservacion-id').value;
    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correo').value;
    const telefono = document.getElementById('telefono').value;
    const fecha = document.getElementById('fecha').value;
    const personas = document.getElementById('personas').value;

    if (!nombre || !correo || !telefono || !fecha || !personas) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    try {
        const docRef = doc(db, "reservaciones", id);
        await updateDoc(docRef, {
            nombre: nombre,
            correo: correo,
            telefono: telefono,
            fecha: new Date(fecha), 
            personas: parseInt(personas)
        });

        alert("Reservación actualizada correctamente.");
        $('#modalEditarReservacion').modal('hide');
        cargarReservaciones();
    } catch (error) {
        console.error("Error al actualizar la reservación:", error);
        alert("Ocurrió un error al intentar actualizar la reservación.");
    }
});

// Función para eliminar una reservación
let idReservacionEliminar = null;

// Función para abrir el modal y mostrar los datos de la reservación a eliminar
async function eliminarReservacion(id) {
    try {
        const docRef = doc(db, "reservaciones", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            idReservacionEliminar = id;

            document.getElementById('eliminar-nombre').textContent = data.nombre || "N/A";
            document.getElementById('eliminar-correo').textContent = data.correo || "N/A";
            document.getElementById('eliminar-telefono').textContent = data.telefono || "N/A";
            document.getElementById('eliminar-fecha').textContent = data.fecha ? new Date(data.fecha.seconds * 1000).toLocaleString() : "N/A";
            document.getElementById('eliminar-personas').textContent = data.personas || "N/A";

            $('#modalEliminarReservacion').modal('show');
        } else {
            alert("No se encontró la reservación.");
        }
    } catch (error) {
        console.error("Error al cargar los datos para eliminación:", error);
    }
}

document.getElementById('btnConfirmarEliminar').addEventListener('click', async () => {
    if (idReservacionEliminar) {
        try {
            await deleteDoc(doc(db, "reservaciones", idReservacionEliminar));
            alert("Reservación eliminada correctamente.");
            $('#modalEliminarReservacion').modal('hide');
            cargarReservaciones(); 
        } catch (error) {
            console.error("Error al eliminar la reservación:", error);
            alert("Ocurrió un error al intentar eliminar la reservación.");
        }
    } else {
        alert("No se pudo identificar la reservación a eliminar.");
    }
});

// Función para abrir el modal de agregar nueva reservación
function agregarReservacion() {
    $('#modalAgregarReservacion').modal('show');
}

document.getElementById('formAgregarReservacion').addEventListener('submit', async function (e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correo').value;
    const telefono = document.getElementById('telefono').value;
    const fecha = document.getElementById('fecha').value;
    const personas = document.getElementById('personas').value;

    if (!nombre || !correo || !telefono || !fecha || !personas) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    try {
        if (!db) {
            throw new Error("No se pudo conectar a la base de datos de Firestore.");
        }

        const reservacionesRef = collection(db, "reservaciones");
        await addDoc(reservacionesRef, {
            nombre: nombre,
            correo: correo,
            telefono: telefono,
            fecha: fecha,
            personas: parseInt(personas)
        });

        alert("Reservación agregada correctamente.");
        $('#modalAgregarReservacion').modal('hide');
        cargarReservaciones();

        document.getElementById('formAgregarReservacion').reset();
    } catch (error) {
        console.error("Error al agregar la reservación:", error);
        alert(`Ocurrió un error al intentar agregar la reservación: ${error.message}`);
    }
});
