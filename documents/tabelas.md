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
created_at: data de criação do registro do usuário na tabela.
updated_at: data da última atualização do registro do usuário na tabela.


















import api from "../../services/api";
import { Link } from 'react-router-dom';
import useNavBarProvider from '../../hooks/useNavBarProvider';
import { useState } from 'react';
import './editProfileProfessional.css';

function EditProfileProfessional() {
    const { userUnifiedTable } = useNavBarProvider();

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState(userUnifiedTable);

    if (!userUnifiedTable) {
        return null;
    }
    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handlePhoneChange = (event) => {
        let phone = event.target.value;
        phone = phone.replace(/\D/g, '');
        phone = '+55 ' + phone.replace(/^(\d{2})(\d)/g, '$1 $2');
        phone = phone.replace(/(\d{5})(\d)/, '$1 $2');
        setFormData({ ...formData, user: { ...formData.user, phone } });
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const response = await api.patch(`/users/updateUser/${userUnifiedTable.user.id}`, formData);
            if (response.status === 200) {
                setIsLoading(false);
                alert('Dados atualizados com sucesso!');
            }
        } catch (error) {
            setIsLoading(false);
            alert('Erro ao atualizar dados.');
            console.error(error);
        }
    };

    console.log(userUnifiedTable.user.phone);
    return (
        <div className='container-editProfileProfessional'>
            <div className='container-back-page'>
                <Link className='link' to='/professional-home'>
                    Voltar
                </Link>
            </div>
            <h1>Atualizar Perfil</h1>

            <form
                onSubmit={handleSubmit}
            >
                <div className='container-editProfileProfessional-inputLabel'>
                    <input
                        type='text'
                        id='name'
                        name='name'
                        placeholder='Nome'
                        defaultValue={userUnifiedTable.user.name}
                        onChange={handleChange}
                    />
                    <input
                        type='date'
                        id='birthdate'
                        name='birthdate'
                        placeholder='Data de Nascimento'
                        defaultValue={userUnifiedTable.user.birthdate}
                        onChange={handleChange}
                    />

                    <input
                        type='text'
                        id='phone'
                        name='phone'
                        placeholder='Telefone'
                        defaultValue={!userUnifiedTable.user.phone ? `+55 ${userUnifiedTable.user.phone}` : userUnifiedTable.user.phone}
                        // pattern='[0-9]*'
                        maxLength='17'
                        onInput={handlePhoneChange}
                    />

                    <input
                        type='text'
                        id='street'
                        name='street'
                        placeholder='Rua'
                        defaultValue={userUnifiedTable.user.street}
                        onChange={handleChange}
                    />

                    <input
                        type='text'
                        id='house-number'
                        name='houseNumber'
                        placeholder='Número'
                        defaultValue={userUnifiedTable.user.houseNumber}
                        onChange={handleChange}
                    />

                    <input
                        type='text'
                        id='neighborhood'
                        name='neighborhood'
                        placeholder='Bairro'
                        defaultValue={userUnifiedTable.user.neighborhood}
                        onChange={handleChange}
                    />

                    <input
                        type='text'
                        id='city'
                        name='city'
                        placeholder='Cidade'
                        defaultValue={userUnifiedTable.user.city}
                        onChange={handleChange}
                    />

                    <input
                        type='text'
                        id='zipcode'
                        name='zipcode'
                        placeholder='CEP'
                        defaultValue={userUnifiedTable.user.zipcode}
                        onChange={handleChange}
                    />

                    {/* <select
                    className='select-plan'
                    id='category'
                    name='category'
                    placeholder='Categoria'>
                    <option value=''>
                        Selecione uma categoria
                    </option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select> */}

                    <input
                        type='password'
                        id='password'
                        name='password'
                        placeholder='Senha'
                        defaultValue={userUnifiedTable.user.password}
                        onChange={handleChange}
                    />

                    <input
                        type='password'
                        id='confirm-password'
                        name='confirmPassword'
                        placeholder='Confirme a senha'
                        defaultValue={userUnifiedTable.user.confirm_password}
                        onChange={handleChange}
                    />

                    <input
                        type='file'
                        id='image'
                        name='image'
                        accept='image/*'
                        placeholder='Imagem' />

                    <button type='submit'>
                        Salvar
                    </button>
                </div>
            </form>
            <footer>
                <a href=''>Termos e Condições</a>
                <a href=''>Politica de Privacidade</a>
                <a href=''>Fale Conosco</a>
                <a id='end' href=''>Promover seus Anúncios</a>
            </footer>
        </div>

    )
}

export default EditProfileProfessional;

esse é o Css desse código:

.container-editProfileProfessional {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    max-width: 100vw;
    min-height: calc(100vh - 14rem);
}

.container-editProfileProfessional h1 {
    margin-top: 2rem;
    margin-bottom: 1.5rem;
    font-size: 2rem;
    font-weight: 700;
    color: #333333;
}

