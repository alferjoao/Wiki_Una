// Teste da busca semântica (camada leve). Rode com: node tests/busca.test.js
const fs = require('fs');
const vm = require('vm');
const ctx = { window: {}, navigator: {}, console };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(__dirname + '/../js/conteudo.js', 'utf8'), ctx);
vm.runInContext(fs.readFileSync(__dirname + '/../js/busca.js', 'utf8'), ctx);
const { WIKI_CONTEUDO: DATA, WikiBusca: B } = ctx.window;

const index = [];
Object.entries(DATA).forEach(([tab, cats]) => cats.forEach(cat => cat.itens.forEach(item => index.push({ tab, cat, item }))));
B.init(index);

// [pergunta do aluno, id esperado entre os 3 primeiros]
const casos = [
  ['preciso ir no banheiro', 'banheiro-masc-fem'],
  ['banheiro pra cadeirante', 'banheiro-acessivel'],
  ['lugar silencioso pra estudar', 'biblioteca-fisica'],
  ['perdi a prova, e agora?', 'segunda-oportunidade'],
  ['faltei na A1', 'segunda-oportunidade'],
  ['como mando meu certificado', 'postar-certificado'],
  ['horas complementares', 'postar-certificado'],
  ['livro online', 'livros-digitais'],
  ['pearson', 'livros-digitais'],
  ['como pago a mensalidade', 'boleto'],
  ['estou devendo a faculdade', 'negociar'],
  ['esqueci a senha do ulife', 'esqueci-senha'],
  ['como faço login no ulife', 'login'],
  ['entrar no app pelo celular', 'login'],
  ['nao consigo entrar', 'esqueci-senha'],
  ['internet do campus', 'wifi'],
  ['comprovante que estudo aqui', 'declaracao-matricula'],
  ['quero trancar o curso', 'trancamento'],
  ['laboratorio de enfermagem', 'lab-saude'],
  ['laboratório de informática', 'lab-informatica'],
  ['laboratorio de redes', 'lab-informatica'],
  ['laboratorio de eletrica', 'lab-engenharia'],
  ['aula pratica de enfermagem', 'lab-saude'],
  ['vai ter palestra onde', 'auditorio'],
  ['estou muito ansioso', 'napi'],
  ['qual minha sala', 'quadro-aulas'],
  ['ver minha nota', 'ver-notas'],
  ['certifcado', 'postar-certificado'],          // erro de digitação
  ['bibliotca', 'biblioteca-fisica'],            // erro de digitação
  ['secretaria', 'secretaria'],
  ['atende mais', 'atende-mais'],
  ['banheiro do quinto andar', 'banheiros-5'],
  ['laboratorio de estetica', 'lab-504'],
  ['sala 501', 'lab-501'],
  ['falar com o coordenador do curso', 'secretaria'],
  ['word e excel de graça', 'office-teams'],
  ['entregar trabalho', 'enviar-atividade'],
  // aba Projetos
  ['projeto integrador', 'projeto-a3'],
  ['quero abrir uma startup', 'uc-nest'],
  ['quantas horas de extensao preciso', 'extensao-o-que-e'],
  ['como participo de uma squad', 'hub-squads'],
  ['iniciacao cientifica', 'pro-ciencia'],
  ['quero fazer pesquisa com um professor', 'pro-ciencia'],
  ['quero estudar fora do brasil', 'intercambio'],
  ['curso de ingles com desconto', 'idiomas'],
  ['onde publico meu tcc', 'runa'],
  ['lives de mentoria', 'mentorias'],
  ['espaco de inovacao da una', 'casa-una'],
  ['quero ser voluntario', 'hub-sociais'],
  ['shark hub', 'shark-hub'],
  ['projeto com empresa de verdade', 'duale'],
  ['exemplos de projetos premiados', 'nest-premiados']
];

let falhas = 0;
casos.forEach(([q, esperado]) => {
  const top = B.buscar(q).slice(0, 3).map(r => r.entry.item.id);
  const ok = top.includes(esperado);
  if (!ok) falhas++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  "${q}" -> ${top.join(', ') || '(nada)'}`);
});
console.assert(B.buscar('xyzqwk').length === 0, 'texto sem sentido não deve achar nada');
['cantina', 'estacionamento', 'nucleo de praticas juridicas', 'atelie de arquitetura'].forEach(q => {
  const top = B.buscar(q, 'localizacao')[0];
  console.log(`info  "${q}" (não existe na Una) -> ${top ? top.entry.item.id : '(nada)'}`);
});
console.log(`\n${casos.length - falhas}/${casos.length} perguntas acharam o item certo no top 3`);

// "Perto de": [pergunta, item esperado em 1º, ponto de referência esperado]
const perto = [
  ['banheiro perto da biblioteca', 'banheiro-masc-fem', 'biblioteca'],
  ['to na biblioteca, qual banheiro mais perto', 'banheiro-masc-fem', 'biblioteca'],
  ['banheiro no quinto andar', 'banheiros-5', '5andar'],
  ['banheiro perto do auditório', 'banheiros-5', '5andar'],
  ['banheiro perto da sala 504', 'banheiros-5', '5andar'],
  ['estou no 5º andar e preciso de banheiro', 'banheiros-5', '5andar'],
  ['banheiro perto da entrada', 'banheiro-masc-fem', 'entrada'],
  ['banheiro pra cadeirante perto do napi', 'banheiro-acessivel', 'napi'],
  ['banheiro perto do atende+', 'banheiro-masc-fem', 'biblioteca'],
  ['banheiro perto da parede de madeira', 'banheiro-masc-fem', 'fundo']
];
perto.forEach(([q, item, local]) => {
  const r = B.buscarPerto(q);
  const ok = r.results[0] && r.results[0].entry.item.id === item && r.local && r.local.id === local;
  if (!ok) falhas++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  perto: "${q}" -> ${r.results.slice(0, 2).map(x => x.entry.item.id).join(', ')} [${r.local ? r.local.id : 'sem local'}]`);
});
// Sem "perto de", nada muda: buscar um lugar continua achando o lugar
[['biblioteca', 'biblioteca-fisica'], ['auditorio', 'auditorio'], ['onde fica a biblioteca', 'biblioteca-fisica'], ['atende mais', 'atende-mais']].forEach(([q, item]) => {
  const r = B.buscarPerto(q);
  const ok = r.results[0] && r.results[0].entry.item.id === item && !r.local;
  if (!ok) falhas++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  normal: "${q}" -> ${r.results[0] ? r.results[0].entry.item.id : '(nada)'}`);
});
console.log(`perto de: ${perto.length} casos + 4 de controle`);
process.exit(falhas ? 1 : 0);
