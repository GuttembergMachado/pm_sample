# pm_sample
Demate - Paradise Mounting (Dispensador Multi-uso)

Programa exibidor de vídeos e fotos com base OMX player escrito preferencialmente em Phyton ou C# para aplicação no Raspberry S.O. Raspbean. 
Programa desenvolvido em duas versões sendo uma extensão da outra. 

##Características da versão básica: 

A versão do programa básico terá características somente de exibição de vídeos e fotos com interface web com somente duas opções de ajustes e uma tela inicial de login para evitar a interação de qualquer pessoa. 
1. Tempo do dosador que deve variar entre 100 ms e 1 segundo no máximo, o menu pode ser apresentado em uma escala de 1 a 10, sendo 1 = 100 ms e os incrementos posteriores somando 100 ms a cada nível. 
2. Tempo de exibição de fotos variando em uma escala de 1 a 10 onde 1 representa um segundo e assim sucessivamente. 
3. Apresentar mudanças no sistema operacional para melhora de performace focado somente na exibição de vídeo e fotos desabilitar e ou remover eventuais ferramentas que não terá utilidade para o sistema. 
4. A tela web será exibida em 1024 x 768 pontos para que atenda a monitores antigos. 

Exemplo da tela web: 

## Pinos de entrada e saída: 

- GPIO 02 = Entrada shutdown do sistema operacional. 
- GPIO 03 = Entrada sensor. 
- GPIO 04 = Saída luzes. 
- GPIO 05 = Saída dosador. 

##Funções a executar: 

Ao ligar colocar os vídeos para rodar imediatamente, caso não se encontre o penndrive com os vídeos, tocar o vídeo de apresentação que estará na pasta vídeos com o nome Demo.MP4.
 
GPIO 03 = Quando em 0, aguarda 100 ms e verifica novamente,
 estando GPIO 03 em 0 Executar: 
 
1. GPIO 04 colocar em 1. 
2. Aguarda 200 ms. 
3. GPIO 05 coloca em 1. 
4. Aguarda 800 ms. 
5. GPIO 05 em 0. 
6. Aguarda 200 ms. 
7. GPIO 04 em 0. 
8. Aguarda 5 segundos e volta a testar GPIO 03 novamente. 

##Divisão da janela de vídeo

Dividido em três partes, conforme ilustração: 

OBS: o vídeo e ou foto será por nós fornecido nos formatos, MP4, GIF e JPEG nas resoluções que conhecida com as áreas a ser habitada por cada elemento de imagem. 

##Tamanho dos vídeos: 

Área de horário = 1080 x 158 
Área de vídeo = 1080 x 1640 
Mensagem inferior = 1080 x 122 
Área total = 1080 x 1920 (L x A). 

##Descrição das áreas de exibição: 

Área de horário será composto por um vídeo de fundo (presente na pasta vídeos do O.S. com nome Horário.MP4) e o sistema deve sobrepor a imagem com o horário atual, é desejável a mudança aleatória de posição para evitar marcar o monitor. 

Área de vídeo, será populada por um vídeo único a ser produzido para cada cliente 

Área de mensagem irá possuir um vídeo único presente na pasta vídeos do O.S. com o nome mensagem. 

