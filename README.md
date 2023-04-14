# acompanhantes-back
Back-end do Projeto Lista VIP
Este projeto é responsável pela parte do back-end da plataforma de vendas Lista VIP. Ele foi desenvolvido utilizando Node.js e o banco de dados PostgreSQL.

Dependências Externas Utilizadas
O projeto utiliza as seguintes dependências externas:

bcryptjs: ^2.4.3
cors: ^2.8.5
dotenv: ^10.4.0
express: ^4.17.2
helmet: ^4.6.0
jsonwebtoken: ^8.5.1
pg: ^8.7.1
sequelize: ^6.6.5
Como rodar o projeto
Para rodar o projeto, siga os seguintes passos:

Clone este repositório em sua máquina local.
Abra o terminal na pasta do projeto e execute o comando npm install para instalar as dependências necessárias.
Crie um arquivo .env na raiz do projeto com as informações do banco de dados (host, usuário, senha, nome do banco).
Execute o comando npx sequelize-cli db:migrate para criar as tabelas do banco de dados.
Execute o comando npm run dev para rodar o projeto em modo de desenvolvimento.

