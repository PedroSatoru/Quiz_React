# Aplicativo de Quiz em React Native

Este projeto foi desenvolvido como parte de um trabalho acadêmico e tem como objetivo a criação de um aplicativo de quiz interativo, utilizando **React Native**. O app permite que o usuário faça login, participe de um quiz com até 51 perguntas, registre sua maior pontuação e visualize o ranking dos maiores pontuadores.

 <img src="Imagens_quiz/Perguntas.jpeg" width="300">

## Sumário

- [Visão Geral](#visão-geral)
- [Componentes Utilizados](#componentes-utilizados)
- [Como Funciona o Aplicativo](#como-funciona-o-aplicativo)
  - [Tela de Login e Cadastro](#tela-de-login-e-cadastro)
  - [Tela do Quiz](#tela-do-quiz)
  - [Tela de Ranking](#tela-de-ranking)
- [Instruções de Uso](#instruções-de-uso)
- [Código](#código)
- [Autores](#autores)

## Visão Geral

O projeto é um aplicativo de quiz com as seguintes funcionalidades:

1. **Tela de Login e Cadastro**: O usuário deve fazer login ou se cadastrar para acessar o quiz.
<img src="Imagens_quiz/TelaCadastro.jpeg" width="300">
<img src="Imagens_quiz/TelaLogin.jpeg" width="300">  
2. **Tela de Quiz**: O usuário responde perguntas de múltipla escolha e tem a opção de avançar ou salvar sua pontuação.
 <img src="Imagens_quiz/Perguntas.jpeg" width="300">
3. **Tela de Ranking**: O app exibe o ranking dos cinco maiores pontuadores.
 <img src="Imagens_quiz/TelaRanking.jpeg" width="300">

Este aplicativo é desenvolvido com **React Native** e utiliza o **AsyncStorage** para gerenciamento de autenticação e armazenamento de pontuação.

## Componentes Utilizados

- **React Native**: Framework para desenvolvimento do aplicativo móvel.
- **AsyncStorage**: Para login, cadastro de usuários, pontuações e rankings.
- **React Navigation**: Para navegação entre as telas do aplicativo.
- **Axios**: Para fazer requisições HTTP se necessário.

## Como Funciona o Aplicativo

### Tela de Login e Cadastro

Na tela inicial, o usuário é apresentado com duas opções: **Login** ou **Cadastro**. O login é feito através de e-mail e senha utilizando **AsyncStorage**. Caso o usuário ainda não tenha uma conta, ele pode se cadastrar diretamente na mesma tela.

### Tela do Quiz

Após o login bem-sucedido, o usuário é direcionado para a tela do **quiz**. O quiz contém até 50 perguntas de múltipla escolha. O usuário deve responder cada pergunta antes de avançar para a próxima. A pontuação é atualizada conforme as respostas são fornecidas.

- **Regras da Tela do Quiz**:
  - O usuário deve responder a uma pergunta antes de prosseguir para a próxima.
  - Quando uma pergunta for respondida corretamente, um som de confirmação será tocado.
  - Se o usuário quiser salvar sua pontuação antes de completar o quiz, ele pode optar por isso a qualquer momento.

### Tela de Ranking

Após o fim do quiz, ou ao salvar a pontuação, o aplicativo direciona o usuário para a tela de **ranking**, onde ele pode visualizar os cinco maiores pontuadores, ordenados do maior para o menor.

- **Regras da Tela de Ranking**:
  - Os cinco maiores pontuadores são listados na tela.
  - O ranking é atualizado sempre que um novo usuário ou pontuação superior for registrado.

## Instruções de Uso

1. Clone ou baixe o repositório.
2. Instale as dependências com `npm install` ou `yarn install`.
3. Configure o AsyncStorage e adicione as credenciais no projeto.
4. Execute o aplicativo com `npm start` ou `yarn start`.
5. Abra o aplicativo no seu dispositivo ou emulador.
6. Faça login ou crie uma nova conta.
7. Participe do quiz, respondendo as perguntas e salvando sua pontuação.
8. Verifique o seu ranking e veja como se compara com outros jogadores.

## Código

O código do aplicativo foi desenvolvido utilizando **React Native**, com a biblioteca de navegação **React Navigation** para a transição entre as telas. Para a comunicação com o AsyncStorage, utilizamos as bibliotecas **AsyncStorage Authentication** e **Firestore**.

## Autores

- Pedro Henrique Satoru
- Pedro Henrique Correia de Oliveira
