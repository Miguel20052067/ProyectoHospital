const casosMock = [
    {
        id: 1,
        diagnostico_final: 'Síndrome coronario agudo sin elevación del ST',
        edad: '67',
        sexo: 'Varón',
        alergias: 'No conocidas',
        factores_sociales: 'Vive con su pareja. Exfumador reciente.',
        antecedentes_medicos: 'HTA, diabetes mellitus tipo 2, dislipemia',
        antecedentes_quirurgicos: 'Apendicectomía en juventud',
        antecedentes_familiares: 'Padre con infarto agudo de miocardio a los 59 años',
        habitos: 'Exfumador de 20 paquetes/año',
        situacion_basal: 'Independiente para ABVD',
        medicacion_actual: 'Metformina, enalapril, atorvastatina',
        motivo: 'Dolor torácico opresivo de dos horas de evolución',
        sintomas: 'Disnea leve, sudoración fría, irradiación a brazo izquierdo',
        exploracion_general: 'Consciente, orientado, sudoroso, perfusión conservada',
        signos: 'TA 148/88, FC 96, SatO2 96%, T 36.5',
        resultados_pruebas: 'ECG con cambios inespecíficos. Troponina inicial pendiente',
        razonamiento_clinico: 'La respuesta del chatbot prioriza etiología isquémica por clínica típica y factores de riesgo, recomendando evaluación urgente y descarte de diagnósticos diferenciales graves.',
        tratamiento_farmacologico: 'AAS, control del dolor y monitorización según protocolo',
        tratamiento_no_farmacologico: 'Reposo, vigilancia estrecha y derivación hospitalaria',
        referencias_bibliograficas: 'Guías ESC sobre síndromes coronarios agudos',
        categoria: 'Cardiología',
        keywords: 'dolor torácico, SCASEST, urgencias',
        codigo_cie_10: 'I20.0'
    },
    {
        id: 2,
        diagnostico_final: 'Neumonía adquirida en la comunidad',
        edad: '54',
        sexo: 'Mujer',
        alergias: 'Penicilina',
        factores_sociales: 'Profesora, convivencia con dos hijos',
        antecedentes_medicos: 'Asma intermitente',
        antecedentes_quirurgicos: 'Ninguno relevante',
        antecedentes_familiares: 'No relevantes',
        habitos: 'No fumadora',
        situacion_basal: 'Autónoma',
        medicacion_actual: 'Salbutamol a demanda',
        motivo: 'Fiebre, tos productiva y dolor pleurítico',
        sintomas: 'Escalofríos, astenia, expectoración amarillenta',
        exploracion_general: 'Febril, eupneica en reposo',
        signos: 'TA 122/74, FC 104, SatO2 93%, T 38.4',
        resultados_pruebas: 'Crepitantes en base derecha, radiografía con infiltrado lobar',
        razonamiento_clinico: 'El chatbot reconoce el patrón infeccioso respiratorio y ajusta el nivel técnico a un profesional sanitario, proponiendo tratamiento y signos de alarma.',
        tratamiento_farmacologico: 'Antibiótico adaptado a alergias, antitérmicos',
        tratamiento_no_farmacologico: 'Hidratación, reposo relativo y reevaluación en 48-72 h',
        referencias_bibliograficas: 'Guía SEPAR de neumonía comunitaria',
        categoria: 'Neumología',
        keywords: 'neumonía, fiebre, tos',
        codigo_cie_10: 'J18.9'
    },
    {
        id: 3,
        diagnostico_final: 'Cólico nefrítico izquierdo',
        edad: '41',
        sexo: 'Varón',
        alergias: 'Ninguna',
        factores_sociales: 'Trabaja como conductor',
        antecedentes_medicos: 'Litiasis renal previa',
        antecedentes_quirurgicos: 'No',
        antecedentes_familiares: 'Hermano con litiasis recurrente',
        habitos: 'Baja ingesta hídrica habitual',
        situacion_basal: 'Sin limitaciones',
        medicacion_actual: 'Ibuprofeno ocasional',
        motivo: 'Dolor lumbar súbito irradiado a ingle',
        sintomas: 'Náuseas, inquietud, hematuria macroscópica',
        exploracion_general: 'Dolor evidente, afebril',
        signos: 'TA 138/84, FC 88, SatO2 98%, T 36.3',
        resultados_pruebas: 'Puñopercusión positiva izquierda, tira de orina con hematíes',
        razonamiento_clinico: 'La respuesta del chatbot es coherente con un cuadro típico de litiasis, aunque debe evaluar banderas rojas y necesidad de imagen.',
        tratamiento_farmacologico: 'AINE, antiemético si precisa',
        tratamiento_no_farmacologico: 'Hidratación guiada y vigilancia de fiebre o anuria',
        referencias_bibliograficas: 'Guías EAU sobre urolitiasis',
        categoria: 'Urología',
        keywords: 'cólico renal, hematuria, litiasis',
        codigo_cie_10: 'N23'
    }
];

