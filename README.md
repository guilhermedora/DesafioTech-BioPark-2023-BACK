#### Desafio | BioPark 2023!!!

### Method:
O código foi escrito em javascript seguindo o padrão Restful. No documento raiz do back está o **Dump** do sql para recriar as tabelas, localizado no mesmo diretório deste Readme. Foi utilizado o BeeKeeper para gerenciar o projeto. Para iniciar o código basta assegurar que as configuracoes do banco na pasta **./src/db** estão vigentes com as config's adotadas no seu banc, com tudo 'ok', basta dar um "yarn" no terminal do vscode para instalar as dependêcias e em seguida, "npm run dev" para rodar o projeto com a dependencia de desenvolvimento **nodemon** (recomendo) ou pode dar um "npm run hml" para rodar via **node**. De padrão iniciará na localhost do seu pc na porta 3001.

#### **Cadastrar usuário**

#### `POST` `/signup`

Essa é a rota que será utilizada para cadastrar um novo usuario no sistema.

- **Requisição**  
    Sem parâmetros de rota ou de query.  
    O corpo (body) deverá possuir um objeto com as seguintes propriedades:
    - name
    - email 
    - password 
    - category

   **Acões**  
     - Validar se o e-mail informado já existe
     - Criptografar a senha antes de persistir no banco de dados
     - Cadastrar o usuário no banco de dados

#### **Exemplo de requisição**

```javascript
// POST /signup
{
    "name": "BioPark",
    "email": "biopark@email.com",
    "password": "123456"
    "category": "Locador"
}
```

#### **Login do usuário**

#### `POST` `/signin`

Rota que permite o usuario cadastrado realizar o login no sistema.

- **Requisição**  
    Sem parâmetros de rota ou de query.  
    O corpo (body) deverá possuir um objeto com as seguintes propriedades:
  - email
  - password

**Acões**  
  - Validar os campos obrigatórios:
    - email
    - password
  - Verificar se o e-mail existe
  - Validar e-mail e senha
  - Criar token de autenticação com id do usuário

#### **Exemplo de requisição**

```javascript
// POST /signin
{
    "name": "BioPark",
    "email": "biopark@email.com"
}
```

#### **Validações do token**

```javascript
Middleware
  - Validar se o token foi enviado no header da requisição (Bearer Token)
  - Verificar se o token é válido
  - Consultar usuário no banco de dados pelo id contido no token informado
```

#### `POST` `/register-property`

Rota que permite o usuario cadastrar uma edifício ou apartamento.

- **Requisição**  
    Sem parâmetros de rota ou de query.  
    O corpo (body) deverá possuir um objeto com as seguintes propriedades:
    
    Edifício (edf):
    - type
    - building_name
    - address
    - description

    Apartamento (ap):
    - place_level
    - apartment_number
    - building_name
    - value_rent
    - description
    - available (setado por default 'true' no front)

**Acões**  
  - Validar os campos obrigatórios:
    - type
    - building_name
    - address
    - description
    - Verificar o type precisa ser: "edf" para Edificio ou "ap" para Apartamento
    - Verifica se o Edificio já existe
    - Verifica se o Apartamento já existe


#### **Exemplo de requisição**

```javascript
// POST /register-property
{
      type: "edf",
      building_name: "BioPark 1",
      address: "Rua 1",
      description: "Prédio Grande"
}
Or
{
      type: "ap"
      place_level: 1,
      apartment_number: 1,
      building_name: "BioPark 1",
      value_rent: 1000
      description: 'Apartameno Médio',
      available: false
}
```
 
#### `POST` `/list-buildings`

Rota que permite o usuario listar os Edifícios.

- **Requisição**  
    Sem parâmetros de rota ou de query.  
    a requisição do usuário deverá possuir um objeto com as seguintes propriedades:
    - id
    - category

**Acões**  
    - verifica qual é a categoria do usuário
    - retorna a lista dos edifícios:
    Locador: apenas o que foi cadastrado por ele
    Locatário: todos


#### **Exemplo de requisição**

```javascript
// POST /list-buildings
{
    id: 1,
    category: "Locador"
}
```

#### `POST` `/list-apartments`

