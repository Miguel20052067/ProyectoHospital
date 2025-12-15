from datasets import load_dataset
import pandas as pd

# Cargar el dataset
dataset = load_dataset("ilopezmon/casos_clinicos_completos")

# Concatenar todos los splits en un solo DataFrame
all_dfs = [pd.DataFrame(split) for split in dataset.values()]
full_df = pd.concat(all_dfs, ignore_index=True)

# Tomar los primeros 100 casos
first_100 = full_df.head(100)

# Función para mostrar un caso formateado
def print_caso(caso, numero):
    print(f"\n{'='*50}")
    print(f"Caso {numero}")
    print(f"{'='*50}")
    for col, val in caso.items():
        print(f"{col}: {val}")
    print(f"{'='*50}\n")

# Mostrar los 100 primeros casos
for i, (_, row) in enumerate(first_100.iterrows(), start=1):
    print_caso(row.to_dict(), i)
