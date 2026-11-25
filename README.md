# 🎓 Wiki Una – Guia do uLife e do campus

Wiki feita por alunos de Engenharia de Software da **Una (Ecossistema Ânima)** para ajudar a entender o **uLife** (o ambiente virtual da faculdade), achar os lugares no campus e aproveitar os projetos da Una.

O site é **100% estático** (HTML, CSS e JavaScript puro, sem servidor) e foi construído seguindo as **10 heurísticas de usabilidade de Jakob Nielsen**.

---

## 🚀 Como executar

1. Dê um duplo clique em `index.html` (ou abra com o navegador).
2. Clique em **Preencher Demo** e em **Entrar**.
3. Use as abas da barra lateral.

Opcional, com servidor local (recomendado para o botão "Compartilhar"):

```bash
python -m http.server 8000
```

Depois abra `http://localhost:8000`.

---

## 🧭 O que tem em cada aba

| Aba | O que faz |
|---|---|
| **Localização** | Banheiros, auditório, laboratórios, secretaria, NAPI, biblioteca… com **rota em fotos** do 4º e 5º andar do Centerminas e busca “perto de” (ex.: *banheiro perto da biblioteca*). |
| **Ambiente virtual** | Passo a passo do **uLife** com **prints marcados em vermelho**: aulas, notas, provas, certificados, documentos, financeiro e acesso. |
| **Calendário Acadêmico** | Calendário 2026 por modalidade e cidade, com avaliações, prazos e feriados (dos PDFs oficiais). |
| **Projetos** | Projetos da Una e da Ânima em cards por categoria, com passo a passo em print, selos e ferramentas (detalhes abaixo). |
| **Ajuda e Suporte** | Onde pedir atendimento e dicas de uso da wiki. |

**Busca:** a busca da barra lateral (atalho `/`) entende sinônimos, erros de digitação e frases (“perdi a prova”). Há também uma busca com IA opcional, que roda no próprio navegador.

---

## 🧩 Aba Projetos (parte do nosso grupo)

- **20 projetos em 6 categorias:** Na sua disciplina, Extensão e impacto social, Inovação e empreendedorismo, Pesquisa científica, Internacional e idiomas, Carreira e mercado.
- **Selos em cada card:** ⏱️ o que você ganha · 👥 quem pode participar · 🗓️ quando abre · situação da inscrição (aberta, encerrada, evento…).
- **Passo a passo com print do uLife** nos projetos acessados por ele (Extensão, Academia de Futuros Profissionais, Hub, Nest, Duale, A3).
- **Ferramentas:**
  - 🗓️ **Inscrições agora** – a situação de cada projeto, calculada pela data de hoje;
  - ⏱️ **Horas de extensão** – contador com a regra oficial (mínimo de 10% do curso), validação dos campos e quanto cada projeto cobre;
  - 🧭 **Jornada no curso** – o que aproveitar em cada fase, com a fonte de cada informação;
  - ⭐ **Meus projetos** – favoritos salvos no navegador;
  - 📅 **Adicionar à agenda** – baixa um arquivo `.ics` (Google Agenda, Outlook, celular) para os eventos com data.
- **Aviso de dados antigos:** se a data de conferência passar de 4 meses, a aba avisa para conferir no uLife.
- **Adesivos de fundo** com o tema da aba (só nela).

**Regra do conteúdo: nada inventado.** Tudo veio do uLife (conferido com login de aluno) ou dos sites oficiais. A fonte aparece em cada card e em cada ferramenta.

---

## 🧠 Heurísticas de Nielsen na wiki

| # | Heurística | Onde aparece |
|---|---|---|
| 1 | Visibilidade do status do sistema | Selos de situação da inscrição, barra de progresso das horas, contador de resultados da busca, “conferido em…”, aviso de dados antigos, mensagens de “salvo/removido/baixado”. |
| 2 | Correspondência com o mundo real | Nomes iguais aos do uLife (“Curso → Extensão”, “Minhas UCs”), fotos reais do campus e prints reais. |
| 3 | Controle e liberdade | Desfazer favorito, botão **Limpar** no contador, `Esc` fecha janelas, botão Voltar do celular fecha o card. |
| 4 | Consistência e padrões | Mesmo modelo de card, selo e passo a passo em todas as abas; cores com significado fixo (verde = horas, vermelho = encerrado…). |
| 5 | Prevenção de erros | Contador recusa número negativo ou absurdo e avisa quando as horas passam do exigido; datas vencidas viram “confira as datas”. |
| 6 | Reconhecimento em vez de memorização | Print com o lugar do clique marcado, caminho “Onde no uLife” sempre visível, favoritos em “Meus projetos”. |
| 7 | Flexibilidade e eficiência | Atalho `/` para buscar, setas do teclado nas abas de ferramentas, busca com frases, links diretos para compartilhar. |
| 8 | Estética e minimalismo | Cards limpos, informação em camadas (resumo no card, detalhes ao abrir). |
| 9 | Ajudar a reconhecer e corrigir erros | Mensagens de erro no próprio campo, em linguagem simples (“não pode ser negativo”). |
| 10 | Ajuda e documentação | Aba Ajuda, textos curtos explicando cada ferramenta, link para a fonte oficial. |

**Acessibilidade (WCAG):** contraste mínimo de 4,5:1 nos textos da aba Projetos, foco visível, área de toque de 44 px nas abas, `aria-live` para avisos, padrão de abas do WAI-ARIA e respeito ao “reduzir movimento” do sistema.

---

## 📁 Estrutura de arquivos

```text
Wiki_Una-main/
├── index.html              # Login e cadastro (e-mail @ulife.com.br)
├── dashboard.html          # A wiki (abas, busca, janelas)
├── css/
│   ├── style.css           # Estilo do login
│   └── dashboard.css       # Estilo da wiki
├── js/
│   ├── app.js              # Login, cadastro e validações
│   ├── conteudo.js         # TODO o conteúdo da wiki (edite aqui) + dados da aba Projetos
│   ├── busca.js            # Busca por significado (e IA opcional)
│   ├── guias.js            # Cards, colunas, janela de detalhes e fotos
│   ├── projetos.js         # Ferramentas da aba Projetos
│   └── calendario.js       # Calendário acadêmico
├── assets/
│   ├── fotos/              # Fotos do campus (rotas)
│   ├── prints/ulife-passos/# Prints do uLife com o clique marcado
│   ├── prints/ulife-rotas/ # ROTAS.md e PROJETOS.md (levantamento com fontes)
│   └── adesivos/           # Adesivos da aba Projetos
├── tests/
│   ├── busca.test.js       # Testes da busca
│   └── projetos.test.js    # Testes da aba Projetos
└── ROTEIRO-APRESENTACAO.md # Roteiro de demonstração
```

---

## ✅ Testes

```bash
node tests/busca.test.js
node tests/projetos.test.js
```

---

## ✏️ Como atualizar o conteúdo

- **Textos, passos e prints:** `js/conteudo.js` (o topo do arquivo explica cada campo).
- **Datas e inscrições da aba Projetos:** bloco `window.WIKI_PROJETOS` no fim de `js/conteudo.js`. Troque também o campo `conferido` para a data em que você conferiu.
- **Prints novos:** salve em `assets/prints/ulife-passos/` sem dados pessoais (nome, RA, notas).

---

## ⚠️ Limitações

- O login é só uma demonstração: os usuários ficam salvos no navegador (`localStorage`), sem servidor e sem criptografia.
- Datas e inscrições mudam a cada semestre: a wiki mostra a data de conferência e avisa quando ela fica antiga, mas a fonte oficial é sempre o uLife.
