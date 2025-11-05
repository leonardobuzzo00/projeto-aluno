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

// POST - Criar aluno
app.post('/aluno', (req, res) => {
  const aluno = req.body;
  const novoAluno = inserirAluno(aluno);
  res.status(201).json(novoAluno);
});

// GET - Consultar alunos
app.get('/alunos', async (req, res) => {
  const nome = req.query.nome;
  let listaAlunos;
  
  if (nome != null && nome != "") {
    console.log("Busca com nome " + nome);
    listaAlunos = await consultarAlunos(nome, null, null);
  } else {
    listaAlunos = await consultarAlunos(null, null, null);
  }
  
  res.status(200).json(listaAlunos);
});

// PUT - Atualizar um aluno pelo ID
app.put('/aluno/:id', async (req, res) => {
  try {
    const id = req.params.id;          // ID do aluno vindo da URL
    const novosDados = req.body;       // Dados novos enviados no corpo da requisição

    const alunoAtualizado = await Aluno.findByIdAndUpdate(id, novosDados, { new: true });

    if (!alunoAtualizado) {
      return res.status(404).json({ erro: 'Aluno não encontrado' });
    }

    res.status(200).json(alunoAtualizado);
  } catch (erro) {
    console.error('Erro ao atualizar aluno:', erro);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// DELETE - Excluir um aluno pelo ID
app.delete('/aluno/:id', async (req, res) => {
  try {
    const id = req.params.id;  // ID do aluno vindo da URL
    const alunoDeletado = await Aluno.findByIdAndDelete(id);

    if (!alunoDeletado) {
      return res.status(404).json({ erro: 'Aluno não encontrado' });
    }

    res.status(200).json({ mensagem: 'Aluno excluído com sucesso!' });
  } catch (erro) {
    console.error('Erro ao excluir aluno:', erro);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// ======= BANCO DE DADOS (MONGOOSE) =======

const alunoSchema = new mongoose.Schema({
  nome: String,
  idade: String,
  serie: String,
  turma: String,
  sexo: String
});

const Aluno = mongoose.model('Aluno', alunoSchema);

// Conexão com o banco de dados MongoDB
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

// Inserir aluno no banco
function inserirAluno(aluno) {
  const novoAluno = new Aluno(aluno);
  novoAluno.save()
    .then(() => console.log('Aluno criado!'))
    .catch(err => console.error(err));
  return novoAluno;
}

// Consultar alunos (com ou sem filtro de nome)
async function consultarAlunos(nome, idade, turma) {
  let alunos;
  if (nome != null && nome != "") {
    alunos = await Aluno.find({ "nome": nome });
  } else {
    alunos = await Aluno.find();
  }
  return alunos;
}

// Mostrar alunos no terminal
function consultarAlunoPrintTerminal() {
  Aluno.find()
    .then(alunos => console.log(alunos))
    .catch(err => console.error(err));
}

// Funções extras de atualização e exclusão (não usadas nos endpoints diretos)
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
    const resultado = await Aluno.findByIdAndDelete(id);
    console.log("Aluno deletado:", resultado);
  } catch (error) {
    console.error("Erro ao excluir Aluno", error);
  }
}

// Iniciar servidor
app.listen(port, () => {
  connect();
  console.log(`Servidor rodando em http://localhost:${port}`);
});
