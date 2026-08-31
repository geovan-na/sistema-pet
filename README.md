# 🐾 Sistema de Gestão Pet

Sistema web para gestão de pets, desenvolvido com **React** + **Node.js/Express** + **MySQL**.

## Estrutura do Projeto

```
sistema-pet/
├── frontend/          # React (Vite)
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── App.jsx
│       └── main.jsx
├── backend/           # Node.js + Express
│   └── src/
│       ├── controllers/
│       ├── routes/
│       ├── services/
│       ├── database/
│       └── server.js
└── README.md
```

## Pré-requisitos

- Node.js (v18+)
- MySQL (v8+)

## Configuração do Banco de Dados

1. Abra o MySQL e execute o script:
```sql
SOURCE backend/src/database/init.sql
```

2. Configure o arquivo `backend/.env` com suas credenciais do MySQL.

## Como rodar

### Backend
```bash
cd backend
npm install
npm run dev
```
O servidor estará em `http://localhost:3001`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
O app estará em `http://localhost:5173`

## API Endpoints

### Tutores
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/tutores | Listar todos |
| GET | /api/tutores/:id | Buscar por ID |
| POST | /api/tutores | Criar |
| PUT | /api/tutores/:id | Atualizar |
| DELETE | /api/tutores/:id | Excluir |

### Pets
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/pets | Listar todos |
| GET | /api/pets/:id | Buscar por ID |
| POST | /api/pets | Criar |
| PUT | /api/pets/:id | Atualizar |
| DELETE | /api/pets/:id | Excluir |

### Health Check
```
GET /api/health → { "status": "ok" }
```
