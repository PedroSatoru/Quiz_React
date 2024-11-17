import * as React from 'react';
import { Text, View, Button, TextInput, StyleSheet, FlatList, TouchableOpacity, Vibration } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Criação das abas de navegação (tab navigation) e navegação empilhada (stack navigation)
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


/* 
Componente responsável por gerenciar a navegação empilhada. 
Inclui as telas Login, Quiz, Resultado, e outras associadas.
*/
class Nav2 extends React.Component {
  render() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Principal} />
        <Stack.Screen name="Filmes" component={Filmes} />
        <Stack.Screen name="Resumo" component={ResumoFilme} />
        <Stack.Screen name="Quiz" component={Quiz} />
        <Stack.Screen name="Resultado" component={Resultado} />
      </Stack.Navigator>
    );
  }
}

// Tela Principal: Implementa a lógica de login. 

class Principal extends React.Component {
    // Função assíncrona para verificar se o login é válido
  async ler() {
    try {
      const senha = await AsyncStorage.getItem(this.state.usuario);
      if (senha != null && senha === this.state.senha) {
                // Navega para a tela de Quiz caso as credenciais sejam corretas
        this.props.navigation.navigate('Quiz', { nomeUsuario: this.state.usuario });
      } else {         // Exibe mensagem de erro caso o login falhe
        alert(senha ? "Senha Incorreta!" : "Usuário não encontrado!");
      }
    } catch (erro) { // Loga possíveis erros para depuração
      console.log(erro);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Usuário:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(texto) => this.setState({ usuario: texto })}
          placeholder="Digite seu usuário"
        />
        <Text style={styles.label}>Senha:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(texto) => this.setState({ senha: texto })}
          placeholder="Digite sua senha"
          secureTextEntry
        />
        <Button title="Logar" onPress={() => this.ler()} color="#6200EE" />
      </View>
    );
  }
}

// Tela de Cadastro: Permite registrar um novo usuário com senha. 
class Cadastro extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: '', password: '' };
  }
  // Função assíncrona para verificar se o nome de usuário já existe
  async verificarUsuarioExistente(user) {
    try {
      const existingUser = await AsyncStorage.getItem(user);
      return existingUser !== null;
    } catch (erro) {
      console.log("Erro ao verificar o usuário:", erro);
      return false;
    }
  }
  // Função assíncrona para salvar o novo usuário e senha no AsyncStorage
  async gravar() {
    const { user, password } = this.state;

    // Verifica se o nome de usuário já está registrado
    const usuarioExistente = await this.verificarUsuarioExistente(user);
    if (usuarioExistente) {
      alert("Usuário já existe! Escolha outro nome.");
      return;
    }

    try {
      // Salva o novo usuário e senha no AsyncStorage
      await AsyncStorage.setItem(user, password);
      alert("Usuário cadastrado com sucesso!");
      this.setState({ user: '', password: '' }); // Limpa os campos
    } catch (erro) {
      alert("Erro ao salvar o usuário!");
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Cadastrar Usuário:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(texto) => this.setState({ user: texto })}
          placeholder="Digite um usuário"
        />
        <Text style={styles.label}>Cadastrar Senha:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(texto) => this.setState({ password: texto })}
          placeholder="Digite uma senha"
          secureTextEntry
        />
        <Button title="Cadastrar" onPress={() => this.gravar()} color="#6200EE" />
      </View>
    );
  }
}

