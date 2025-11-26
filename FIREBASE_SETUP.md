# 🔥 Configuração do Firebase

Este guia vai te ajudar a configurar o Firebase para sincronização em tempo real do Planning Poker.

---

## 📋 Passo 1: Criar Projeto no Firebase

1. Acesse: https://console.firebase.google.com/
2. Clique em **"Adicionar projeto"** ou **"Add project"**
3. Digite o nome do projeto (ex: `planning-poker`)
4. Desabilite o Google Analytics (não é necessário para este projeto)
5. Clique em **"Criar projeto"**

---

## ⚙️ Passo 2: Configurar Realtime Database

1. No menu lateral, vá em **"Build" → "Realtime Database"**
2. Clique em **"Criar banco de dados"** ou **"Create database"**
3. Selecione a localização:
   - **us-central1** (Estados Unidos - mais rápido para Brasil)
   - Ou escolha a mais próxima de você
4. Escolha **"Iniciar no modo de teste"** (test mode)
   - ⚠️ Importante: Vamos configurar regras de segurança depois
5. Clique em **"Ativar"**

---

## 🔑 Passo 3: Obter Credenciais

1. No menu lateral, clique no ícone de **engrenagem ⚙️** → **"Configurações do projeto"**
2. Role até a seção **"Seus aplicativos"**
3. Clique no ícone **"</>"** (Web)
4. Digite um apelido para o app (ex: `planning-poker-web`)
5. **NÃO** marque "Firebase Hosting"
6. Clique em **"Registrar app"**
7. Copie o objeto `firebaseConfig` que aparece

---

## 📝 Passo 4: Configurar Variáveis de Ambiente

1. Na raiz do projeto, crie um arquivo chamado `.env`:

```bash
# Na pasta do projeto
touch .env
```

2. Cole as credenciais do Firebase no formato:

```env
VITE_FIREBASE_API_KEY=AIzaSyC...sua-chave-aqui
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://seu-projeto-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=seu-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

3. **Importante:** O arquivo `.env` já está no `.gitignore` e não será commitado

---

## 🔒 Passo 5: Configurar Regras de Segurança

Para permitir acesso apenas às sessões ativas, configure as regras:

1. No Firebase Console, vá em **"Realtime Database" → "Regras"**
2. Cole estas regras:

```json
{
  "rules": {
    "sessions": {
      "$sessionId": {
        ".read": true,
        ".write": true,
        ".indexOn": ["facilitatorId"],
        "users": {
          ".indexOn": ["online"]
        }
      }
    },
    "presence": {
      "$userId": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

3. Clique em **"Publicar"**

**Nota:** Estas regras são permissivas para simplificar. Em produção, você deve implementar autenticação.

---

## 🔒 Regras de Segurança para Produção (Futuro)

Quando estiver pronto para produção, use regras mais restritivas:

```json
{
  "rules": {
    "sessions": {
      "$sessionId": {
        ".read": "auth != null",
        ".write": "auth != null",
        "users": {
          "$userId": {
            ".write": "auth.uid === $userId || 
                      root.child('sessions').child($sessionId).child('facilitatorId').val() === auth.uid"
          }
        }
      }
    }
  }
}
```

---

## ✅ Passo 6: Reiniciar o Servidor

Após configurar o `.env`, reinicie o servidor de desenvolvimento:

```bash
# Parar o servidor (Ctrl+C) e reiniciar:
npm run dev
```

---

## 🧪 Testar a Configuração

1. Abra a aplicação: `http://localhost:5173`
2. Crie uma nova sessão
3. Copie o link de compartilhamento
4. Abra em outra aba ou navegador anônimo
5. As mudanças devem sincronizar em tempo real! 🎉

---

## 🔍 Ver Dados no Firebase

Para ver os dados sendo sincronizados:

1. Vá no Firebase Console
2. **"Realtime Database" → "Dados"**
3. Expanda `sessions` → `[id-da-sessão]`
4. Você verá todos os dados em tempo real

---

## 📊 Limites do Plano Gratuito (Spark)

- ✅ 1GB de armazenamento
- ✅ 10GB de download/mês
- ✅ 100 conexões simultâneas
- ✅ Sem necessidade de cartão de crédito

**Estimativa:** Suporta ~500-1000 sessões de Planning Poker por mês.

---

## ❓ Problemas Comuns

### Erro: "Permission denied"
- Verifique se as regras de segurança estão corretas
- Certifique-se de estar usando "test mode" ou regras permissivas

### Erro: "Failed to get document"
- Verifique se o `.env` está configurado corretamente
- Confirme que reiniciou o servidor após criar o `.env`

### Dados não sincronizam
- Abra o console do navegador (F12)
- Verifique se há erros de conexão
- Confirme que o `databaseURL` está correto

---

## 🆘 Suporte

Documentação oficial: https://firebase.google.com/docs/database

---

## 🚀 Próximos Passos

Após configurar:
1. ✅ Teste a sincronização em tempo real
2. ✅ Compartilhe o link com sua equipe
3. ✅ Todos podem votar simultaneamente de qualquer lugar!

**Pronto! Agora você tem um Planning Poker totalmente funcional com sincronização em tempo real! 🎉**

