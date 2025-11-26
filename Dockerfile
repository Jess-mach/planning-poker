FROM node:20-alpine

WORKDIR /app

# Copiar arquivos de dependências
COPY package.json package-lock.json ./

# Instalar dependências com --no-bin-links
RUN npm install --no-bin-links

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Expor porta 4173 (porta padrão do vite preview)
EXPOSE 4173

# Comando para servir a aplicação usando vite preview
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]