// Tela de Quiz: Mostra perguntas e permite o usuário responder. 
class Quiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questionIndex: 0, // Índice da pergunta atual
      score: 0, // Pontuação do usuário
      questions: this.escolherPerguntas(this.generateQuestions()), // Lista de perguntas
      nomeUsuario: this.props.route.params.nomeUsuario || 'Anônimo',
      contarPontuacao: false, // Novo estado para controlar quando a pontuação deve ser salva
    };
  }

  // Gera uma lista de perguntas e respostas fixas
  generateQuestions() {
    return [
      { question: "Qual é a capital da França?", answers: ["Paris", "Roma", "Londres", "Berlim"], correct: 0 },
      { question: "Qual é o maior planeta do sistema solar?", answers: ["Marte", "Terra", "Júpiter", "Saturno"], correct: 2 },
      { question: "Qual é o resultado de 5 + 3?", answers: ["5", "7", "8", "10"], correct: 2 },
      { question: "Quem escreveu 'Dom Quixote'?", answers: ["Shakespeare", "Cervantes", "Hemingway", "Poe"], correct: 1 },
      { question: "Em que ano o homem pisou na Lua?", answers: ["1965", "1969", "1972", "1975"], correct: 1 },
      { question: "Qual é a cor do céu em um dia claro?", answers: ["Azul", "Verde", "Amarelo", "Vermelho"], correct: 0 },
    { question: "Qual é o nome do planeta onde vivemos?", answers: ["Marte", "Terra", "Vênus", "Júpiter"], correct: 1 },
    { question: "Quem é o presidente dos Estados Unidos (em 2024)?", answers: ["Donald Trump", "Joe Biden", "Barack Obama", "George W. Bush"], correct: 1 },
    { question: "Qual é a moeda do Brasil?", answers: ["Peso", "Dólar", "Real", "Euro"], correct: 2 },
    { question: "Qual é o nome do famoso super-herói que usa um manto e um cinto de utilidades, e luta contra o crime em Gotham City?", answers: ["Superman", "Batman", "Homem-Aranha", "Flash"], correct: 1 },
    { question: "Quem pintou a Mona Lisa?", answers: ["Pablo Picasso", "Leonardo da Vinci", "Vincent van Gogh", "Salvador Dalí"], correct: 1 },
    { question: "Em que país foi inventada a pizza?", answers: ["França", "Estados Unidos", "Itália", "Grécia"], correct: 2 },
    { question: "Qual é o maior oceano do planeta?", answers: ["Atlântico", "Índico", "Pacífico", "Ártico"], correct: 2 },
    { question: "Qual é o símbolo químico da água?", answers: ["H2O", "O2", "CO2", "H2"], correct: 0 },
    { question: "Qual é a capital da Alemanha?", answers: ["Berlim", "Munique", "Frankfurt", "Hamburgo"], correct: 0 },
    { question: "Em que continente está o Egito?", answers: ["Ásia", "Europa", "África", "Oceania"], correct: 2 },
    { question: "Quem escreveu o livro 'Harry Potter e a Pedra Filosofal'?", answers: ["J.R.R. Tolkien", "George R.R. Martin", "J.K. Rowling", "Suzanne Collins"], correct: 2 },
    { question: "Quantos estados tem o Brasil?", answers: ["25", "27", "30", "32"], correct: 1 },
    { question: "Qual é o nome do maior animal terrestre?", answers: ["Elefante", "Girafa", "Hipopótamo", "Baleia"], correct: 0 },
    { question: "Em qual ano o Brasil conquistou o primeiro título da Copa do Mundo de Futebol?", answers: ["1930", "1950", "1958", "1962"], correct: 2 },
    { question: "Quem foi o primeiro imperador do Brasil?", answers: ["Pedro I", "Dom João VI", "Dom Pedro II", "Getúlio Vargas"], correct: 0 },
    { question: "Qual é a fórmula matemática usada para calcular a área de um círculo?", answers: ["A = b × h", "A = 2πr", "A = πr²", "A = l²"], correct: 2 },
    { question: "Em que ano a União Soviética foi dissolvida?", answers: ["1985", "1991", "1995", "1989"], correct: 1 },
    { question: "Qual é o nome da teoria proposta por Charles Darwin sobre a evolução das espécies?", answers: ["Teoria da Relatividade", "Teoria da Seleção Natural", "Teoria do Big Bang", "Teoria das Cordas"], correct: 1 },
    { question: "Qual é o nome da estrela mais próxima da Terra depois do Sol?", answers: ["Sirius", "Alpha Centauri", "Vega", "Betelgeuse"], correct: 1 },
    { question: "Qual é o nome do famoso rato da Disney?", answers: ["Mickey Mouse", "Pato Donald", "Minnie Mouse", "Goofy"], correct: 0 },
    { question: "Quantos dias tem um ano?", answers: ["365", "366", "400", "365,25"], correct: 0 },
    { question: "Qual é o maior continente do mundo?", answers: ["África", "América", "Ásia", "Europa"], correct: 2 },
    { question: "Quem foi o autor de 'O Pequeno Príncipe'?", answers: ["Machado de Assis", "J.K. Rowling", "Antoine de Saint-Exupéry", "Monteiro Lobato"], correct: 2 },
    { question: "Qual é a cor do sol?", answers: ["Amarelo", "Laranja", "Branco", "Azul"], correct: 0 },
    { question: "Qual é o maior rio do mundo?", answers: ["Rio Amazonas", "Rio Nilo", "Rio Yangtze", "Rio Mississipi"], correct: 0 },
    { question: "Em que país nasceu a artista Frida Kahlo?", answers: ["México", "Espanha", "Argentina", "Brasil"], correct: 0 },
    { question: "Qual é a capital do Japão?", answers: ["Tóquio", "Pequim", "Seul", "Hong Kong"], correct: 0 },
    { question: "Qual é a fórmula química do sal de cozinha?", answers: ["NaCl", "NaOH", "H2O", "CO2"], correct: 0 },
    { question: "Qual é o nome do primeiro satélite artificial lançado pela Terra?", answers: ["Sputnik 1", "Apollo 11", "Hubble", "Explorer 1"], correct: 0 },
    { question: "Em que ano começou a Segunda Guerra Mundial?", answers: ["1935", "1939", "1945", "1929"], correct: 1 },
    { question: "Qual é o maior lago do mundo em volume de água?", answers: ["Lago Baikal", "Lago Titicaca", "Lago Superior", "Lago Caspiano"], correct: 0 },
    { question: "Qual é a maior montanha do mundo?", answers: ["Monte Kilimanjaro", "Monte Everest", "Monte Fuji", "Aconcágua"], correct: 1 },
    { question: "Quantos planetas existem no sistema solar?", answers: ["7", "8", "9", "10"], correct: 1 },
    { question: "Quem foi o criador da teoria da relatividade?", answers: ["Isaac Newton", "Galileu Galilei", "Albert Einstein", "Nikola Tesla"], correct: 2 },
    { question: "Em que ano a Revolução Francesa começou?", answers: ["1776", "1789", "1804", "1792"], correct: 1 },
    { question: "Qual é o elemento químico com o símbolo 'Fe'?", answers: ["Ferro", "Flúor", "Fósforo", "Félio"], correct: 0 },
    { question: "Quem foi o autor da teoria da psicanálise?", answers: ["Carl Jung", "Sigmund Freud", "B.F. Skinner", "Jean Piaget"], correct: 1 },
    { question: "Qual é a capital da Mongólia?", answers: ["Ulaanbaatar", "Astana", "Lima", "Tashkent"], correct: 0 },
    { question: "Em que ano a primeira Guerra Mundial terminou?", answers: ["1912", "1915", "1918", "1920"], correct: 2 },
    { question: "Em que ano a primeira Guerra Mundial terminou?", answers: ["1912", "1915", "1918", "1920"], correct: 2 },
    { question: "Qual é o número atômico do elemento Hidrogênio?", answers: ["10", "8", "2", "1"], correct: 3 },
    { question: "Quem é conhecido como o 'Pai da Computação'?", answers: ["Alan Turing", "Steve Jobs", "Bill Gates", "Charles Babbage"], correct: 3 },
    { question: "Qual é o símbolo químico do Ouro?", answers: ["Au", "Ag", "Fe", "Cu"], correct: 0 },
    { question: "Qual é o gás mais abundante na atmosfera da Terra?", answers: ["Oxigênio", "Hidrogênio", "Nitrogênio", "Dióxido de Carbono"], correct: 2 },
    { question: "Quantos lados tem um hexágono?", answers: ["5", "6", "7", "8"], correct: 1 },
    ];
  }

  // Embaralha as perguntas para exibição aleatória
  escolherPerguntas(questions) {
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    return questions;
  }

  // Verifica se a resposta selecionada está correta
  verificaPegunta(answerIndex) {
    const { questionIndex, questions, score } = this.state;
    const acertou = answerIndex === questions[questionIndex].correct;

    if (!acertou) {
      this.setState({ contarPontuacao: false }); // Não salva se errar
      this.terminarQuiz();
      return;
    }

    Vibration.vibrate(); // Vibra ao acertar

    this.setState(
      {
        score: score + 1, // Incrementa a pontuação
        questionIndex: questionIndex + 1,// Avança para a próxima pergunta
        contarPontuacao: questionIndex + 1 === questions.length - 1, // Salva pontuação no final
      },
      () => {
        if (this.state.questionIndex >= questions.length) {
          this.terminarQuiz();
        }
      }
    );
  }

  // Finaliza o quiz e salva a pontuação
  async terminarQuiz() {
    const { score, nomeUsuario, contarPontuacao } = this.state;

    if (contarPontuacao) { 
      try {
        const existingScores = await AsyncStorage.getItem('scores');
        const parsedScores = existingScores ? JSON.parse(existingScores) : [];
        parsedScores.push({ user: nomeUsuario, score });
        await AsyncStorage.setItem('scores', JSON.stringify(parsedScores));
        this.props.navigation.navigate('Resultado', { score });
      } catch (error) {
        console.log("Erro ao salvar pontuação:", error);
      }
    } else {
      this.props.navigation.navigate('Resultado', { score: 0 });
    }
  }

  // Interrompe o quiz antes do final
  pararQuiz() {
    this.setState({ contarPontuacao: true }, () => this.terminarQuiz()); // Força o salvamento ao parar
  }

  render() {
    const { questionIndex, questions } = this.state;
    if (questionIndex >= questions.length) return null;

    const question = questions[questionIndex];

    return (
      <View style={styles.quizContainer}>
        <Text style={styles.questionNumber}>
          Pergunta {questionIndex + 1} de {questions.length}
        </Text>

        <Text style={styles.questionText}>{question.question}</Text>
        {question.answers.map((answer, index) => (
          <TouchableOpacity
            key={index}
            style={styles.answerButton}
            onPress={() => this.verificaPegunta(index)}
          >
            <Text style={styles.answerText}>{answer}</Text>
          </TouchableOpacity>
        ))}

        {/* Botão de parar quiz */}
        <Button title="Parar Quiz" onPress={() => this.pararQuiz()} color="#FF6347" />
      </View>
    );
  }
}

