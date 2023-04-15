##Tabela de contas:

id (chave primária)
user_id (chave estrangeira referenciando a tabela de usuários)
balance (saldo atual da conta)
total_credits (total de créditos já recebidos na conta)
status (status da conta, pode ser "ativo", "bloqueado" ou "em análise")
created_at (data de criação da conta)
updated_at (data da última atualização da conta)
deposit_pending (valor do depósito que está em análise para ser creditado na conta)
deposit_confirmed (responsável por armazenar o valor total dos depósitos já confirmados na conta do usuário) 
bonus_pending (valor do bônus que está em análise para ser creditado na conta)
deposit_history (histórico de depósitos realizados na conta)
bonus_history (histórico de bônus recebidos na conta)
withdrawal_history (histórico de saques realizados na conta)
transfer_history (histórico de transferências realizadas da conta para outras contas)

##Tabela "users":

id (chave primária): identificador único do usuário.
name: nome completo do usuário.
birthdate: data de nascimento do usuário.
phone: número de telefone do usuário.
email: endereço de email do usuário.
category: categoria do usuário (por exemplo, cliente, funcionário, administrador).
password: senha criptografada do usuário.
confirm_password: campo de confirmação de senha.
address: endereço completo do usuário.
credits: quantidade de créditos disponíveis na conta do usuário.
plan: plano de assinatura do usuário (se houver).
image_url: URL da imagem do perfil do usuário.
created_at: data de criação do registro do usuário na tabela.
updated_at: data da última atualização do registro do usuário na tabela.