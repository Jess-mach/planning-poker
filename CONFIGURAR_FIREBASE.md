# 🚀 Configuração Firebase - 5 Minutos

## 📋 Passo 1: Obter Credenciais do Firebase

### 1.1 Acessar o Firebase Console

👉 Abra: **https://console.firebase.google.com/**

### 1.2 Selecionar Projeto

Clique no projeto: **`plannig-pokt`** (ou o nome que você criou)

### 1.3 Acessar Configurações

1. Clique no ícone **⚙️** (canto superior esquerdo)
2. Clique em **"Configurações do projeto"**

### 1.4 Encontrar as Credenciais Web

1. Role a página até a seção **"Seus aplicativos"**
2. Você verá duas opções:

**Opção A:** Se já existe um app web (ícone `</>`)
   - Você verá um card com o nome do app
   - Clique em **"Config"** ou **"Configuração"**
   - Pule para o Passo 2

**Opção B:** Se NÃO existe app web ainda
   - Clique no botão com ícone **`</>`** (código)
   - Digite o apelido: **`planning-poker-web`**
   - **NÃO** marque "Configurar Firebase Hosting"
   - Clique em **"Registrar app"**

### 1.5 Copiar as Credenciais

Você verá um código JavaScript como este:

```javascript
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "plannig-pokt.firebaseapp.com",
  databaseURL: "https://plannig-pokt-default-rtdb.firebaseio.com",
  projectId: "plannig-pokt",
  storageBucket: "plannig-pokt.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789"
};
```

**✅ ESTAS são as credenciais corretas!** (Client SDK)

---

## 📝 Passo 2: Criar o arquivo .env

### 2.1 Criar arquivo .env na raiz do projeto

No terminal, na pasta do projeto:

```bash
# Linux/Mac
touch .env

# Ou use o editor de código para criar o arquivo
```

### 2.2 Copiar o template abaixo para o .env

```env
# ============================================
# FIREBASE CLIENT SDK - CREDENCIAIS
# ============================================

VITE_FIREBASE_API_KEY=COLE_SEU_API_KEY_AQUI
VITE_FIREBASE_AUTH_DOMAIN=COLE_SEU_AUTH_DOMAIN_AQUI
VITE_FIREBASE_DATABASE_URL=COLE_SEU_DATABASE_URL_AQUI
VITE_FIREBASE_PROJECT_ID=COLE_SEU_PROJECT_ID_AQUI
VITE_FIREBASE_STORAGE_BUCKET=COLE_SEU_STORAGE_BUCKET_AQUI
VITE_FIREBASE_MESSAGING_SENDER_ID=COLE_SEU_MESSAGING_SENDER_ID_AQUI
VITE_FIREBASE_APP_ID=COLE_SEU_APP_ID_AQUI
```

### 2.3 Substituir os valores

Com base no `firebaseConfig` que você copiou, substitua:

```env
# EXEMPLO COM SEUS DADOS:
VITE_FIREBASE_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_FIREBASE_AUTH_DOMAIN=plannig-pokt.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://plannig-pokt-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=plannig-pokt
VITE_FIREBASE_STORAGE_BUCKET=plannig-pokt.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123def456ghi789
```

**⚠️ IMPORTANTE:** 
- NÃO use aspas
- NÃO use espaços antes/depois do `=`
- Cada valor em uma linha

---

## 🔄 Passo 3: Reiniciar o Servidor

```bash
# Se o servidor estiver rodando, pare (Ctrl+C)

# Inicie novamente
npm run dev
```

**Por quê?** O Vite só carrega variáveis de ambiente na inicialização.

---

## ✅ Passo 4: Testar

### 4.1 Abrir a aplicação

```
http://localhost:5173
```

### 4.2 Criar uma sessão

1. Clique em **"Start new game"**
2. Preencha o formulário
3. Clique em **"Criar Sessão"**

### 4.3 Verificar no Firebase Console

1. Volte ao Firebase Console
2. Menu lateral: **"Realtime Database"** → **"Dados"**
3. Você deve ver: `sessions` → `[id-da-sessão]`

**✅ Se aparecer, está funcionando!**

### 4.4 Testar sincronização

1. Copie o link de compartilhamento (botão no header)
2. Abra em **aba anônima** ou **outro navegador**
3. Entre na sessão
4. Vote em ambas as abas
5. **Os votos devem sincronizar instantaneamente!** ⚡

---

## 🔍 Mapeamento dos Campos

Aqui está o mapeamento exato:

| Campo no firebaseConfig | Variável no .env |
|------------------------|------------------|
| `apiKey` | `VITE_FIREBASE_API_KEY` |
| `authDomain` | `VITE_FIREBASE_AUTH_DOMAIN` |
| `databaseURL` | `VITE_FIREBASE_DATABASE_URL` |
| `projectId` | `VITE_FIREBASE_PROJECT_ID` |
| `storageBucket` | `VITE_FIREBASE_STORAGE_BUCKET` |
| `messagingSenderId` | `VITE_FIREBASE_MESSAGING_SENDER_ID` |
| `appId` | `VITE_FIREBASE_APP_ID` |

---

## ❓ Troubleshooting

### Erro: "Firebase not initialized"

**Causa:** `.env` não encontrado ou valores incorretos

**Solução:**
1. Verifique se o arquivo `.env` está na **raiz** do projeto
2. Verifique se os valores estão corretos (sem aspas, sem espaços)
3. Reinicie o servidor: `npm run dev`

### Erro: "Permission denied"

**Causa:** Regras do Firebase não configuradas

**Solução:**
1. Firebase Console → Realtime Database → Regras
2. Copie estas regras:

```json
{
  "rules": {
    "sessions": {
      "$sessionId": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

3. Clique em **"Publicar"**

### Não sincroniza entre abas

**Causa:** `.env` não configurado ou valores errados

**Solução:**
1. Abra o console do navegador (F12)
2. Veja se há erros de Firebase
3. Verifique se o `.env` está correto

---

## 📂 Estrutura de Arquivos

```
planning-poker/
├── .env                    ← Criar este arquivo
├── .gitignore             ← Já contém .env (não será commitado)
├── src/
│   └── config/
│       └── firebase.ts    ← Já configurado para ler .env
├── package.json
└── ...
```

---

## 🎯 Checklist Final

- [ ] Acessei Firebase Console
- [ ] Selecionei projeto `plannig-pokt`
- [ ] Fui em Configurações → Seus aplicativos
- [ ] Criei/encontrei app Web (`</>`)
- [ ] Copiei o `firebaseConfig`
- [ ] Criei arquivo `.env` na raiz
- [ ] Colei os valores no formato correto
- [ ] Reiniciei servidor: `npm run dev`
- [ ] Testei criar sessão
- [ ] Verifiquei dados no Firebase Console
- [ ] Testei sincronização em tempo real

---

## 🎉 Pronto!

Se todos os passos acima funcionaram, você agora tem:

✅ Planning Poker com sincronização em tempo real  
✅ Funciona em qualquer rede/dispositivo  
✅ Gratuito (até 100 conexões)  
✅ Zero configuração de servidor  

**Próximo passo:** Compartilhe com sua equipe e teste! 🚀

---

## 📞 Ajuda

Se algo não funcionar:
1. Verifique o console do navegador (F12)
2. Verifique o terminal onde o servidor está rodando
3. Me envie a mensagem de erro exata

