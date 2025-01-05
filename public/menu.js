import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

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

// Función para cargar menú desde Firestore
async function cargarMenu() {
    try {
        const menuList = document.getElementById("menu-list");
        menuList.innerHTML = '';

        const menuRef = collection(db, "menu");
        const querySnapshot = await getDocs(menuRef);

        const menuItems = [];
        querySnapshot.forEach((doc) => {
            menuItems.push({ id: doc.id, ...doc.data() });
        });

        menuItems.sort((a, b) => a.categoria.localeCompare(b.categoria));
        menuItems.forEach((data) => {
            const row = document.createElement("tr");
            row.setAttribute("data-id", data.id);
            row.innerHTML = `
                <td>${data.categoria}</td>
                <td>${data.nombre}</td>
                <td>${data.descripcion}</td>
                <td>${data.imagen}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarMenu('${data.id}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarMenu('${data.id}')">Eliminar</button>
                </td>
            `;
            menuList.appendChild(row);
        });
    } catch (error) {
        console.error("Error al cargar el menú:", error);
    }
}
window.onload = cargarMenu;

//Función para añadir platillos
const menuForm = document.getElementById('formAgregarPlatillo');
menuForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const categoria = document.getElementById('categoria').value;
    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const imagen = document.getElementById('imagen').value;

    try {
        const docRef = await addDoc(collection(db, "menu"), {
            categoria: categoria,
            nombre: nombre,
            descripcion: descripcion,
            imagen: imagen
        });

        console.log("Platillo agregado con ID: ", docRef.id);
        alert("¡Platillo agregado!");
        menuForm.reset();

        $('#modalAgregarPlatillo').modal('hide');
        
        cargarMenu();
    } catch (e) {
        console.error("Error al agregar platillo: ", e);
        alert("Hubo un error. Intenta nuevamente.");
    }
});
