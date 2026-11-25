# 🎤 Roteiro de apresentação – Aba Projetos (≈ 2 minutos)

**Antes de começar:**
- Abra a wiki, entre com **Preencher Demo** e deixe a aba **Projetos** aberta.
- Limpe os favoritos e o contador, para mostrar do zero.
- Tenha o uLife aberto em outra aba, se quiserem comparar ao vivo.

---

### 1. O problema (15 s)
> “No uLife, os projetos ficam espalhados: Extensão fica em *Curso*; Hub, Nest e Duale ficam na *Academia de Futuros Profissionais*; e intercâmbio e iniciação científica estão só no site da Una. A aba Projetos junta tudo num lugar só.”

*Mostrar:* a aba com as 6 categorias e os adesivos.

### 2. Buscar do jeito do aluno (20 s)
1. Na busca da aba, digite **“quero estudar fora do brasil”**.
2. Aparece **Intercâmbio acadêmico**, com o selo *Próximo edital previsto: abril*.

> “A busca entende frases, não só palavras-chave. *(Nielsen #2 e #7)*”

### 3. O card e o passo a passo com print (25 s)
1. Limpe a busca e abra **Squads do Ânima Hub**.
2. Mostre os selos: *100 h ext. + 40 h pesquisa*, *Todos os cursos* e a situação *Encerradas*, com a **fonte**.
3. Role pelos prints: cada passo do uLife tem o **clique marcado em vermelho**.

> “O aluno reconhece a tela em vez de decorar o caminho. *(Nielsen #6)*”

### 4. Salvar e agendar (20 s)
1. Clique em **☆ Salvar em Meus projetos**, que aparece o aviso *“foi salvo”*. *(Nielsen #1)*
2. Feche, abra **Shark Hub** e clique em **📅 Adicionar à agenda**: baixa o evento das 19h para o Google Agenda ou o celular.
3. Abra a ferramenta **⭐ Meus projetos**: o Hub está lá e dá para **Remover**. *(Nielsen #3)*

### 5. Contador de horas de extensão (25 s)
1. Abra **⏱️ Horas de extensão**. Já vem com **320 h**, o número de Engenharia de Software tirado do uLife.
2. Digite **40** em “Horas que você já tem”. Aparecem *Faltam 280 h*, a barra de progresso e quanto cada projeto cobre.
3. Digite **-5** para mostrar a mensagem de erro no próprio campo. *(Nielsen #5 e #9)*
4. Clique em **Limpar**.

### 6. Inscrições agora e Jornada (15 s)
1. **🗓️ Inscrições agora**: “Nenhuma inscrição estava aberta quando conferimos”. A wiki não inventa: mostra a data da conferência.
2. **🧭 Jornada no curso**: as 4 fases, cada uma com a fonte.

> “Quando a data vence, o selo vira *Confira as datas* sozinho, e depois de 4 meses a aba avisa que os dados estão antigos. *(Nielsen #1)*”

### 7. Fechamento (10 s)
> “Tudo tem fonte: o uLife, conferido com login de aluno, e os sites oficiais da Una, do Ânima Hub e do Ânima Nest. A aba também segue acessibilidade: contraste, teclado e leitor de tela.”

---

**Se perguntarem…**
- *“E se a informação mudar?”* Os dados ficam em um só lugar (`js/conteudo.js`, bloco `WIKI_PROJETOS`); é trocar as datas e o campo `conferido`.
- *“Como vocês testaram?”* Com `node tests/projetos.test.js`, que testa a situação das inscrições por data, o contador (incluindo os erros) e o arquivo de agenda.
- *“Por que não tem TCC?”* O uLife do aluno não tem uma tela própria de TCC; o lugar oficial de publicar trabalhos é o **RUNA**, que está na categoria Pesquisa.
