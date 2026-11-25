// Testes da aba Projetos (situação das inscrições, contador de horas, agenda e dados).
// Rode com: node tests/projetos.test.js
const fs = require('fs');
const vm = require('vm');
const ctx = { window: {}, console };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(__dirname + '/../js/conteudo.js', 'utf8'), ctx);
vm.runInContext(fs.readFileSync(__dirname + '/../js/projetos.js', 'utf8'), ctx);
const { WIKI_CONTEUDO: DATA, WIKI_PROJETOS: P, WikiProjetos: W } = ctx.window;

let falhas = 0;
function ok(cond, nome, extra = '') {
  if (!cond) falhas++;
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${nome}${extra ? ' -> ' + extra : ''}`);
}

const itens = {};
DATA.projetos.forEach(c => c.itens.forEach(i => { itens[i.id] = i; }));

// 1. Dados: todo id citado existe e todo item tem fonte
const citados = [...Object.keys(P.inscricoes), ...P.jornada.flatMap(f => f.itens.map(i => i.id)), ...P.extensao.projetos.map(p => p.id)];
ok(citados.every(id => itens[id]), 'todos os ids das ferramentas existem nos cards', citados.filter(id => !itens[id]).join(', '));
ok(Object.values(P.inscricoes).every(s => s.fonte && s.fonte.texto), 'toda situação de inscrição tem fonte');
ok(P.jornada.every(f => f.fonte), 'toda fase da jornada tem fonte');

// 2. Situação das inscrições muda com a data
const st = (id, d) => W.statusDe(itens[id], d);
ok(st('hub-squads', '2026-11-24').cls === 'fechado', 'Hub encerrado em 24/11/2026');
ok(st('hub-squads', '2027-01-05').cls === 'confira', 'Hub vira "confira" depois do semestre');
ok(st('shark-hub', '2026-11-24').cls === 'evento', 'Shark Hub é evento antes do dia', st('shark-hub', '2026-11-24').label);
ok(st('shark-hub', '2026-12-09').label.includes('hoje'), 'Shark Hub mostra "hoje" no dia');
ok(st('shark-hub', '2026-12-10').cls === 'confira', 'Shark Hub vira "confira" depois do evento');
ok(st('intercambio', '2026-11-24').label.includes('abril'), 'Intercâmbio em novembro prevê abril');
ok(st('intercambio', '2027-09-02').cls === 'aberto', 'Intercâmbio em setembro = mês de edital');
ok(st('mentorias', '2026-11-24').cls === 'info', 'Mentorias = sem data fixa');
ok(W.statusDe({ id: 'nao-existe' }, '2026-11-24') === null, 'item sem dados não ganha selo');

// 3. Contador de horas (inclui prevenção de erros)
let r = W.calcularHoras({ exigidas: '320', feitas: '40' });
ok(r.falta === 280 && r.pct === 13 && !r.erros.length, '320 h exigidas, 40 feitas = faltam 280 (13%)');
r = W.calcularHoras({ carga: '3600', feitas: '0' });
ok(r.total === 360, 'carga de 3600 h → 360 h de extensão (10%)');
r = W.calcularHoras({ exigidas: '320', feitas: '-5' });
ok(r.erros.some(e => e.campo === 'feitas'), 'número negativo vira erro');
r = W.calcularHoras({ exigidas: '320', feitas: '400' });
ok(r.falta === 0 && r.erros.some(e => e.aviso), 'mais horas que o exigido gera aviso');
r = W.calcularHoras({ exigidas: '999999' });
ok(r.erros.some(e => e.campo === 'exigidas'), 'valor absurdo é recusado');
r = W.calcularHoras({ exigidas: '', feitas: '10' });
ok(r.total === 0, 'sem horas do curso não calcula');

// 4. Agenda (.ics): 19h em Brasília = 22h UTC
const ics = W.gerarICS({ id: 'shark-hub', data: '2026-12-09', hora: '19:00', titulo: 'Semifinal Shark Hub 11', descricao: 'Teste, com vírgula' }, new Date('2026-11-24T12:00:00Z'));
ok(ics.includes('DTSTART:20261209T220000Z'), 'evento das 19h vira 22h UTC');
ok(ics.includes('SUMMARY:Semifinal Shark Hub 11') && ics.includes('\\,'), 'título e vírgula escapada no .ics');
ok(ics.startsWith('BEGIN:VCALENDAR') && ics.includes('\r\n'), '.ics bem formado (CRLF)');

console.log(`\n${falhas ? falhas + ' falha(s)' : 'Tudo certo'} nos testes da aba Projetos`);
process.exit(falhas ? 1 : 0);
