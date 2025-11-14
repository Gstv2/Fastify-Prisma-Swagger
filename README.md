# 🚀 API CRUD com Fastify, TypeScript e Prisma

Este projeto implementa uma **API RESTful completa** para gerenciamento de alunos (`Students`) e professores (`Teachers`), utilizando tecnologias modernas para garantir **alta performance**, **segurança de tipos** e **persistência de dados** eficiente.

---

## ✨ Tecnologias Principais

| Tecnologia | Função |
| :--- | :--- |
| **Fastify** | Framework web de alta performance para o servidor API. |
| **TypeScript** | Garante **segurança de tipos** (Type Safety) e facilita a manutenção do código. |
| **Prisma** | ORM (Object-Relational Mapper) moderno para comunicação com o banco de dados (**SQLite**). |
| **Swagger / OpenAPI** | Geração e visualização interativa da documentação da API. |

---

## 📐 Arquitetura do Projeto

O projeto segue a **Arquitetura de Camadas** com **Injeção de Dependência (DI)** para desacoplamento e testabilidade:

* **Routes (Rotas):** Define os endpoints HTTP e armazena os Schemas JSON para a documentação Swagger e validação do Fastify. É o ponto de entrada da requisição.
* **Controllers:** Recebe a requisição (lógica HTTP), **valida a entrada**, chama o Service correspondente e formula a resposta (lógica de apresentação).
* **Services:** Contém a **lógica de negócio principal** (regras, validações complexas) e interage diretamente com o Prisma Client para acessar o banco de dados.
* **Prisma (no `server.ts`):** O cliente Prisma é inicializado como um *singleton* no `server.ts` e injetado em todas as camadas de Rotas, garantindo uma conexão eficiente e única com o banco de dados.

---

## 💾 Persistência de Dados com Prisma

O **Prisma** atua como a camada de acesso a dados, fornecendo um ORM que permite modelar seus dados de forma declarativa e interagir com o banco de dados usando código **TypeScript type-safe**.

### Modelos de Dados

O projeto inclui dois modelos persistentes no banco de dados **SQLite** (`dev.db`):

| Modelo | Campos Chave |
| :--- | :--- |
| **Student (Aluno)** | `id`, `name`, `email` (único), `course`, `enrollmentYear`. |
| **Teacher (Professor)** | `id`, `name`, `email` (único), `course`, `registrationDate`, `updateDate` (geradas automaticamente). |

---

## 📖 Documentação Interativa com Swagger

A documentação da API é gerada automaticamente usando `@fastify/swagger` e exibida por meio do **Swagger UI**.

* **Como Funciona?** Ao rodar o servidor, todos os endpoints e seus respectivos payloads (corpos de requisição) e respostas são expostos. Você pode testar todos os endpoints **CRUD** diretamente na interface do Swagger, sem precisar de ferramentas externas como Postman.

### Acessando a Documentação

Basta acessar a seguinte URL no seu navegador quando o servidor estiver ativo:

> **`http://localhost:3333/documentation`**

---

## 💻 Como Usar o Código

Siga os passos abaixo para configurar e rodar o projeto localmente.

### Pré-requisitos

* **Node.js** (versão 18 ou superior)
* **npm** (gerenciador de pacotes)

### 1. Instalação

Abra o terminal na raiz do projeto e instale todas as dependências:

```bash
npm install
```

### 2. Configuração do Banco de Dados (Prisma)
Gere o cliente Prisma e aplique as migrações para criar o arquivo do banco de dados (dev.db).

```bash
# 1. Gera o Prisma Client com base no schema.prisma
npm run prisma:generate

# 2. Aplica as migrações para criar as tabelas Student e Teacher no dev.db
npm run prisma:migrate
```

### 3. Execução
Inicie o servidor em modo de desenvolvimento com tsx:
```bash
npm run dev
```
Você verá a confirmação no console:

```bash
🚀 Servidor rodando em: http://localhost:3333
📝 Documentação Swagger em: http://localhost:3333/documentation
```

### 🧪 Teste das Funcionalidades CRUD

Use a interface do Swagger UI (http://localhost:3333/documentation) para testar o CRUD (Create, Read, Update, Delete) de ambas as entidades.

| Ação	| Endpoint	| Tipo | Corpo da Requisição (Exemplo)|
| :--- | :--- | :--- | :--- |
|Criar Professor| /teachers | POST |	{"name": "Prof. Ana", "email": "ana@uni.com", "course": "Biologia"}|
|Criar Aluno	|/students|	POST	|{"name": "Joao Silva", "email": "joao@aluno.com", "course": "Medicina", "enrollmentYear": 2024}|
|Listar Todos	|/teachers|	GET	|(Nenhum corpo)|
|Atualizar Professor	|/teachers/:id|	PUT	|{"course": "Biologia Avançada"} (Enviando apenas o campo a ser modificado)|
|Deletar	|/students/:id|	DELETE|	(Nenhum corpo)|