Rota que permite o usuario listar os Apartamentos.

- **Requisição**  
    Sem parâmetros de rota ou de query.  
    a requisição do usuário deverá possuir um objeto com as seguintes propriedades:
    - id
    - category

**Acões**  
    - verifica qual é a categoria do usuário
    - retorna a lista dos prédios:
    Locador: apenas o que foi cadastrado por ele
    Locatário: todos disponíveis


#### **Exemplo de requisição**

```javascript
// POST /list-apartments
{
    id: 1,
    category: "Locador"
}
```
#### `POST` `/open-contract`

Rota que permite o locador fechar um contrato com o locatário.

- **Requisição**  
    Sem parâmetros de rota ou de query.  
    O corpo (body) deverá possuir um objeto com as seguintes propriedades:
    - name
    - email
    - renter_phone
    - building_name
    - apartment_number
    - value_rent
    - date_start
    - month_number
    - owner_id

**Acões**  
  - Validar os campos obrigatórios:
    - renter_name
    - renter_email
    - renter_phone
    - date_start
    - month_number
    - verifica o email do locatário
    - verifica a categoria do usuário:
    **locador**: fecha o contrato deixando o status e o required do contrato respectivamente true e false
    **locatário**: fecha o contrato deixando o status e o required do contrato respectivamente false e true (sinalizando o requerimento)
    - retorna o contrato

#### **Exemplo de requisição**

```javascript
// POST /open-contract
{
    name: "Gui",
    email: "gui@emai.com",
    renter_phone: "(99) 99999 9999",
    building_name: "Bio Park 1",
    apartment_number: 1,
    value_rent: 1000,
    date_start: "25/11/2022"
    month_number: 10
    owner_id: "Bio Park"
}
```

#### `POST` `/close-contract`

Rota que permite o locador fechar um contrato com o locatário.

- **Requisição**  
    Sem parâmetros de rota ou de query.  
    O corpo (body) deverá possuir um objeto com as seguintes propriedades:
    - orderFrom
    - building_name
    - apartment_number

**Acões**  
    - verifica o email do locatário
    - verifica se há contrato para o email do locatário
    - verifica a categoria do usuário:
    - retorna o status 201

**obs** o contrato não é excluido, só muda de status para 'false', fica impossibilitado de ser visto pelo usuário e salvaguarda a empresa no futuro.

#### **Exemplo de requisição**

```javascript
// POST /close-contract
{
    email: "gui@emai.com",
    building_name: "Bio Park 1",
    apartment_number: 1,
}
```

#### `GET` `/my-contracts`

Rota que permite o usuário adquirir os contratos em seu nome.

- **Requisição**  
    requerimentos do usuário  
    - id
    - category

**Acões**  
    - verifica a categoria do usuário:
    - locador: retorna contratos no seu Id
    - locatário: retorna contratos no seu Id

#### **Exemplo de requisição**

```javascript
// POST /my-contracts
{
    id: 1,
    category: "Locador"
}
```

#### `GET` `/requirements`

Rota que permite o usuário receber os contratos em seu nome.

- **Requisição**  
    Sem parâmetros de rota ou de query.  
    a requisição do usuário deverá possuir um objeto com as seguintes propriedades:
    - id

**Acões**  
    - seleciona os contratos com required=true e que contém a id do Locador.

#### **Exemplo de requisição**

```javascript
// POST /requirements
{
    id: 1
}
```

#### `GET` `/close-requirements`

Rota que permite o usuário fechar os requerimentos ativos (**require = true**) alterando o seu estado para false.

- **Requisição**  
    Sem parâmetros de rota ou de query.  
    O corpo (body) deverá possuir um objeto com as seguintes propriedades:
    - building_name
    - apartment_number
    - renter_email


**Acões**  
    - Altera os contratos com required=true para false, que contém o número do apartamento, o nome do edifício e o email do locatário.

#### **Exemplo de requisição**

```javascript
// POST /close-requiments
{
    renter_email: "gui@emai.com",
    building_name: "Bio Park 1",
    apartment_number: 1,
}
```

Obrigado por chegar até aqui!!

###### tags: `back-end` `Node.js` `APIRest` `desafio` `BioPark` `Trainee`
