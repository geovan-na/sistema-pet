# PetGestão — Sistema de Gestão para Clínicas Veterinárias e Pet Shops

---

## 2. Identificação Acadêmica

* **Instituição de Ensino:** Senac
* **Curso:** Técnico em Desenvolvimento de Sistemas
* **Disciplina:** A ser definido pela equipe
* **Orientador:** Profº Hudson Neves

---

## 3. Descrição

O **PetGestão** é um sistema web responsivo com foco em experiência mobile (*Mobile-First*), desenvolvido para otimizar e centralizar a rotina operacional de clínicas veterinárias, pet shops e profissionais autônomos do setor pet. O sistema substitui o controle manual por papéis e planilhas por uma plataforma digital segura, intuitiva e organizada.

---

## 4. Objetivos

### Objetivo Geral
Prover uma solução digital centralizada para a gestão de tutores, pets e equipe de funcionários, permitindo o acompanhamento rápido de cadastros e reduzindo a perda de dados de atendimento.

### Problema que o Sistema Resolve
* **Desorganização de Registros:** Elimina a dispersão de fichas em papéis e planilhas desconectadas.
* **Perda de Vínculo:** Garante a associação obrigatória entre cada pet e seu tutor responsável.
* **Segurança de Dados:** Impede a exclusão acidental de tutores que ainda possuem animais sob sua responsabilidade.
* **Controle de Acesso:** Restringe funcionalidades administrativas (como gestão de funcionários) apenas a usuários com perfil autorizado.

### Público-Alvo
* Clínicas veterinárias
* Pet shops e centros de estética animal
* Veterinários e tosadores autônomos
* Recepcionistas e gestores de atendimento

---

## 5. Funcionalidades

### Landing Page Institucional
* Apresentação moderna com tema visual institucional em tons de verde.
* Seção de funcionalidades, fluxo de funcionamento e depoimentos.
* Exibição das filiais físicas da clínica com telefones e endereços.
* Atalhos diretos para o portal de login.

### Autenticação e Controle de Acesso
* Login corporativo integrado ao banco de dados.
* Níveis de permissão diferenciados:
  * **Administrador (`admin`):** Acesso total ao sistema, incluindo a gestão da equipe de funcionários.
  * **Funcionário Comum (`comum`):** Acesso ao gerenciamento operacional de tutores e pets.
* Guarda de rotas no frontend e validação no backend.
* Encerramento de sessão (*Logout*) e armazenamento seguro em `localStorage`.

### Painel Principal (Dashboard)
* Contadores estatísticos numéricos atualizados em tempo real.
* Atalhos de navegação rápida para cadastros e consultas.

### Gestão de Tutores (CRUD)
* Cadastro de tutores com campos: Nome Completo, Telefone, E-mail e Endereço.
* Listagem em cards otimizados para telas de smartphone.
* Busca dinâmica em tempo real por nome, e-mail ou telefone.
* Edição e exclusão com confirmação via modal *bottom sheet*.
* **Regra de Integridade:** Bloqueio de exclusão para tutores vinculados a pets ativos (Retorno HTTP 409).

### Gestão de Pets (CRUD)
* Cadastro de pets com campos: Nome, Espécie, Raça, Sexo, Data de Nascimento, Peso e Observações.
* Vínculo obrigatório com tutor cadastrado via dropdown dinâmico.
* Filtros rápidos por chips de espécie (Cachorros, Gatos, Aves, Outros).
* Exibição dos dados do tutor integrado via consulta `JOIN`.

### Gestão de Equipe / Funcionários (Apenas Admin)
* Cadastro de novos membros da equipe com definição de cargo e permissão (`admin` ou `comum`).
* Edição de dados e alteração de senha.
* Proteção contra autoexclusão do administrador logado.

---

## 6. Tecnologias Utilizadas

### Frontend
* **React 18** (Biblioteca principal de UI)
* **Vite** (Ferramenta de build e desenvolvimento rápido)
* **React Router DOM v6** (Roteamento de rotas e guias de acesso)
* **Axios** (Cliente HTTP para comunicação com a API REST)
* **CSS3 Vanila** (Design System Mobile-First sem bibliotecas pesadas de UI)

