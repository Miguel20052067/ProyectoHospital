from datasets import load_dataset
import pandas as pd

# Cargar el dataset desde Hugging Face
dataset = load_dataset("ilopezmon/casos_clinicos_completos")

# Lista para guardar todos los DataFrames
all_dfs = []

# Iterar por cada split y convertir a DataFrame
for split_name, split_data in dataset.items():
    df = pd.DataFrame(split_data)
    df['split_name'] = split_name  # opcional: saber de qué archivo viene cada fila
    all_dfs.append(df)

# Concatenar todos en un solo DataFrame
full_df = pd.concat(all_dfs, ignore_index=True)

# Guardar en CSV separado por ;
full_df.to_csv("casos_clinicos_completos.csv", sep=';', index=False, encoding='utf-8-sig')

print("CSV creado correctamente con", full_df.shape[0], "filas y", full_df.shape[1], "columnas.")
