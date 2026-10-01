async function mostrarPropietario()
{
 const respuesta = await fetch('/api/devuelva_todo_propietario');
 const data = await respuesta.json();
 const tbodypropietarios=document.getElementById('filaspropietario')
 for(let i=0;i<data.length;i++){
     const fila=data[i];
     const filahtml=document.createElement ('tr');
     filahtml.innerHTML='<td>'+fila.nombre+'</td>'+
     '<td>'+fila.telefono+'</td>';
      tbodypropietarios.appendChild(filahtml);
 }
} 

 function convertirBufferAImagen(imagenBuffer) {
    // Si no hay imagen, se usa una imagen por defecto
    if (!imagenBuffer || !imagenBuffer.data || imagenBuffer.data.length === 0) {
        return "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=400&fit=crop";
    }
try {
        const bytes = new Uint8Array(imagenBuffer.data);
        let binario = '';
        for (let i = 0; i < bytes.length; i++) {
            binario += String.fromCharCode(bytes[i]);
        }
        const base64 = btoa(binario);
        // Se asume JPEG; si tus imágenes son PNG, cambia el mime type
        return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
        console.error('Error al convertir la imagen:', error);
        return "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=400&fit=crop";
    }
}



async function listaDePublicidades()
{
    const respuesta = await fetch('/api/listaPublicaciones');
    const data = await respuesta.json();
    
    const contenedor = document.getElementById('contenedor-mascotas');
/*    
descripcion_mascota: "PERRO"
descripcion_publicidad: "PEDRO DIEZ SANTA CRUZ"
descripcion_raza: "CHIHUAWA"
fecha: "2026-03-03T19:34:00.000Z"
imagen: {type: 'Buffer', data: Array(16)}
nombre_mascota: "BOBY"
nombre_propietario: "JUAN"
recompensa: 200
telefono: "755673"
*/

    for(let i=0;i<data.length;i++){
        const fila=data[i];
        const date=new Date(fila.fecha);
        const options = {
                        weekday:'long',
                        year:'numeric', 
                        month:'long',
                        day:'numeric',
                        };

       const Imagen = convertirBufferAImagen(fila.imagen);
        const div=`<div class="mascota-tarjeta">
            <img src="${Imagen}" alt="${fila.nombre_mascota}" class="mascota-img" loading="lazy">
            
                <div class="mascota-info">

                <h3 class="mascota-nombre">${fila.nombre_mascota}</h3>
                <div class="mascota-datos">
                    <div class="dato-fila">
                        <span class="icono">🐶</span>
                        <span>${fila.descripcion_raza} - ${fila.descripcion_mascota}</span>
                    </div>
                    <div class="dato-fila">
                      <span class="icono">👤</span>
                      <span> Nombre del Propietario:${fila.nombre_propietario}</span>
                    </div>

                    <div class="dato-fila">
                        <span class="icono">📍</span>
                        <span>${fila.descripcion_publicidad}</span>
                    </div>
                    <div class="dato-fila">
                        <span class="icono">📅</span>
                        <span>Fecha de publicación:${date.toLocaleDateString("es-ES")}</span>
                    </div>
                    <div class="dato-fila">
                     <span class="icono">📞</span>
                     <span> Telefono de Contacto:${fila.telefono}</span>
                     </div>
                     <div class="dato-fila">
                     <span class="icono">💰</span>
                     <span> RECOMPENSA:${fila.recompensa}</span>
                     </div>
                </div>
              
        </div>`;
         contenedor.innerHTML += div;
    }
}

async function registrarPublicidad() {
    const formulario = document.getElementById('formulario-registro');
    const mensaje = document.getElementById('mensaje-registro');
    const boton = formulario.querySelector('button');
    const archivo = document.getElementById('imagen').files[0];

    if (!formulario.reportValidity()) {
        return;
    }

    mensaje.textContent = 'Registrando...';
    mensaje.className = 'mensaje';
    boton.disabled = true;

    try {
        const imagen = await convertirImagenABase64(archivo);
        const datos = Object.fromEntries(new FormData(formulario));
        datos.imagen = imagen;

        const respuesta = await fetch('/api/registro-publicidad', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.error || 'No fue posible registrar la publicación.');
        }

        formulario.reset();
        mensaje.textContent = resultado.mensaje;
        mensaje.className = 'mensaje exito';
    } catch (error) {
        mensaje.textContent = error.message;
        mensaje.className = 'mensaje error';
    } finally {
        boton.disabled = false;
    }
}

function convertirImagenABase64(archivo) {
    return new Promise((resolver, rechazar) => {
        const lector = new FileReader();

        lector.onload = () => {
            const imagen = lector.result.split(',')[1];
            resolver(imagen);
        };
        lector.onerror = () => rechazar(new Error('No fue posible leer la imagen.'));
        lector.readAsDataURL(archivo);
    });
}

async function cargarRazas() {
    const selectorRaza = document.getElementById('razaCode');
    if (!selectorRaza) {
        return;
    }

    try {
        const respuesta = await fetch('/api/razas');
        const razas = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error();
        }

        selectorRaza.innerHTML = '<option value="">Seleccione una raza</option>';
        for (const raza of razas) {
            const opcion = document.createElement('option');
            opcion.value = raza.cod;
            opcion.textContent = raza.descripcion;
            selectorRaza.appendChild(opcion);
        }
    } catch (error) {
        selectorRaza.innerHTML = '<option value="">No fue posible cargar las razas</option>';
        selectorRaza.disabled = true;
    }
}

const formularioRegistro = document.getElementById('formulario-registro');
if (formularioRegistro) {
    cargarRazas();
}



