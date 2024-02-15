import json

# Função para criar o nome do arquivo
def generate_filename(index):
    return f"{index}.json"

# Função para gerar os dados JSON
def generate_json_data(index):
    return {
        "name": f"iTRUST #{index}",
        "tokenId":index,
        "description": "Collection of 25 rare and 75 common NFTs. This collection will provide a reward from an iTRUST streaming platform.",
        "image": f"https://gateway.pinata.cloud/ipfs/QmcqvsA1btSmcmMhqUpe8z7ZAuDfxupygN1ZszLNhzks3W/NFT{index}.png"
    }

# Gera os 100 arquivos JSON
for i in range(1, 101):
    filename = generate_filename(i)
    data = generate_json_data(i)

    with open(filename, 'w') as file:
        json.dump(data, file, indent=2)

print("Arquivos JSON gerados com sucesso!")
