# Use Node.js 18 LTS
FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de configuração
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar arquivos do cliente
COPY client ./client/

# Instalar dependências do cliente
RUN cd client && npm install

# Construir o cliente (se necessário)
RUN npm run client:build

# Copiar o restante dos arquivos
COPY . .

# Expor porta
EXPOSE 10000

# Comando para iniciar a aplicação
CMD ["npm", "start"]

