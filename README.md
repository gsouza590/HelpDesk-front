# HelpDesk Front
![NPM](https://img.shields.io/npm/l/react)

## Sobre
Este projeto de código-fonte exemplifica o front-end em Angular 17 de um aplicativo de HelpDesk, consumindo uma API backend desenvolvida em Java.

## Tecnologias Utilizadas

1. **Angular 17**
2. **ngx-mask**
3. **Angular Material**
4. **Typescript 5.2.0**
   
## Funcionalidades:

1. **Gestão de Chamados:Criação, leitura, atualização e exclusão (CRUD) de chamados técnicos. Listagem de todos os chamados com informações detalhadas.**
2. **Gestão de Clientes:Cadastro de novos clientes. Atualização e exclusão de informações de clientes.**
3. **Gestão de Técnicos: Cadastro de novos técnicos. Atualização e exclusão de informações de técnicos. **
4. **Autenticação e Autorização: Login e logout de usuários. Controle de acesso com diferentes níveis de permissões.**
5. **Interação entre Técnicos e Clientes:Comunicação eficiente entre técnicos e clientes relacionada a chamados.Notificações ou alertas sobre atualizações nos chamados.**
6. **Interface de Usuário Responsiva: Desenvolvimento de uma interface de usuário moderna e responsiva.**


## Estrutura do Projeto

- **app**: Contém o código principal da aplicação Angular, incluindo módulos, componentes, serviços, modelos, interceptadores e outros artefatos específicos da aplicação.

- **auth**: Possui código relacionado à autenticação.

- **components**: Contém subdiretórios para diferentes componentes da aplicação.
  - **chamado**: Componentes relacionados a chamados.
    - **chamado-create**: Componente para criar chamados.
    - **chamado-list**: Componente para listar chamados.
    - **chamado-read**: Componente para visualizar detalhes de um chamado.
    - **chamado-update**: Componente para atualizar chamados.
  - **cliente**: Componentes relacionados a clientes.
    - **cliente-create**: Componente para criar clientes.
    - **cliente-delete**: Componente para excluir clientes.
    - **cliente-list**: Componente para listar clientes.
    - **cliente-update**: Componente para atualizar clientes.
  - **header, home, login, nav**: Componentes para outras partes da aplicação.
  - **tecnico**: Componentes relacionados a técnicos.
    - **tecnico-create**: Componente para criar técnicos.
    - **tecnico-delete**: Componente para excluir técnicos.
    - **tecnico-list**: Componente para listar técnicos.
    - **tecnico-update**: Componente para atualizar técnicos.

- **config**: Contém configurações gerais da aplicação.

- **interceptors**: Contém interceptadores para requisições HTTP.

- **models**: Contém modelos de dados.

- **services**: Contém serviços utilizados pela aplicação.

- **assets**: Contém recursos estáticos, como imagens.

- **environments**: Pode conter arquivos de configuração específicos para diferentes ambientes, como produção e desenvolvimento.

## Como Utilizar

1. Clone o repositório para a sua máquina local.
2. Instale as dependências: `npm install`
3. Inicie a aplicação: `ng serve`
4. Abra o navegador e acesse `http://localhost:4200/`

## Configuração

Antes de iniciar a aplicação, certifique-se de configurar as seguintes variáveis de ambiente:

- `API_CONFIG`: Sua chave de API.
![image](https://github.com/gsouza590/HelpDesk-front/assets/72672156/307a1bc0-82b7-4df5-94b6-39af13fce66a)


## Contato
Se tiver alguma dúvida ou sugestão, entre em contato

email: gsouza590@gmail.com

linkedin: https://www.linkedin.com/in/gabrielsdomiciano/


