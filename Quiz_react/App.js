import * as React from 'react';
import { Text, View, Button, TextInput, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


class Nav2 extends React.Component {
  render() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Principal} />
        <Stack.Screen name="Filmes" component={Filmes} />
        <Stack.Screen name="Resumo" component={ResumoFilme} />
        <Stack.Screen name="Quiz" component={Quiz} />
        <Stack.Screen name="Resultado" component={Resultado} /> {/* Adicione esta linha */}
      </Stack.Navigator>
    );
  }
}


class Principal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { usuario: '', senha: '' };
  }

  async ler() {
    try {
      const senha = await AsyncStorage.getItem(this.state.usuario);
      if (senha != null && senha === this.state.senha) {
        this.props.navigation.navigate('Quiz');
      } else {
        alert(senha ? "Senha Incorreta!" : "Usuário não encontrado!");
      }
    } catch (erro) {
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

class Cadastro extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: '', password: '' };
  }

  async gravar() {
    try {
      await AsyncStorage.setItem(this.state.user, this.state.password);
      alert("Usuário cadastrado com sucesso!");
    } catch (erro) {
      alert("Erro ao salvar!");
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

class Quiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questionIndex: 0,
      score: 0,
      questions: this.shuffleQuestions(this.generateQuestions())
    };
  }

  generateQuestions() {
    return [
      { question: "Qual é a capital da França?", answers: ["Paris", "Roma", "Londres", "Berlim"], correct: 0 },
      { question: "Qual é o maior planeta do sistema solar?", answers: ["Marte", "Terra", "Júpiter", "Saturno"], correct: 2 },
      { question: "Qual é o resultado de 5 + 3?", answers: ["5", "7", "8", "10"], correct: 2 },
      { question: "Quem escreveu 'Dom Quixote'?", answers: ["Shakespeare", "Cervantes", "Hemingway", "Poe"], correct: 1 },
      { question: "Em que ano o homem pisou na Lua?", answers: ["1965", "1969", "1972", "1975"], correct: 1 },
      // Adicione mais perguntas aqui conforme necessário
    ];
  }

  shuffleQuestions(questions) {
    // Embaralha o array de perguntas usando o algoritmo Fisher-Yates
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    return questions;
  }

  handleAnswer(answerIndex) {
    const { questionIndex, questions, score } = this.state;
    const isCorrect = answerIndex === questions[questionIndex].correct;

    if (!isCorrect) {
      // Se a resposta estiver incorreta, termina o quiz e navega para a tela de resultado
      this.props.navigation.navigate('Resultado', { score });
      return;
    }

    // Se estiver correta, atualiza a pontuação e vai para a próxima pergunta
    this.setState(
      {
        score: score + 1,
        questionIndex: questionIndex + 1
      },
      () => {
        // Checa se ainda há mais perguntas
        if (this.state.questionIndex >= questions.length) {
          this.finishQuiz();
        }
      }
    );
  }

  finishQuiz() {
    const { score } = this.state;
    this.props.navigation.navigate('Resultado', { score });
  }

  render() {
    const { questionIndex, questions } = this.state;
    if (questionIndex >= questions.length) return null;

    const question = questions[questionIndex];

    return (
      <View style={styles.quizContainer}>
        <Text style={styles.questionText}>{question.question}</Text>
        {question.answers.map((answer, index) => (
          <Button key={index} title={answer} onPress={() => this.handleAnswer(index)} color="#6200EE" />
        ))}
      </View>
    );
  }
}

class Resultado extends React.Component {
  render() {
    const { score } = this.props.route.params;
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
  questionText: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  resultText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
});
