# main_supabase.py
from datasets import load_dataset
import pandas as pd
from supabase import create_client

url = "https://rqasxfqfciggemiemcgl.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxYXN4ZnFmY2lnZ2VtaWVtY2dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NzE3MDAsImV4cCI6MjA4NTU0NzcwMH0.ZPVl_z3eW9FolZiC3vFjI05Bd2_Cx0rQp-XrN6CVT-k"                               # Tu anon/public API key

supabase = create_client(url, key)

dataset = load_dataset("ilopezmon/casos_clinicos_completos")
full_df = pd.concat([pd.DataFrame(split) for split in dataset.values()], ignore_index=True)
first_100 = full_df.head(5000)

cols = [
    'edad','sexo','antecedentes_medicos','antecedentes_quirurgicos','habitos',
    'situacion_basal','medicacion_actual','antecedentes_familiares','motivo',
    'sintomas','exploracion_general','signos','resultados_pruebas','razonamiento_clinico',
    'diagnostico_final','tratamiento_farmacologico','tratamiento_no_farmacologico',
    'factores_sociales','alergias','referencias_bibliograficas','categoria','keywords',
    'codigo_cie_10','dificultad','chunk_id','chunk'
]

def limpiar_texto(valor):
    if isinstance(valor, str):
        return valor.replace('\u0000', '')
    return valor

def insertar_caso(caso):
    data = {k: limpiar_texto(v) if pd.notna(v) else None for k, v in caso.items()}
    resp = supabase.table("casos_clinicos").insert(data).execute()
    if not resp.data:
        print("Error al insertar:", resp)
        return False
    return True



for i, (_, row) in enumerate(first_100.iterrows(), start=1):
    caso = row.to_dict()
    for col in cols:
        if col not in caso:
            caso[col] = None
    if caso['edad'] is not None:
        try:
            caso['edad'] = int(''.join(filter(str.isdigit, str(caso['edad']))))
        except ValueError:
            caso['edad'] = None
    if insertar_caso(caso):
        print(f"Caso {i} insertado correctamente.")
    else:
        print(f"Caso {i} falló al insertar.")

print("Carga completada ✅")