let paginaActual = 0;
const tamanoPagina = 10;
let totalPaginas = 0;
let todosCasos = [];
let casoSeleccionadoId = null;
const puntuaciones = {};

function cargarCasos() {
    todosCasos = [...casosMock];
    totalPaginas = Math.max(1, Math.ceil(todosCasos.length / tamanoPagina));
    mostrarPagina(0);
}

function mostrarPagina(pagina) {
    paginaActual = Math.max(0, Math.min(pagina, totalPaginas - 1));
    const inicio = paginaActual * tamanoPagina;
    const fin = inicio + tamanoPagina;
    mostrarCasos(todosCasos.slice(inicio, fin));
    actualizarPaginacion();
}

function mostrarCasos(casos) {
    const container = document.getElementById('casos-container');
    container.innerHTML = '';

    if (casos.length === 0) {
        container.innerHTML = `
            <div class="border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
                No quedan casos pendientes por valorar en esta demo local.
            </div>`;
        return;
    }

    casos.forEach(caso => {
        container.innerHTML += `
        <div class="caso-card border ${casoSeleccionadoId === caso.id ? 'border-blue-700 bg-blue-50' : 'border-slate-200 bg-white'} p-5 transition hover:bg-slate-50"
             id="card-${caso.id}"
             onclick="seleccionarCaso(${caso.id})">
            <div class="caso-header flex items-start justify-between gap-4">
                <h3 class="text-xl font-black text-slate-900">${caso.diagnostico_final || 'Sin diagnóstico'}</h3>
                ${casoSeleccionadoId === caso.id ? '<span class="seleccionado-badge border border-blue-200 bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">Seleccionado</span>' : ''}
            </div>
            <div class="mt-3 grid gap-3 sm:grid-cols-3 text-sm text-slate-600">
                <div class="border border-slate-200 bg-slate-50 px-3 py-3"><span class="font-semibold text-slate-900">Paciente:</span> ${caso.edad} años, ${caso.sexo}</div>
                <div class="border border-slate-200 bg-slate-50 px-3 py-3"><span class="font-semibold text-slate-900">Categoría:</span> ${caso.categoria}</div>
                <div class="border border-slate-200 bg-slate-50 px-3 py-3"><span class="font-semibold text-slate-900">Motivo:</span> ${caso.motivo}</div>
            </div>
            <div class="caso-detalle ${casoSeleccionadoId === caso.id ? 'visible mt-4 border-t border-slate-200 pt-4' : 'hidden'}" id="detalle-${caso.id}">
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
        document.getElementById(`detalle-${id}`).classList.toggle('hidden');
        return;
    }

    casoSeleccionadoId = id;
    mostrarPagina(paginaActual);
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
    <div class="campo-largo mt-3 border border-slate-200 bg-slate-50 p-4">
        <label class="mb-1 block text-xs font-extrabold uppercase tracking-[0.08em] text-blue-700">${label}</label>
        <p class="text-sm leading-7 text-slate-700">${valor || '-'}</p>
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
    puntuaciones[criterio] = parseInt(valor, 10);
    document.getElementById(`valor-${criterio}`).textContent = `${valor}/5`;

    const textos = { 1: 'Muy malo', 2: 'Malo', 3: 'Regular', 4: 'Bueno', 5: 'Excelente' };
    document.getElementById(`texto-${criterio}`).textContent = textos[valor];

    calcularMedia();
}

function calcularMedia() {
    const valores = Object.values(puntuaciones).filter(v => v !== undefined);
    if (valores.length === 0) {
        document.getElementById('media-total').textContent = '-';
        return;
    }
    const media = (valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(1);
    document.getElementById('media-total').textContent = `${media}/5`;
}

function guardarValoracion() {
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

    const valoracion = {
        casoId: casoSeleccionadoId,
        precision_diagnostica: puntuaciones.precision,
        claridad_textual: puntuaciones.claridad,
        relevancia_clinica: puntuaciones.relevancia,
        adecuacion_contextual: puntuaciones.adecuacion,
        nivel_tecnico: puntuaciones.nivel,
        comentario: document.getElementById('comentario').value,
        fecha: new Date().toISOString()
    };

    const valoracionesPrevias = JSON.parse(localStorage.getItem('primaria_valoraciones') || '[]');
    valoracionesPrevias.push(valoracion);
    localStorage.setItem('primaria_valoraciones', JSON.stringify(valoracionesPrevias));

    todosCasos = todosCasos.filter(c => c.id !== casoSeleccionadoId);
    totalPaginas = Math.max(1, Math.ceil(todosCasos.length / tamanoPagina));
    casoSeleccionadoId = null;

    const paginaValida = Math.min(paginaActual, totalPaginas - 1);
    mostrarPagina(paginaValida);
    resetearValoraciones();

    document.getElementById('valoracion-caso-titulo').textContent = 'Selecciona un caso';
    alert('Valoración guardada localmente');
}

cargarCasos();
