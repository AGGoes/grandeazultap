# Grande Azul • グランデ・アズール
### E-Commerce de Mergulho de Alta Performance (Estilo Japonês & Nuvemshop)

Projeto acadêmico desenvolvido para a disciplina de **Negócios Eletrônicos**, baseado no **Termo de Abertura do Projeto (TAP)**.

---

## 👥 Integrantes do Projeto
- **Enio Bristot Júnior**
- **Gabriel Martins de Almeida**
- **Saulo Giordani Arantes Goes**

---

## 🌊 Conceito e Estética Japonesa (和風モダン・ダイビング)
O e-commerce foi desenhado combinando o rigor técnico dos equipamentos de mergulho com o minimalismo editorial japonês (inspirado em marcas como *GULL Japan*, *TUSA*, *Snow Peak* e a estética costeira de Kamakura e Okinawa):
- **Tipografia Bilíngue Harmonizada**: Fontes `Noto Sans JP`, `Shippori Mincho` e `Inter` integrando títulos em português com kanji e katakana (`深海探求・安全第一`).
- **Selo Hanko (判子)**: Carimbos tradicionais em vermelho cinnabar para autenticação de rigor técnico (`【正規取扱店】`, `【厳選品】`, `【安全第一】`).
- **Padrão Seigaiha (青海波)**: Textura sutil de ondas geométricas oceânicas japonesas nas transições de seção.
- **Faixas Verticais de Leitura (`writing-mode: vertical-rl`)**: Detalhes decorativos que evocam a tradição e o respeito pela natureza do mar.
- **Densidade Informativa com Clareza**: Especificações técnicas completas, tabelas de medidas detalhadas e transparência nos dados de segurança.

---

## 🚀 Funcionalidades Principais do E-Commerce

### 1. Catálogo Parametrizado (17 Produtos em 4 Categorias)
Todos os 17 produtos do documento TAP foram cadastrados com SKU, preços de venda, parcelamento em até 10x sem juros, desconto de 5% no Pix e fichas técnicas:
1. **Equipamentos Principais (4 itens)**:
   - Cilindro de Alumínio S80 (11,1L) com Torneira (`GA-EQP-01`)
   - Mini Cilindro Reserva Spare Air (`GA-EQP-02`)
   - Colete Equilibrador BCD Recreativo (`GA-EQP-03`)
   - Kit Máscara de Silicone e Snorkel com Válvula (`GA-EQP-04`)
2. **Vestuário e Proteção (5 itens)**:
   - Macacão / Roupa de Neoprene 3mm (`GA-VES-05`)
   - Camisa Térmica UV Rashguard UPF 50+ (`GA-VES-06`)
   - Nadadeira Regulável de Calcanhar Aberto (`GA-VES-07`)
   - Luvas de Neoprene 2mm (`GA-VES-08`)
   - Bota de Neoprene com Solado Antiderrapante (`GA-VES-09`)
3. **Acessórios e Eletrônicos (2 itens)**:
   - Câmera de Ação Subaquática 4K 60fps (`GA-ELE-10`)
   - Lanterna Subaquática de LED 1000 Lumens (`GA-ELE-11`)
4. **Acessórios e Manutenção (6 itens)**:
   - Spray Antiembaçante para Máscara 30ml (`GA-ACS-12`)
   - Tira/Strap de Reposição em Silicone (`GA-ACS-13`)
   - Prendedor/Clip para Octopus (`GA-ACS-14`)
   - Cabide Especial para Colete BCD e Regulador (`GA-ACS-15`)
   - Saco de Rede (Mesh Bag) para Equipamentos (`GA-ACS-16`)
   - Kit de Manutenção com 20 O-Rings + Graxa Silicone (`GA-ACS-17`)

### 2. Modal de Detalhes Técnicos & Tabelas de Medidas
- Visualização ampliada do equipamento com especificações detalhadas (pressão de serviço, materiais, certificações CE/ISO).
- **Tabela de Medidas (Size Charts)** dedicada para roupas de neoprene (P a XG com altura, peso, tórax, cintura), botas náuticas (36 ao 45 BR), nadadeiras e coletes BCD (capacidade de lift).
- Guia de cuidados e manutenção preventiva pós-mergulho.

### 3. Modo de Gestão TAP / Nuvemshop (Alternador no Header)
- Ao clicar no botão **"Visão Gestão TAP / Nuvemshop"** no topo da página, os cards de produto exibem instantaneamente os dados contábeis do documento:
  - Custo Unitário (R$)
  - Margem Bruta Oficial (%)
  - Lucro Bruto Unitário (R$)
  - Markup Comercial (%)

### 4. Guia Consultivo Interativo (Recomendador / コンシェルジュ)
- Atende à oportunidade identificada no TAP para o público de entrada (snorkeling e mergulho recreativo):
  - 1º Passo: Nível de experiência (Snorkeling, Recreativo ou Técnico)
  - 2º Passo: Temperatura da água (Tropical, Temperada ou Fria)
  - 3º Passo: Prioridade atual (Kit Inicial, Conforto Térmico ou Segurança)
  - Gera recomendação instantânea de kit personalizado com 1 clique para adicionar tudo ao carrinho.

### 5. Carrinho de Compras & Checkout Nuvemshop
- Drawer deslizante lateral com contagem de itens em tempo real.
- Barra de progresso para **Frete Grátis** (pedidos acima de R$ 399,00).
- Simulador de frete por CEP brasileiro (PAC e Sedex).
- Campo de cupons de desconto (`GRANDEAZUL10` para 10% OFF, `BEMVINDO` para R$ 50 OFF).
- Checkout com simulação Nuvem Pago (Pix com desconto e Cartão em até 10x) e botão direto de envio do pedido estruturado para o WhatsApp do consultor técnico.

### 6. Seção Institucional & Referências ABNT NBR 6023
- Apresentação do Termo de Abertura do Projeto (TAP).
- Tabela oficial de custos, venda e margem bruta com totalizadores do portfólio.
- Referências normatizadas ABNT citando ABETA, Ministério do Turismo, Estado de Minas, Nuvemshop, Narwhal e Brasilturis.

---

## 💻 Como Abrir e Executar o Site
Não é necessário nenhum instalador ou ferramenta externa. O projeto foi construído em padrões web modernos (HTML5, CSS3 puro e JavaScript ES6+):
1. Basta dar um duplo clique no arquivo [`index.html`](file:///c:/Users/aluno/Desktop/grandeAzul/index.html).
2. O site abrirá instantaneamente em qualquer navegador moderno (Chrome, Edge, Firefox, Safari).
3. Todas as fontes e ícones carregam via CDN com cache otimizado e os arquivos de estilo e scripts são locais.
