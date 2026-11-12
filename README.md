# 🎓 Wiki Una - Sistema de Autenticação e Portal de Acesso

Plataforma colaborativa de conhecimento e artigos acadêmicos para estudantes, professores e colaboradores da **Una / Ecossistema Ânima**.

---

## 🚀 Funcionalidades Principais

- **Acesso Institucional Estrito**: Validação em tempo real do e-mail acadêmico oficial com terminação obrigatória `@ulife.com.br`.
- **Fluxo Completo de Autenticação**:
  - **Login (Entrar)** com e-mail institucional e senha.
  - **Criar Conta (Cadastro)** com Nome, E-mail `@ulife.com.br`, Curso/Unidade, Senha e Confirmação.
- **Redirecionamento para Canvas em Branco (`dashboard.html`)**: Ao entrar no sistema, o usuário é direcionado para uma página em branco com barra mínima e botão de logout, oferecendo total liberdade para criação da Wiki.
- **Persistência Local (`localStorage`)**: Usuários cadastrados são salvos localmente no navegador e podem realizar login imediatamente sem necessidade de configuração complexa de backend.
- **Atalho de Avaliação Rápida**: Botão *"Preencher Demo"* para correções e apresentações em sala de aula (credenciais pré-configuradas).

---

## 🧠 Aplicação das 10 Heurísticas de Usabilidade de Jakob Nielsen

O projeto foi construído desde o primeiro elemento respeitando os princípios de design de interação e usabilidade de Nielsen:

| # | Heurística | Implementação na Wiki Una |
|---|---|---|
| **1** | **Visibilidade do status do sistema** | Indicador de carregamento (*spinner*) nos botões ao submeter, feedback visual imediato em tempo real ao digitar e sistema de notificações *Toast* com barra de status. |
| **2** | **Correspondência entre o sistema e o mundo real** | Terminologia acadêmica familiar da Una (RA, `@ulife.com.br`, unidades), linguagem clara em português e ícones universais. |
| **3** | **Controle do usuário e liberdade** | Alternância fluida entre as abas *Entrar* e *Criar Conta*, botões de revelação/ocultação de senha (olho), tecla `Esc` para fechar janelas e botão de logout visível. |
| **4** | **Consistência e padrões** | Cores oficiais da Wiki Una (roxo/violeta e azul marinho), posicionamento padrão dos campos e convenções da web. |
| **5** | **Prevenção de erros** | Validação antes do envio que impede domínios diferentes de `@ulife.com.br`, sugestão dinâmica em 1 clique para auto-completar o domínio e bloqueio de senhas fracas. |
| **6** | **Reconhecimento em vez de memorização** | Rótulos (*labels*) sempre visíveis acima dos campos, checklist visual de requisitos de senha que vai ficando verde conforme o usuário digita. |
| **7** | **Flexibilidade e eficiência de uso** | Navegação por teclado (`Tab`, `Enter`), botão de demonstração rápida (*Preencher Demo*) e foco automático no primeiro campo. |
| **8** | **Design estético e minimalista** | Layout limpo, card translúcido estilo *glassmorphism*, fundo com ondas suaves em 4 tons de roxo, priorizando a tarefa de entrada. |
| **9** | **Ajudar os usuários a reconhecer, diagnosticar e recuperar de erros** | Mensagens de erro construtivas e descritivas (ex: *"O e-mail precisa terminar com @ulife.com.br. Ex: seu.nome@ulife.com.br"*). |
| **10** | **Ajuda e documentação** | Alerta visual explicando a exclusividade do domínio institucional, modais de *Esqueci Minha Senha*, *Termos de Uso* e guia interativo das 10 Heurísticas. |

---

## 🎨 Identidade Visual e Design Minimalista

O design da plataforma foi atualizado para uma estética **ultra clean e minimalista**, inspirada na identidade oficial da **Wiki Una**:

- **Logo Oficial Integrada**: Logotipo com o livro de páginas abertas (azul marinho e degradê roxo/violeta) posicionado no `<head>` do site (favicon) e no topo do card central.
- **Paleta de Cores Oficial**:
  - **Roxo / Violeta Elétrico (`#7C3AED` a `#6D28D9`)**: Ações primárias, botões em degradê, estados ativos e focos.
  - **Azul Marinho Profundo (`#0B132B`)**: Tipografia principal, contrastes nítidos e bordas estruturais.
  - **Background Dinâmico em Ondas Diagonais (4 Tons de Roxo)**:
    - *Tom 1 (#1A092E)*: Roxo profundo noturno de base.
    - *Tom 2 (#3B1366 a #581C87)*: Roxo ameixa médio.
    - *Tom 3 (#6B21A8 a #7C3AED)*: Roxo vibrante oficial da logo.
    - *Tom 4 (#8B5CF6 a #A855F7)*: Roxo lavanda iluminado.
  - **Card com Efeito Glassmorphism Translúcido e Alto Contraste**: Card com fundo roxo translúcido e desfoque de fundo (`backdrop-filter: blur(28px)`), tipografia em branco puro e lavanda de alta visibilidade, e campos com transparência e destaque violeta.

---

## 📁 Estrutura de Arquivos

```text
wikiuna/
├── index.html                  # Página de login/cadastro com card transparente e logo
├── dashboard.html              # Página em branco pós-login (canvas livre para criação da Wiki)
├── css/
│   └── style.css               # Estilo clean baseado nas cores da logo (Navy & Violet)
├── js/
│   └── app.js                  # Lógica de validações, estados de erro, persistência e autenticação
├── assets/
│   ├── logo.png                # Imagem oficial transparente da logo Wiki Una (512x512)
│   └── favicon.png             # Ícone otimizado para o navegador (<head>)
└── README.md                   # Documentação do projeto acadêmico
```

---

## 💻 Como Executar

A página é 100% autônoma e não necessita de nenhuma instalação pesada. Você pode executá-la de três formas:

### Opção 1: Abrir diretamente no navegador
Dê um duplo clique no arquivo `index.html` ou clique com o botão direito e escolha *"Abrir com Google Chrome"*.

### Opção 2: Servidor local com Python
No terminal, na pasta do projeto:
```bash
python3 -m http.server 8000
```
Depois, abra `http://localhost:8000` no seu navegador.

