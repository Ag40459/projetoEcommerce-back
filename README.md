# Acompanhantes Back

## Descrição

Este projeto é responsável pelo back-end do sistema de acompanhantes. Ele gerencia as contas de usuários, registra histórico de transações, como depósitos, saques e transferências, e fornece APIs para interação com o front-end do sistema.

## Tecnologias utilizadas

- Node.js
- Express.js
- PostgreSQL (Banco de dados)
- Knex.js (Query builder)
- AWS SDK (para integração com o Amazon S3)
- Bcrypt (criptografia de senhas)
- JSON Web Token (JWT)
- Multer (upload de arquivos)
- Yup (validação de dados)
- Cors (para lidar com requisições cross-origin)

## Requisitos

- Node.js (versão X.X.X)
- PostgreSQL (versão X.X.X)
- Conta na Amazon S3 (para armazenamento de arquivos)

## Instalação

1. Clone este repositório: `git clone https://github.com/Ag40459/acompanhantes-back.git`
2. Navegue até o diretório do projeto: `cd acompanhantes-back`
3. Instale as dependências: `npm install`
4. Crie um arquivo `.env` na raiz do projeto e configure as variáveis de ambiente de acordo com o arquivo `.env.example`.
5. Execute as migrações do banco de dados: `npx knex migrate:latest`
6. Inicie o servidor: `npm run dev`

## Configuração

Antes de iniciar o servidor, você precisa configurar as variáveis de ambiente no arquivo `.env`. Aqui estão as variáveis que você precisa configurar:

- `DB_HOST`: endereço do banco de dados PostgreSQL.
- `DB_PORT`: porta do banco de dados PostgreSQL.
- `DB_NAME`: nome do banco de dados PostgreSQL.
- `DB_USER`: usuário do banco de dados PostgreSQL.
- `DB_PASSWORD`: senha do banco de dados PostgreSQL.
- `JWT_SECRET`: chave secreta para geração de tokens JWT.
- `AWS_ACCESS_KEY_ID`: ID da chave de acesso da sua conta na Amazon S3.
- `AWS_SECRET_ACCESS_KEY`: Chave de acesso secreta da sua conta na Amazon S3.
- `AWS_REGION`: Região da Amazon S3.
- `AWS_BUCKET_NAME`: Nome do bucket da Amazon S3 para armazenamento de arquivos.

Certifique-se de configurar corretamente essas variáveis de acordo com o seu ambiente.

## Uso

A API fornecida por este projeto possui as seguintes rotas principais:

- `/api/users`: Rotas relacionadas à gestão de usuários.
- `/api/accounts`: Rotas relacionadas à gestão de contas.
- `/api/transactions`: Rotas relacionadas à gestão de transações.

Você pode consultar o arquivo `index.js` e os arquivos dentro do diretório `routes/` para obter mais detalhes sobre as rotas disponíveis e seus respectivos controladores.

## Contribuição

Contribuições são bem-vindas! Se você quiser contribuir para este projeto, siga as diretrizes de contribuição descrit