### Backend
* **Node.js** (Ambiente de execução JavaScript)
* **Express.js** (Framework para construção de APIs RESTful)
* **Helmet** (Segurança de cabeçalhos HTTP)
* **CORS** (Controle de acesso entre origens cruzadas)
* **Express Rate Limit** (Proteção contra requisições excessivas)

### Banco de Dados
* **SQLite3** (Persistência local / fallback resiliente em arquivo e memória)
* **Aiven MySQL** (Banco de dados relacional gerenciado na nuvem com criptografia SSL)

### Hospedagem / Deploy
* **Vercel** (Hospedagem do Frontend React)
* **Render.com** (Hospedagem da API Node.js no ambiente Linux Cloud)

---

## 7. Arquitetura da Solução

O sistema utiliza a arquitetura cliente-servidor desacoplada baseada no padrão REST:

```
[ Cliente / Mobile Browser ]
             │
      (HTTP REST / JSON)
             │
             ▼
   [ Vercel - React SPA ]
             │
      (Axios Client API)
             │
             ▼
  [ Render.com - Node.js Express ]
             │
     (MySQL Driver + SSL)
             │
             ▼
   [ Aiven Cloud MySQL DB ]
```

---

## 8. Modelagem do Banco de Dados

### Tabela `tutores`
| Campo | Tipo | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | `INTEGER / INT` | `PRIMARY KEY, AUTOINCREMENT` | Identificador único do tutor |
| `nome` | `VARCHAR(150)` | `NOT NULL` | Nome completo |
| `telefone` | `VARCHAR(30)` | `NULLABLE` | Telefone para contato |
| `email` | `VARCHAR(150)` | `NULLABLE` | E-mail |
| `endereco` | `VARCHAR(255)` | `NULLABLE` | Endereço residencial |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Data de cadastro |

### Tabela `pets`
| Campo | Tipo | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | `INTEGER / INT` | `PRIMARY KEY, AUTOINCREMENT` | Identificador único do pet |
| `nome` | `VARCHAR(100)` | `NOT NULL` | Nome do animal |
| `especie` | `VARCHAR(50)` | `NOT NULL` | Espécie (Cachorro, Gato, etc.) |
| `raca` | `VARCHAR(100)` | `NULLABLE` | Raça do animal |
| `sexo` | `VARCHAR(20)` | `NULLABLE` | Sexo (Macho, Fêmea) |
| `data_nascimento`| `DATE / TEXT` | `NULLABLE` | Data de nascimento |
| `peso` | `DECIMAL(6,2)` | `NULLABLE` | Peso em quilogramas |
| `observacoes` | `TEXT` | `NULLABLE` | Notas médicas ou comportamento |
| `tutor_id` | `INTEGER / INT` | `NOT NULL, FOREIGN KEY` | Chave estrangeira referente a `tutores.id` |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Data de cadastro |

### Tabela `funcionarios`
| Campo | Tipo | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | `INTEGER / INT` | `PRIMARY KEY, AUTOINCREMENT` | Identificador único do funcionário |
| `nome` | `VARCHAR(150)` | `NOT NULL` | Nome do colaborador |
| `email` | `VARCHAR(150)` | `NOT NULL, UNIQUE` | E-mail corporativo de acesso |
| `senha` | `VARCHAR(255)` | `NOT NULL` | Senha de autenticação |
| `cargo` | `VARCHAR(100)` | `NOT NULL` | Cargo ocupado na clínica |
| `role` | `VARCHAR(20)` | `DEFAULT 'comum'` | Nível de permissão (`admin` ou `comum`) |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Data de cadastro |

---

## 9. Pré-requisitos

Para executar o projeto localmente em ambiente de desenvolvimento, são necessários:

* **Node.js** (versão 18.0.0 ou superior)
* **npm** (gerenciador de pacotes do Node)
* Navegador web moderno (Google Chrome, Mozilla Firefox, Microsoft Edge ou Safari)
* Git instalado no sistema

---

