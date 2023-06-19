## Uso

1. Para executar a API, você precisa primeiro configurar algumas variáveis de ambiente no arquivo .env. Certifique-se de ter o Node.js instalado em seu sistema;
2. Instale as dependências do projeto executando o comando npm install no diretório raiz do projeto;
3. No arquivo index.js, você encontrará o código que inicia o servidor Express e configura as rotas. Verifique se todas as rotas estão corretamente configuradas e atualizadas de acordo com suas necessidades;
4. Para iniciar o servidor, execute o comando npm start ou node index.js. O servidor estará em execução na porta especificada no arquivo .env ou na porta 3001 por padrão;
5. Agora você pode acessar a API por meio das rotas mencionadas acima. Use ferramentas como Postman ou curl para enviar solicitações HTTP para a API e testar suas funcionalidades;
6. Certifique-se de consultar os arquivos index.js e os arquivos dentro do diretório routes/ para obter mais detalhes sobre as rotas disponíveis e seus respectivos controladores;
7. Certifique-se de consultar os arquivos index.js e os arquivos dentro do diretório routes/ para obter mais detalhes sobre as rotas disponíveis e seus respectivos controladores;
8. É altamente recomendável configurar a autenticação e autorização adequadas para proteger suas rotas e dados sensíveis. Você pode usar middlewares, como o authMiddleware, fornecido no projeto, para garantir que apenas usuários autenticados possam acessar rotas protegidas.
