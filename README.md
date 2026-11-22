# VP LIVE LAB

Painel para criação de imagens em transmissão 9:16. Inclui fila manual de pedidos, votos, estilos, geração real, download e cena separada.

## Ativação na Vercel

Use framework Other. Configure no servidor: OPENAI_API_KEY (chave da API com faturamento habilitado), LIVE_ADMIN_CODE (código privado longo para o operador), OPENAI_IMAGE_MODEL (opcional, padrão gpt-image-1-mini).

A chave nunca vai para o navegador. Para gerar, é preciso código privado. Configure limites de gastos na API antes de habilitar.

## Operação

Adicione pedidos recebidos na live, escolha e vote, revise o prompt e gere. Abra a cena 9:16 em outra janela do MESMO navegador e capture essa janela no OBS ou TikTok LIVE Studio. A sincronização entre janelas usa BroadcastChannel. Não há leitura automática dos comentários nem integração com o TikTok.

A fila é guardada no localStorage; imagens geradas ficam em memória. Baixe as artes antes de recarregar. Para escala é necessário backend persistente, autenticação e limites distribuídos (o código sozinho não controla o orçamento global).

TikTok LIVE deve ser conduzida por titular adulto elegível, segundo as regras da plataforma.

## Testes

npm test
