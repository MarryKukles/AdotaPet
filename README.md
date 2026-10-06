# AdotaPet 🐾

Projeto acadêmico de uma plataforma de adoção responsável de animais.

## Tecnologias

- React + Vite
- React Router
- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- Lucide React
- CSS responsivo

## Funcionalidades

- Página inicial com animais disponíveis
- Busca e filtros
- Página de detalhes do animal
- Favoritos
- Cadastro/login
- Solicitação de adoção
- Questionário de compatibilidade
- Painel do protetor/ONG
- Cadastro e gerenciamento de animais
- Persistência local em modo demonstração
- Estrutura pronta para Firebase

## Rodar o projeto

Requisitos: Node.js 20+ recomendado.

```bash
npm install
npm run dev
```

Abra a URL exibida pelo Vite.

## Firebase

Para usar Firebase de verdade:

1. Crie um projeto no Firebase.
2. Ative Authentication > Email/Password.
3. Crie um Firestore Database.
4. Crie um Storage.
5. Copie `.env.example` para `.env`.
6. Preencha as variáveis com a configuração do seu app Web Firebase.
7. Rode novamente `npm run dev`.

Sem Firebase configurado, o projeto entra automaticamente em **modo demonstração**, usando localStorage. Isso permite apresentar as telas e fluxos mesmo sem backend.

## Usuários de demonstração

Você pode criar qualquer conta pela tela de cadastro.

Para testar o painel de protetor, na tela de cadastro selecione:
`Sou ONG / Protetor`.

## ODS

O projeto pode ser relacionado principalmente à ODS 11 e, como relação complementar, à ODS 15.
