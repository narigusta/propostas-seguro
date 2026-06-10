# 🚀 Guia de Deploy — Sistema de Propostas de Seguro

## Passo 1 — Google Sheets (banco de dados gratuito)

### 1.1 Criar a Planilha
1. Acesse [sheets.google.com](https://sheets.google.com) e crie uma nova planilha
2. Renomeie para **"Propostas Seguro"**
3. Crie **duas abas** na planilha:
   - `Propostas`
   - `Consultores`
4. Copie o **ID** da planilha da URL:
   - URL: `https://docs.google.com/spreadsheets/d/` **`1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms`** `/edit`
   - O ID é a parte em negrito

### 1.2 Criar Conta de Serviço Google
1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Crie um novo projeto (ou selecione um existente)
3. No menu lateral: **APIs e Serviços → Biblioteca**
4. Pesquise e ative: **Google Sheets API**
5. Vá em **APIs e Serviços → Credenciais**
6. Clique em **+ Criar Credenciais → Conta de serviço**
7. Dê um nome (ex: `seguro-propostas`) e clique em **Criar e continuar**
8. Na etapa de permissões, pule e clique em **Concluído**
9. Clique na conta de serviço criada → aba **Chaves**
10. **Adicionar chave → Criar nova chave → JSON** → Baixe o arquivo

### 1.3 Compartilhar a Planilha com a Conta de Serviço
1. Abra o arquivo JSON baixado e copie o valor de `client_email`
   - Exemplo: `seguro-propostas@meu-projeto.iam.gserviceaccount.com`
2. Abra sua planilha no Google Sheets
3. Clique em **Compartilhar** (canto superior direito)
4. Cole o e-mail da conta de serviço
5. Dê permissão de **Editor** e clique em **Enviar**

---

## Passo 2 — GitHub

1. Crie uma conta em [github.com](https://github.com) (se não tiver)
2. Crie um **novo repositório** (pode ser privado)
3. Faça upload de todos os arquivos deste projeto para o repositório
   - Você pode usar o botão "uploading an existing file" na interface do GitHub
   - ⚠️ **NÃO envie** o arquivo `.env.local` nem o JSON da conta de serviço!

---

## Passo 3 — Vercel (hospedagem gratuita)

1. Acesse [vercel.com](https://vercel.com) e crie uma conta (use o login com GitHub)
2. Clique em **Add New → Project**
3. Importe o repositório que você criou
4. Na tela de configuração, **antes de fazer deploy**, adicione as variáveis de ambiente:

### Variáveis de Ambiente no Vercel:

**GOOGLE_SHEET_ID**
```
Cole aqui o ID da sua planilha (o que você copiou no Passo 1.1)
```

**GOOGLE_SERVICE_ACCOUNT_JSON**
```
Cole aqui TODO o conteúdo do arquivo JSON baixado, em uma única linha
```
> Dica: Abra o arquivo JSON com um editor de texto, selecione tudo (Ctrl+A) e cole diretamente no campo do Vercel.

5. Clique em **Deploy**
6. Aguarde o deploy terminar (2-3 minutos)
7. Seu sistema estará no ar em uma URL como: `https://seu-projeto.vercel.app`

---

## Como usar o sistema

### Consultores
- Acesse `https://seu-projeto.vercel.app`
- Digite seu nome e WhatsApp — isso cria seu perfil automaticamente
- No painel, clique em **+ Nova Proposta**
- Preencha os dados do cliente e do veículo
- Marque/desmarque as coberturas incluídas
- Adicione opcionais se necessário
- Clique em **Criar Proposta**
- Use o botão **🔗 Copiar Link** e envie para o cliente

### Clientes
- O cliente recebe o link: `https://seu-projeto.vercel.app/proposta/1234567890`
- Vê a proposta completa com todas as coberturas
- Pode clicar em cada cobertura para ver os detalhes
- Ao clicar em "Quero Contratar", abre o WhatsApp do consultor automaticamente

---

## Dúvidas frequentes

**Posso ter vários consultores?**  
Sim! Cada consultor acessa o sistema pelo próprio nome e WhatsApp. Cada um vê apenas suas próprias propostas.

**Posso editar uma proposta depois de enviar?**  
Sim! No painel, clique em ✏️ Editar ao lado da proposta. O link do cliente continua o mesmo.

**O sistema é gratuito?**  
Sim! Google Sheets (gratuito) + Vercel (gratuito no plano Hobby) = R$ 0,00 por mês.
