from datasets import load_dataset
import pandas as pd
import mysql.connector

conn = mysql.connector.connect(
    host="localhost",
    user="miguel2005",
    password="1234",
    database="ProyectoHospital"
)
cursor = conn.cursor()

dataset = load_dataset("ilopezmon/casos_clinicos_completos")
all_dfs = [pd.DataFrame(split) for split in dataset.values()]
full_df = pd.concat(all_dfs, ignore_index=True)
first_100 = full_df.head(3000)

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
