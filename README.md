# Portfólio — Maria Leticia

Este repositório contém o meu site-portfolio (Designer & Dev). Mostro trabalhos, ferramentas e um formulário de contato via EmailJS. Inclui um botão fixo para baixar meu currículo (PDF), um carrossel de destaques e um lightbox para visualização das imagens.

## Funcionalidades principais
- Topbar fixa com navegação (Início, Projetos, Ferramentas, Contato) que aparece/esconde conforme rolagem.
- Sidebar sticky para navegação lateral.
- Seção "Projetos" como carrossel responsivo em loop.
- Cards de projeto com legenda; clique abre lightbox.
- Formulário de contato integrado com EmailJS (mensagens de status).
- Botão fixo no canto inferior direito para baixar meu CV (força download via blob como fallback).
- CSS organizado com variáveis para tema e espaçamentos.

## Uso rápido
1. Abra `index.html` no navegador ou sirva com um servidor local:
   - PowerShell: `python -m http.server 8000`
   - Acesse: `http://localhost:8000`
2. Coloque o PDF do currículo em:
   `./assets/site/CurriculoLattesMariaLeticiaDeOliveiraCardoso.pdf`

## Configuração necessária
- EmailJS:
  - Defina em `script.js`:
    - `EMAILJS_USER_ID` - Chave pública (Não use a chave privada. Lembre-se de limitar o domínio ao que você vai usar)
    - `EMAILJS_SERVICE_ID`
    - `EMAILJS_TEMPLATE_ID`

## Estrutura
- index.html — marcação principal
- style.css — estilos (variáveis em `:root`, layout, carrossel, lightbox, topbar)
- script.js — lógica: navegação, carrossel, lightbox, EmailJS, download do CV
- assets/
  - site/CurriculoLattesMariaLeticiaDeOliveiraCardoso.pdf — currículo
  - trabalhos/ — imagens dos projetos

## O que não é óbvio (explicações)
- Topbar show/hide: escondo a topbar apenas depois que a rolagem ultrapassa a altura dela; uso `.topbar--hidden` com `transform` para evitar relayout pesado.
- Espaçamento com a topbar: `.container` tem `padding-top` igual à `--topbar-height` para evitar sobreposição.
- Carrossel: uso `offsetLeft` dos slides para calcular o deslocamento em pixels — isso evita slides vazios no final. O carrossel faz loop e pausa ao hover/focus.
- Lightbox: ao clicar na imagem do card, abro o lightbox com a mesma `src`. É possível usar `data-full-src` para versões maiores.
- Download do CV: tento `fetch()` e crio um Blob para forçar o download; se falhar, caio no link direto.
- Variáveis CSS: cores, espaçamentos e breakpoints estão em `:root` para evitar números mágicos e facilitar ajustes.

## Ajustes comuns
- Trocar imagens dos projetos: coloque novos arquivos em `assets/trabalhos/` e atualize os `src` nos slides.
- Alterar tamanho do carrossel/cards: ajuste as variáveis e as regras `.card` / `.carousel-slide` em `style.css`.
- Desabilitar autoplay: edite `script.js` para remover/ajustar a função de autoplay.

## Depuração rápida
- Download do PDF não funciona: verifique o caminho do arquivo e permissões; tente abrir o PDF diretamente.
- Slides vazios no carrossel: confirme que cada `.carousel-slide` tem conteúdo e que `gap`/`padding` do track não criam sobreposição.
- Topbar tremendo: verifique se não há `transform` aplicado em ancestrais (isso cria novos stacking contexts).

## Licença
Meu portfólio pessoal — use e modifique conforme precisar.
