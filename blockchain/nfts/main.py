import json

# Função para criar o nome do arquivo
def generate_filename(index):
    return f"{index}.json"

# Função para gerar os dados JSON
def generate_json_data(index):
    return {
        "name": f"Itrust {index}",
        "description": "Collection of 25 rares and 75 commons nfts",
        "image": f"ipfs://CID/{index}.png"
    }

# Gera os 100 arquivos JSON
for i in range(1, 101):
    filename = generate_filename(i)
    data = generate_json_data(i)

    with open(filename, 'w') as file:
        json.dump(data, file, indent=2)

print("Arquivos JSON gerados com sucesso!")
