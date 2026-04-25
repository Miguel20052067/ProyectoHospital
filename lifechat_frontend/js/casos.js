let paginaActual = 0;
const tamanoPagina = 10;
let totalPaginas = 0;
let todosCasos = [];
let casoSeleccionadoId = null;
const puntuaciones = {};
 
async function cargarCasos() {
    try {
        const response = await fetch('/api/mis-casos', {
            credentials: 'include',
            redirect: 'manual'
        });
 
        if (response.type === 'opaqueredirect' || response.status === 401 || response.status === 403) {
            window.location.href = '/index.html';
            return;
        }
 
        todosCasos = await response.json();
        totalPaginas = Math.ceil(todosCasos.length / tamanoPagina);
        mostrarPagina(0);
    } catch (error) {
        console.error('Error:', error);
        window.location.href = '/index.html';
    }
}
 
function mostrarPagina(pagina) {
    paginaActual = pagina;
    const inicio = pagina * tamanoPagina;
    const fin = inicio + tamanoPagina;
    mostrarCasos(todosCasos.slice(inicio, fin));
    actualizarPaginacion();
}
 
function mostrarCasos(casos) {
    const container = document.getElementById('casos-container');
    container.innerHTML = '';
 
    casos.forEach(caso => {
        container.innerHTML += `
        <div class="caso-card ${casoSeleccionadoId === caso.id ? 'seleccionado' : ''}" 
             id="card-${caso.id}" 
             onclick="seleccionarCaso(${caso.id})">
            <div class="caso-header">
                <h3>${caso.diagnostico_final || 'Sin diagnóstico'}</h3>
                ${casoSeleccionadoId === caso.id ? '<span class="seleccionado-badge">✓ Seleccionado</span>' : ''}
            </div>
            <div class="caso-detalle" id="detalle-${caso.id}">
                ${campo('Edad', caso.edad)}
                ${campo('Sexo', caso.sexo)}
                ${campo('Alergias', caso.alergias)}
                ${campo('Factores sociales', caso.factores_sociales)}
                ${campo('Antecedentes médicos', caso.antecedentes_medicos)}
                ${campo('Antecedentes quirúrgicos', caso.antecedentes_quirurgicos)}
                ${campo('Antecedentes familiares', caso.antecedentes_familiares)}
                ${campo('Hábitos y situación basal', (caso.habitos || '') + (caso.situacion_basal ? ' | ' + caso.situacion_basal : ''))}
                ${campo('Medicación actual', caso.medicacion_actual)}
                ${campo('Motivo de consulta', caso.motivo)}
                ${campo('Síntomas', caso.sintomas)}
                ${campo('Exploración general', caso.exploracion_general)}
                ${campo('Signos', caso.signos)}
                ${campo('Resultados de pruebas', caso.resultados_pruebas)}
                ${campo('Razonamiento clínico', caso.razonamiento_clinico)}
                ${campo('Diagnóstico final', caso.diagnostico_final)}
                ${campo('Tratamiento farmacológico', caso.tratamiento_farmacologico)}
                ${campo('Tratamiento no farmacológico', caso.tratamiento_no_farmacologico)}
                ${campo('Referencias bibliográficas', caso.referencias_bibliograficas)}
                ${campo('Categoría', caso.categoria)}
                ${campo('Keywords', caso.keywords)}
                ${campo('Código CIE-10', caso.codigo_cie_10)}
            </div>
        </div>`;
    });
}
 
function seleccionarCaso(id) {
    if (casoSeleccionadoId === id) {
        document.getElementById(`detalle-${id}`).classList.toggle('visible');
        return;
    }
 
    if (casoSeleccionadoId) {
        const cardAnterior = document.getElementById(`card-${casoSeleccionadoId}`);
        if (cardAnterior) cardAnterior.classList.remove('seleccionado');
        const detalleAnterior = document.getElementById(`detalle-${casoSeleccionadoId}`);
        if (detalleAnterior) detalleAnterior.classList.remove('visible');
    }
 
    casoSeleccionadoId = id;
    const card = document.getElementById(`card-${id}`);
    card.classList.add('seleccionado');
    document.getElementById(`detalle-${id}`).classList.add('visible');
 
    resetearValoraciones();
 
    document.getElementById('valoracion-caso-titulo').textContent =
        todosCasos.find(c => c.id === id)?.diagnostico_final || 'Caso seleccionado';
}
 
function resetearValoraciones() {
    ['precision', 'claridad', 'relevancia', 'adecuacion', 'nivel'].forEach(criterio => {
        puntuaciones[criterio] = undefined;
        document.getElementById(`barra-${criterio}`).value = 1;
        document.getElementById(`valor-${criterio}`).textContent = '1/5';
        document.getElementById(`texto-${criterio}`).textContent = 'Sin valorar';
    });
    document.getElementById('media-total').textContent = '-';
    document.getElementById('comentario').value = '';
}
 
function campo(label, valor) {
    return `
    <div class="campo-largo">
        <label>${label}</label>
        <p>${valor || '-'}</p>
    </div>`;
}
 
function actualizarPaginacion() {
    document.getElementById('info-pagina').textContent = `Página ${paginaActual + 1} de ${totalPaginas}`;
    document.getElementById('btn-anterior').disabled = paginaActual === 0;
    document.getElementById('btn-siguiente').disabled = paginaActual >= totalPaginas - 1;
}
 
function cambiarPagina(direccion) {
    mostrarPagina(paginaActual + direccion);
}
 
function actualizarBarra(criterio, valor) {
    puntuaciones[criterio] = parseInt(valor);
    document.getElementById(`valor-${criterio}`).textContent = `${valor}/5`;
 
    const textos = { 1: 'Muy malo', 2: 'Malo', 3: 'Regular', 4: 'Bueno', 5: 'Excelente' };
    document.getElementById(`texto-${criterio}`).textContent = textos[valor];
 
    calcularMedia();
}
 
function calcularMedia() {
    const valores = Object.values(puntuaciones).filter(v => v !== undefined);
    if (valores.length === 0) return;
    const media = (valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(1);
    document.getElementById('media-total').textContent = `${media}/5`;
}
 
async function guardarValoracion() {
    if (!casoSeleccionadoId) {
        alert('Selecciona un caso primero');
        return;
    }
 
    const criteriosCompletos = ['precision', 'claridad', 'relevancia', 'adecuacion', 'nivel']
        .every(c => puntuaciones[c] !== undefined);
 
    if (!criteriosCompletos) {
        alert('Por favor valora todos los criterios antes de guardar');
        return;
    }
 
    try {
        const response = await fetch('/api/valoracion', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                casoId: casoSeleccionadoId,
                precision_diagnostica: puntuaciones.precision,
                claridad_textual: puntuaciones.claridad,
                relevancia_clinica: puntuaciones.relevancia,
                adecuacion_contextual: puntuaciones.adecuacion,
                nivel_tecnico: puntuaciones.nivel,
                comentario: document.getElementById('comentario').value
            })
        });
 
        const mensaje = await response.text();
 
        if (response.ok) {
            todosCasos = todosCasos.filter(c => c.id !== casoSeleccionadoId);
            totalPaginas = Math.ceil(todosCasos.length / tamanoPagina);
            casoSeleccionadoId = null;
 
            const paginaValida = Math.min(paginaActual, totalPaginas - 1);
            mostrarPagina(paginaValida);
            resetearValoraciones();
 
            document.getElementById('valoracion-caso-titulo').textContent = 'Selecciona un caso';
            alert('✅ Valoración guardada correctamente');
        } else {
            alert(mensaje);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar la valoración');
    }
}
 
cargarCasos();