// Tela Resultado: Mostra o resultado final do quiz 
class Resultado extends React.Component {
  render() {
    const { score } = this.props.route.params; // Obtém a pontuação passada pela navegação
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
          {score > 0 ? `Parabéns! Sua pontuação: ${score}` : `Você errou. Pontuação final: ${score}`}
        </Text>
        <Button title="Jogar Novamente" onPress={() => this.props.navigation.navigate('Login')} color="#6200EE" />
      </View>
    );
  }
}

class Ranking extends React.Component {
  constructor(props) {
    super(props);
    this.state = { melhoresPontuadores: [] };
  }

  componentDidMount() {
    this.carregarMelhoresPontuadores();
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.carregarMelhoresPontuadores();
    });
  }

  componentWillUnmount() {
    this.focusListener();
  }

  async carregarMelhoresPontuadores() {
    try {
      const scores = await AsyncStorage.getItem('scores');
      const parsedScores = scores ? JSON.parse(scores) : [];

      // Filtra para manter apenas a maior pontuação de cada usuário
      const maioresPontuacoes = parsedScores.reduce((acc, current) => {
        const usuarioExistente = acc.find((item) => item.user === current.user);
        if (!usuarioExistente || usuarioExistente.score < current.score) {
          acc = acc.filter((item) => item.user !== current.user); // Remove o usuário com pontuação menor
          acc.push(current); // Adiciona a maior pontuação
        }
        return acc;
      }, []);

      // Ordena e pega os 5 maiores pontuadores
      const melhoresPontuadores = maioresPontuacoes.sort((a, b) => b.score - a.score).slice(0, 5);
      this.setState({melhoresPontuadores });
    } catch (error) {
      console.log("Erro ao carregar pontuações:", error);
    }
  }

  render() {
    return (
      <View style={styles.rankingContainer}>
        <Text style={styles.rankingTitle}>Top 5 Pontuadores</Text>
        <FlatList
          data={this.state.melhoresPontuadores}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.rankingItem}>
              <Text style={styles.rankingPosition}>{index + 1}º</Text>
              <Text style={styles.rankingName}>{item.user}</Text>
              <Text style={styles.rankingScore}>{item.score} pontos</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>Ainda não há pontuações registradas.</Text>}
        />
      </View>
    );
  }
}

function LoginStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Principal} />
      <Stack.Screen name="Quiz" component={Quiz} options={{ headerShown: false }} />
      <Stack.Screen name="Resultado" component={Resultado} />
    </Stack.Navigator>
  );
}

class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen
            name="Login"
            component={LoginStack}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="login" color={color} size={size} />
              ),
              headerShown: false,
            }}
          />
          <Tab.Screen
            name="Cadastro"
            component={Cadastro}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="account-plus" color={color} size={size} />
              ),
              headerShown: false,
            }}
          />
          <Tab.Screen
            name="Ranking"
            component={Ranking}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="trophy" color={color} size={size} />
              ),
              headerShown: false,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  quizContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  questionNumber: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  questionText: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  rankingContainer: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20,
    marginTop: 50, 
  },
  rankingTitle: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  rankingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  rankingPosition: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  rankingName: {
    fontSize: 18,
    textAlign: 'center',
  },
  rankingScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
  },
  quizContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  questionText: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  answerButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  answerText: {
    fontSize: 18,
    color: '#FFF',
    textAlign: 'center',
  },
});