## 10. Instalação

1. Clone o repositório do projeto:
   ```bash
   git clone https://github.com/geovan-na/sistema-pet.git
   cd sistema-pet
   ```

2. Instale as dependências do **Backend**:
   ```bash
   cd backend
   npm install
   ```

3. Instale as dependências do **Frontend**:
   ```bash
   cd ../frontend
   npm install
   ```

---

## 11. Como Executar

### 1. Iniciar o Backend (Servidor API)
No diretório `backend`:
```bash
npm run dev
```
O servidor responderá no endereço `http://localhost:3001` (Health Check: `http://localhost:3001/api/health`).

### 2. Iniciar o Frontend (Aplicação React)
No diretório `frontend`:
```bash
npm run dev
```
A aplicação abrirá no endereço local `http://localhost:5173` ou `http://localhost:5174`.

---

## 12. Estrutura do Projeto

```text
sistema-pet/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── funcionarioController.js
│   │   │   ├── petController.js
│   │   │   └── tutorController.js
│   │   ├── database/
│   │   │   ├── connection.js
│   │   │   └── init.sql
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   └── validate.js
│   │   ├── routes/
│   │   │   ├── funcionarioRoutes.js
│   │   │   ├── petRoutes.js
│   │   │   └── tutorRoutes.js
│   │   └── server.js
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── images/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AppLayout.css
│   │   │   └── Layout.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── FuncionarioForm.jsx
│   │   │   ├── FuncionarioList.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── PetForm.jsx
│   │   │   ├── PetList.jsx
│   │   │   ├── TutorForm.jsx
│   │   │   └── TutorList.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .gitignore
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 13. Exemplos de Uso

### Credenciais Padrão para Testes

#### Administrador (Permissão Total)
* **E-mail:** `admin@petgestao.com`
* **Senha:** `senha123`

#### Funcionário Comum (Operacional)
* **E-mail:** `vet@petgestao.com`
* **Senha:** `senha123`

---

## 14. API (Endpoints)

### Autenticação
* `POST /api/login` — Autentica o usuário e retorna os dados de sessão.

### Tutores
* `GET /api/tutores` — Retorna a lista completa de tutores.
* `GET /api/tutores/:id` — Retorna os dados de um tutor específico.
* `POST /api/tutores` — Cadastra um novo tutor.
* `PUT /api/tutores/:id` — Atualiza dados do tutor.
* `DELETE /api/tutores/:id` — Remove um tutor (se não houver pets vinculados).

### Pets
* `GET /api/pets` — Retorna a lista de pets com nome do tutor via JOIN.
* `GET /api/pets/:id` — Retorna os dados de um pet específico.
* `POST /api/pets` — Cadastra um novo pet associado a um tutor existente.
* `PUT /api/pets/:id` — Atualiza dados do pet.
* `DELETE /api/pets/:id` — Remove um pet.

### Funcionários
* `GET /api/funcionarios` — Retorna a lista de colaboradores (Apenas Admin).
* `GET /api/funcionarios/:id` — Retorna os dados de um funcionário especifico.
* `POST /api/funcionarios` — Cadastra um novo colaborador.
* `PUT /api/funcionarios/:id` — Atualiza dados e permissões do colaborador.
* `DELETE /api/funcionarios/:id` — Remove um colaborador.

---

## 15. Capturas de Tela

> *Insira aqui as capturas de tela da aplicação em produção.*

```markdown
<!-- Exemplo de como inserir capturas de tela -->
![Landing Page](frontend/public/images/hero-pets.jpg)
![Dashboard Mobile](frontend/public/images/dashboard-mockup.jpg)
```

---

## 16. Equipe do Projeto

* Geovanna (Desenvolvedora Principal)
* A ser definido pela equipe

---

## 17. Melhorias Futuras

* Implementação de agendamento online de consultas e banho/tosa.
* Prontuário médico veterinário com histórico de vacinas e exames.
* Módulo de controle financeiro e emissão de notas de serviço.
* Envio automático de lembretes via WhatsApp para os tutores.

---

## 18. Licença

A ser definido pela equipe
