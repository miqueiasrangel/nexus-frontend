# 🎨 Nexus Frontend — Dashboard de Automação & Sincronização

Interface web moderna em **React** para o sistema **Nexus**. O frontend permite a seleção e upload de até dois arquivos de lista (CSV/TXT) e da base de dados do Excel (XLSX), realizando a chamada à API do backend para cruzamento e exibindo métricas estatísticas detalhadas de sincronização em tempo real.

---

## 🛠️ Tecnologias Utilizadas

- **React** (v19)
- **Axios** (Cliente HTTP para comunicação com o backend)
- **CSS Glassmorphic Responsivo** (Grid, Flexbox, Micro-animações e temas escuros)
- **Lucide-React** (Ícones modernos)

---

## 📂 Estrutura do Repositório

```
nexus-frontend/
├── public/
│   ├── favicon.ico
│   ├── index.html
│   ├── logonexus.png             # Logo da aplicação
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Importacao.jsx        # Componente principal do Dashboard
│   │   └── Importacao.css        # Estilização Glassmorphism responsiva
│   ├── services/
│   │   └── api.js                # Instância do Axios (http://localhost:3333)
│   ├── App.js
│   └── index.js
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Configuração da Conexão com o Backend

O arquivo `src/services/api.js` está configurado por padrão para conectar ao backend local em:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333'
});

export default api;
```

Se o seu backend estiver rodando em outra URL ou porta em produção, altere o valor de `baseURL` nesse arquivo.

---

## 🚀 Como Iniciar

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Iniciar a aplicação em modo de desenvolvimento:**
   ```bash
   npm start
   ```

3. A aplicação abrirá automaticamente no seu navegador em `http://localhost:3000`.

---

## 📦 Gerar Build de Produção

Para gerar a versão otimizada de produção:

```bash
npm run build
```

Os arquivos compilados serão salvos na pasta `build/` prontos para serem hospedados (Vercel, Netlify, Nginx, S3, etc.).
