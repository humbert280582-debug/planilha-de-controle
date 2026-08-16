# Sistema de Controle de Frota — Parente Andrade

Sistema web com login para gerenciar a frota que hoje vive na planilha `Veiculos_Frota_Parente_Andrade.xlsm` (196 veículos), com consulta e edição completa dos dados.

## Módulos da primeira versão

### 1. Frota e cadastro dos veículos
- Lista de veículos com busca por placa/modelo/proprietário, filtros (UF, combustível, situação, status de venda) e paginação.
- Ficha do veículo em abas, reunindo tudo que hoje está espalhado em várias abas da planilha:
  - **Cadastro fixo**: placa, marca, modelo, fab/mod, tanque, renavam, chassi.
  - **Cadastro variável**: cor, combustível, lotação, espécie, tipo, carroceria, categoria, capacidade, potência, cilindrada, motor, CMT, eixos, PBT, UF, DUT/CRV, código/descrição do produto.
  - **Propriedade**: proprietário, CPF/CNPJ.
  - **Implementos**: especificação, fornecedor, NF, descrição.
  - **FIPE**: detalhe e código.
- Criar, editar e excluir veículos e todos os blocos acima.

### 2. Vendas e recebimentos
- Situação de venda por veículo: status (Não transferido / Transferido / Quitado), valor, comprador, nota fiscal, observações.
- Recebimentos lançados por veículo (valor, data, fonte do pagamento) com cálculo automático do total recebido e do saldo a pagar — substitui a coluna "Falta pagar" da planilha.
- Cadastro de clientes/compradores (nome reduzido, nome empresarial, endereço, e-mail, contato, código TOTVS) vinculado às vendas.

### 3. Impedimentos e licenciamento
- Impedimentos por veículo: banco/tribunal, contrato/processo, observações.
- Licenciamento: último licenciamento, UF, final da placa e cálculo do prazo/vencimento conforme o calendário da UF, com destaque para vencidos e a vencer.

### 4. Painel inicial
Visão consolidada equivalente à aba HOME: total de veículos, quantos vendidos/transferidos/quitados, valores a receber, veículos com impedimento e licenciamentos vencidos, além de uma tabela de status por veículo com pendências de cadastro.

## Importação dos dados
Todos os registros atuais da planilha são carregados no banco na criação do sistema (veículos, cadastro fixo/variável, propriedade, implementos, FIPE, licenciamento, vendas, recebimentos, impedimentos, clientes), então o sistema já abre com a frota completa.

## Acesso
Login por e-mail e senha. Somente usuários autenticados veem ou alteram qualquer dado da frota. O primeiro acesso é criado na tela de cadastro.

## Detalhes técnicos
- Lovable Cloud (banco + autenticação) com tabelas: `vehicles` (dados fixos e variáveis + propriedade), `vehicle_implements`, `vehicle_fipe`, `licensing`, `sales`, `receipts`, `impediments`, `clients`, mais `profiles`/`user_roles`.
- RLS em todas as tabelas restringindo leitura e escrita a usuários autenticados; nenhum acesso anônimo.
- Dados da planilha convertidos em INSERTs dentro da migração inicial.
- Rotas protegidas sob `_authenticated`: `/` (painel), `/veiculos`, `/veiculos/$placa`, `/vendas`, `/recebimentos`, `/licenciamento`, `/impedimentos`, `/clientes`; `/auth` pública.
- Valores monetários e datas em formato brasileiro (R$, dd/mm/aaaa).