.container-editProfileProfessional form {
    width: 80%;
    /* border: 1px solid red; */
}

.container-editProfileProfessional-inputLabel {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 1rem;
}

.container-editProfileProfessional form label {
    font-size: 2.2rem;
    font-weight: 600;
    color: #333333;
}

#image {
    display: flex;
    font-size: smaller;
}

.container-editProfileProfessional form input {
    width: 100%;
    height: 51px;
    left: 123px;
    top: 308px;
    padding: 1rem;
    font-size: larger;
    background: #FDFAFA;
    border-radius: 8px;
    border: 1px solid #E8E8E8;
}

.container-editProfileProfessional form select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M18 9L12 15L6 9' stroke='%23808080' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right 0.75rem center;
    background-size: 1.2rem;
    padding-right: 2.5rem;
}

.select-plan {
    width: 100%;
    height: 51px;
    left: 123px;
    top: 308px;
    padding: 1rem;
    font-size: larger;
    background: #FDFAFA;
    border-radius: 8px;
    border: 1px solid #E8E8E8;
}


.container-editProfileProfessional form button {
    width: 100%;
    padding: 0.8rem;
    margin-bottom: 1.5rem;
    border-radius: 0.25rem;
    background-color: #222222;
    color: #FFFFFF;
    font-size: 1.1rem;
    font-weight: 600;
    text-transform: uppercase;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.container-editProfileProfessional form button:hover {
    background-color: #444444;
}

.container-editProfileProfessional footer {
    /* display: flex; */
    /* align-items: center; */
    /* justify-content: center; */
    /* width: 100%; */
    /* height: 3.5rem; */
    /* background-color: /#EEEEEE; */
    /* color: #333333; */
    /* font-size: 0.9rem; */
    /* font-weight: 600; */
    /* position: fixed; */
    /* bottom: 0; */
}



/* 

.container-editProfileProfessional footer a {
    margin-right: 1rem;
    color: #333333;
}

.container-editProfileProfessional footer a:hover {
    text-decoration: underline;
    color: #222222;
} */

.container-editProfileProfessional #end {
    margin-left: auto;
    margin-right: 1rem;
}


import api from "../../services/api";
import { Link } from 'react-router-dom';
import useNavBarProvider from '../../hooks/useNavBarProvider';
import { useState } from 'react';
import './editProfileProfessional.css';

function EditProfileProfessional() {
    const { userUnifiedTable } = useNavBarProvider();

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState(userUnifiedTable);

    if (!userUnifiedTable) {
        return null;
    }
    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handlePhoneChange = (event) => {
        let phone = event.target.value;
        phone = phone.replace(/\D/g, '');
        phone = '+55 ' + phone.replace(/^(\d{2})(\d)/g, '$1 $2');
        phone = phone.replace(/(\d{5})(\d)/, '$1 $2');
        setFormData({ ...formData, user: { ...formData.user, phone } });
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const response = await api.patch(`/users/updateUser/${userUnifiedTable.user.id}`, formData);
            if (response.status === 200) {
                setIsLoading(false);
                alert('Dados atualizados com sucesso!');
            }
        } catch (error) {
            setIsLoading(false);
            alert('Erro ao atualizar dados.');
            console.error(error);
        }
    };

    console.log(userUnifiedTable.user.phone);
    return (
        <div className='container-editProfileProfessional'>
            <div className='container-back-page'>
                <Link className='link' to='/professional-home'>
                    Voltar
                </Link>
            </div>
            <h1>Atualizar Perfil</h1>

            <form
                onSubmit={handleSubmit}
            >
                <div className='container-editProfileProfessional-inputLabel'>
                    <input
                        type='text'
                        id='name'
                        name='name'
                        placeholder='Nome'
                        defaultValue={userUnifiedTable.user.name}
                        onChange={handleChange}
                    />
                    <input
                        type='date'
                        id='birthdate'
                        name='birthdate'
                        placeholder='Data de Nascimento'
                        defaultValue={userUnifiedTable.user.birthdate}
                        onChange={handleChange}
                    />

                    <input
                        type='text'
                        id='phone'
                        name='phone'
                        placeholder='Telefone'
                        defaultValue={!userUnifiedTable.user.phone ? `+55 ${userUnifiedTable.user.phone}` : userUnifiedTable.user.phone}
                        // pattern='[0-9]*'
                        maxLength='17'
                        onInput={handlePhoneChange}
                    />

                    <input
                        type='text'
                        id='street'
                        name='street'
                        placeholder='Rua'
                        defaultValue={userUnifiedTable.user.street}
                        onChange={handleChange}
                    />

                    <input
                        type='text'
                        id='house-number'
                        name='houseNumber'
                        placeholder='Número'
                        defaultValue={userUnifiedTable.user.houseNumber}
                        onChange={handleChange}
                    />

                    <input
                        type='text'
                        id='neighborhood'
                        name='neighborhood'
                        placeholder='Bairro'
                        defaultValue={userUnifiedTable.user.neighborhood}
                        onChange={handleChange}
                    />

                    <input
                        type='text'
                        id='city'
                        name='city'
                        placeholder='Cidade'
                        defaultValue={userUnifiedTable.user.city}
                        onChange={handleChange}
                    />

                    <input
                        type='text'
                        id='zipcode'
                        name='zipcode'
                        placeholder='CEP'
                        defaultValue={userUnifiedTable.user.zipcode}
                        onChange={handleChange}
                    />

                    {/* <select
                    className='select-plan'
                    id='category'
                    name='category'
                    placeholder='Categoria'>
                    <option value=''>
                        Selecione uma categoria
                    </option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select> */}

                    <input
                        type='password'
                        id='password'
                        name='password'
                        placeholder='Senha'
                        defaultValue={userUnifiedTable.user.password}
                        onChange={handleChange}
                    />

                    <input
                        type='password'
                        id='confirm-password'
                        name='confirmPassword'
                        placeholder='Confirme a senha'
                        defaultValue={userUnifiedTable.user.confirm_password}
                        onChange={handleChange}
                    />

                    <input
                        type='file'
                        id='image'
                        name='image'
                        accept='image/*'
                        placeholder='Imagem' />

                    <button type='submit'>
                        Salvar
                    </button>
                </div>
            </form>
            <footer>
                <a href=''>Termos e Condições</a>
                <a href=''>Politica de Privacidade</a>
                <a href=''>Fale Conosco</a>
                <a id='end' href=''>Promover seus Anúncios</a>
            </footer>
        </div>

    )
}

