const mongoose = require('mongoose');
const express = require('express');
const app = express();
app.use(express.json());
const port = 3000;

/**Método HTTP
 * 4 métodos básicos
 *  * GET --> Consultas
 *  * POST --> Criar/Incluir
 *  * PUT --> Alterar registros
 *  * DELETE --> Excluir
 *  * PATH --> Alterar
 * 
 * Códigos de retorno do HTTP
 *  200x --> Sucesso
 *  300x --> Sucesso porém existe alguma operação no meio
 *  400x --> Erros tratados pela API
 *  500x --> Erros da aplicação
 */

app.post('/aluno', (req, res) => {
  aluno = req.body
  novoAluno = inserirAluno(aluno)
  res.status(201).json(novoAluno)
});

app.get('/alunos', async (req, res) => {

  const nome = req.query.nome
  var listaAlunos
  if(nome != null && nome != "") {
    console.log("Busca com nome" + nome)
    listaAlunos = await consultarAlunos(nome, null, null);
  } else {
    listaAlunos = await consultarAlunos(null, null, null);
  }
  
  res.status(200).json(listaAlunos)
});


const alunoSchema = new mongoose.Schema({
    nome: String,
    idade: String,
    serie: String,
    turma: String,
    sexo: String
  });
  
  const Aluno = mongoose.model('Aluno', alunoSchema);

  //Função para conectar no banco de dados
  function connect() {
    mongoose.connect('mongodb+srv://gutolucianetti:limanova@cluster0.7ks5c6h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/escola', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then(() => {
      console.log('Conectado ao MongoDB');
    }).catch((err) => {
      console.error('Erro ao conectar:', err);
    });
  }
//Função para inserir o objeto aluno no banco de dados
  function inserirAluno(aluno) {
    const novoAluno = new Aluno(aluno);
    novoAluno.save().then(() => console.log('Aluno criado!')).catch(err => console.error(err));
    return novoAluno;
  }

  async function consultarAlunos(nome, idade, turma) {
    var alunos
    if (nome != null && nome != "" ) {
      alunos = await Aluno.find({ "nome" : nome });
    } else {
      alunos = await Aluno.find();
    }
    return alunos;
  }

  function consultarAlunoPrintTerminal() {
    Aluno.find().then(alunos => 
      console.log(alunos))
      .catch(err => console.error(err));
  }

 
async function atualizarAluno(id, novosDados) {
  try {
    const resultado = await Aluno.findByIdAndUpdate(id, novosDados, { new: true });
    console.log('Aluno atualizado:', resultado);
  } catch (erro) {
    console.error('Erro ao atualizar aluno:', erro);
  }
}

async function deletarAluno(id) {
  try {
    const resultado = await Aluno.findOneAndDelete(id);
    console.log("Aluno deletado:", resultado);
  } catch (error) {
    console.error("Erro ao excluir Aluno", error);
  }
}

//Executando (Chamando as funções)

  // Consultar alunos e atualizar um aluno específico
  /**
  consultarAlunos().then(alunos => {
    if (alunos.length > 0) {
      const idParaAtualizar = alunos[0]._id; // Exemplo: pega o primeiro aluno
      const novosDados = { nome: 'Joao Francisco', idade: 20 }; // Exemplo de dados
      //atualizarAluno(idParaAtualizar, novosDados);
      //deletarAluno(alunos[0]._id);
    } else {
      console.log('Nenhum aluno encontrado para atualizar.');
    }
  });
   */
  //inserirAluno();
  //consultarAlunoPrintTerminal();

  // 4. Inicie o servidor
app.listen(port, () => {
  connect();
  console.log(`Servidor rodando em http://localhost:${port}`); // Exibe uma mensagem no console
});