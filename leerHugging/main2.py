from datasets import load_dataset
import pandas as pd
import mysql.connector

conn = mysql.connector.connect(
    host="localhost",
    user="miguel2005",
    password="1234"
)
cursor = conn.cursor()

# Crear la base de datos si no existe
cursor.execute("CREATE DATABASE IF NOT EXISTS ProyectoHospital;")
cursor.execute("USE ProyectoHospital;")  # Selecciona la base de datos recién creada
cursor.execute("""
CREATE TABLE IF NOT EXISTS casos_clinicos (
id INT AUTO_INCREMENT PRIMARY KEY, edad INT, sexo VARCHAR(20),
antecedentes_medicos TEXT, antecedentes_quirurgicos TEXT, habitos TEXT,
situacion_basal TEXT, medicacion_actual TEXT, antecedentes_familiares TEXT,
motivo TEXT, sintomas TEXT, exploracion_general TEXT, signos TEXT,
resultados_pruebas TEXT, razonamiento_clinico TEXT, diagnostico_final TEXT,
tratamiento_farmacologico TEXT, tratamiento_no_farmacologico TEXT,
factores_sociales TEXT, alergias TEXT, referencias_bibliograficas TEXT,
categoria VARCHAR(400), keywords TEXT, codigo_cie_10 TEXT, dificultad VARCHAR(100),
chunk_id VARCHAR(100), chunk TEXT
);
""")


# Cargar dataset
dataset = load_dataset("ilopezmon/casos_clinicos_completos")
all_dfs = [pd.DataFrame(split) for split in dataset.values()]
full_df = pd.concat(all_dfs, ignore_index=True)
first_100 = full_df.head(100)

# Función para insertar casos
def insertar_caso(caso):
    sql = """
    INSERT INTO casos_clinicos (
        edad, sexo, antecedentes_medicos, antecedentes_quirurgicos, habitos,
        situacion_basal, medicacion_actual, antecedentes_familiares, motivo,
        sintomas, exploracion_general, signos, resultados_pruebas, razonamiento_clinico,
        diagnostico_final, tratamiento_farmacologico, tratamiento_no_farmacologico,
        factores_sociales, alergias, referencias_bibliograficas, categoria, keywords,
        codigo_cie_10, dificultad, chunk_id, chunk
    ) VALUES (
        %(edad)s, %(sexo)s, %(antecedentes_medicos)s, %(antecedentes_quirurgicos)s, %(habitos)s,
        %(situacion_basal)s, %(medicacion_actual)s, %(antecedentes_familiares)s, %(motivo)s,
        %(sintomas)s, %(exploracion_general)s, %(signos)s, %(resultados_pruebas)s, %(razonamiento_clinico)s,
        %(diagnostico_final)s, %(tratamiento_farmacologico)s, %(tratamiento_no_farmacologico)s,
        %(factores_sociales)s, %(alergias)s, %(referencias_bibliograficas)s, %(categoria)s, %(keywords)s,
        %(codigo_cie_10)s, %(dificultad)s, %(chunk_id)s, %(chunk)s
    )
    """
    cursor.execute(sql, caso)
    conn.commit()

cols = [
    'edad','sexo','antecedentes_medicos','antecedentes_quirurgicos','habitos',
    'situacion_basal','medicacion_actual','antecedentes_familiares','motivo',
    'sintomas','exploracion_general','signos','resultados_pruebas','razonamiento_clinico',
    'diagnostico_final','tratamiento_farmacologico','tratamiento_no_farmacologico',
    'factores_sociales','alergias','referencias_bibliograficas','categoria','keywords',
    'codigo_cie_10','dificultad','chunk_id','chunk'
]

# Insertar los primeros 3000 casos
for i, (_, row) in enumerate(first_100.iterrows(), start=1):
    caso_dict = row.to_dict()
    for col in cols:
        if col not in caso_dict:
            caso_dict[col] = None
    if caso_dict['edad'] is not None:
        try:
            caso_dict['edad'] = int(''.join(filter(str.isdigit, str(caso_dict['edad']))))
        except ValueError:
            caso_dict['edad'] = None

    insertar_caso(caso_dict)
    print(f"Caso {i} insertado correctamente.")

cursor.close()
conn.close()