export default EditProfileProfessional;

esse é o Css desse código:

.container-editProfileProfessional {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    max-width: 100vw;
    min-height: calc(100vh - 14rem);
}

.container-editProfileProfessional h1 {
    margin-top: 2rem;
    margin-bottom: 1.5rem;
    font-size: 2rem;
    font-weight: 700;
    color: #333333;
}

.container-editProfileProfessional form {
    width: 80%;
    /* border: 1px solid red; */
}

.container-editProfileProfessional-inputLabel {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 1rem;
}

.container-editProfileProfessional form label {
    font-size: 2.2rem;
    font-weight: 600;
    color: #333333;
}

#image {
    display: flex;
    font-size: smaller;
}

.container-editProfileProfessional form input {
    width: 100%;
    height: 51px;
    left: 123px;
    top: 308px;
    padding: 1rem;
    font-size: larger;
    background: #FDFAFA;
    border-radius: 8px;
    border: 1px solid #E8E8E8;
}

.container-editProfileProfessional form select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M18 9L12 15L6 9' stroke='%23808080' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right 0.75rem center;
    background-size: 1.2rem;
    padding-right: 2.5rem;
}

.select-plan {
    width: 100%;
    height: 51px;
    left: 123px;
    top: 308px;
    padding: 1rem;
    font-size: larger;
    background: #FDFAFA;
    border-radius: 8px;
    border: 1px solid #E8E8E8;
}


.container-editProfileProfessional form button {
    width: 100%;
    padding: 0.8rem;
    margin-bottom: 1.5rem;
    border-radius: 0.25rem;
    background-color: #222222;
    color: #FFFFFF;
    font-size: 1.1rem;
    font-weight: 600;
    text-transform: uppercase;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.container-editProfileProfessional form button:hover {
    background-color: #444444;
}

.container-editProfileProfessional footer {
    /* display: flex; */
    /* align-items: center; */
    /* justify-content: center; */
    /* width: 100%; */
    /* height: 3.5rem; */
    /* background-color: /#EEEEEE; */
    /* color: #333333; */
    /* font-size: 0.9rem; */
    /* font-weight: 600; */
    /* position: fixed; */
    /* bottom: 0; */
}



/* 

.container-editProfileProfessional footer a {
    margin-right: 1rem;
    color: #333333;
}

.container-editProfileProfessional footer a:hover {
    text-decoration: underline;
    color: #222222;
} */

.container-editProfileProfessional #end {
    margin-left: auto;
    margin-right: 1rem;
}

Reescreva o código seguindo as instruções:
*deverá ser incluido um novo input de placeholder Estado com id=state
*inclua uma api de cep que vc conheça gratuita, pode ser a dos correios;
*o input id=state chamar a api que foi integrada para listar os estados do brasil;
* o input de id=city devera trazer uma lista das cidade de acordo com o estado escolhido também usando a mesma lógica da api integrada;
* o input com o id=house-number fique do lado esquerdo do input de id=street e que fique em tamanho de proporção de 20% do tamanho do total do input de id=street;
* o input id= *Cidade* ficara abaixo do input id=phone;
*o input id=zipcode ficará logo abaixo do input id=phone, ele só aceitará numeros
