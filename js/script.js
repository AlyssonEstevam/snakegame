$(document).ready(function() {
    var canvas = $('#canvas')[0];
    var contexto = canvas.getContext('2d');
    var largura = $('#canvas').width();
    var altura = $('#canvas').height();
    var celula = 10;
    var movimento;
    var maca;
    var pontos;
    var vetorCobra;
    var velocidade;
    var contBonus;

    //Função para se criar a cobra inicial, sendo que a mesma começa com o valor 1, mas esse valor inicial pode ser 
    //alterado a partir desta função.
    function criarCobra() {
        var tamanhoCobra = 1;
        vetorCobra = [];
        var i;
        for (i = 0; i < tamanhoCobra; i++) {
            vetorCobra.push({ x: 45, y: 14 });
        }
    }

    //Sorteia a posição para se criar uma nova maçã, chamada no início do jogo ou após cada ponto.
    function novaMaca() {
        maca = {
            x: Math.round(Math.random() * (largura - celula) / celula),
            y: Math.round(Math.random() * (altura - celula) / celula)
        };
    }

    function definicoesJogo() {

        colorirMapa();

        //Define onde se encontra a cabeça da cobra.
        var eixoX = vetorCobra[0].x;
        var eixoY = vetorCobra[0].y;

        //Realiza o incremento/decremento da posição onde se encontra a cabeça da cobra a cada iteração.
        switch (movimento) {
            case "direita":
                eixoX++;
                break;
            case "esquerda":
                eixoX--;
                break;
            case "baixo":
                eixoY++;
                break;
            case "cima":
                eixoY--;
                break;
        }

        //Realiza as verificações de colisão com a parede ou com o corpo da própria cobra.
        if (eixoX == -1 || eixoX == largura / celula || eixoY == -1 || eixoY == altura / celula || verificaColisao(eixoX, eixoY, vetorCobra)) {
            if (parseInt(document.getElementById("highscore").innerHTML.replace("HIGH SCORE: ", "")) < pontos) {
                document.getElementById("highscore").innerHTML = "HIGH SCORE: " + pontos;
            }
            iniciarJogo();
            return;
        }

        //Verifica se a cabeça da cobra encontrou a maçã que estava no mapa, somando 1 ponto e aumentando a velocidade.
        //Caso teha encontrado, a cobra cresce um bloco a partir da posição da sua cabeça.
        if (eixoX == maca.x && eixoY == maca.y) {
            var raboCobra = { x: eixoX, y: eixoY };
            if (contBonus == 5) {
                pontos += 3;
                contBonus = 0;
            } else {
                pontos += 1;
                contBonus++;
            }

            velocidade = 100 - (pontos * 2);
            //Sorteia a posição da nova maçã ou da próxima maçã bônus.
            novaMaca();

            //Aumenta a velocidade com base na pontuação atual.
            if (typeof jogoIniciado != "undefined") {
                clearInterval(jogoIniciado);
            }
            jogoIniciado = setInterval(definicoesJogo, velocidade);
        } else {
            var raboCobra = vetorCobra.pop();
            raboCobra.x = eixoX;
            raboCobra.y = eixoY;
        }

        vetorCobra.unshift(raboCobra);

        //Realiza a nova renderização do corpo da cobra a partir do tamaho do vetor em que ela se encontra.
        for (var i = 0; i < vetorCobra.length; i++) {
            var c = vetorCobra[i];
            renderizarCorpoCobra(c.x, c.y);
        }

        //Renderiza a nova maçã ou a nova maçã bônus de acordo com a posição sorteada.
        renderizarMaca(maca.x, maca.y);

        //Realiza a atribuição da pontuação atual para ser exibida ao jogador.
        document.getElementById("pontuacao").innerHTML = "PONTUAÇÃO: " + pontos;
    }

    //Função para renderizar o retangulo que servirá como mapa do jogo, de acordo com a altura e a largura definidas anteriormente.
    function colorirMapa() {
        contexto.fillStyle = "white";
        contexto.fillRect(0, 0, largura, altura);
        contexto.strokeStyle = "#000000";
        contexto.strokeRect(0, 0, largura, altura);
    }

    //Função para criar os blocos verdes do corpo da snake.
    function renderizarCorpoCobra(x, y) {
        contexto.fillStyle = "green";
        contexto.fillRect(x * celula, y * celula, celula, celula);
        contexto.strokeStyle = "#000000";
        contexto.strokeRect(x * celula, y * celula, celula, celula);
    }

    /*
    Função para o canvas renderizar o quadrado da maça na tela com a cor vermelha no tamanho da célula
    nas posições sorteadas e passadas como parâmetro.
    */
    function renderizarMaca(x, y) {
        if (contBonus == 5) {
            contexto.fillStyle = "yellow";
        } else {
            contexto.fillStyle = "red";
        }
        contexto.fillRect(x * celula, y * celula, celula, celula);
        contexto.strokeStyle = "#000000";
        contexto.strokeRect(x * celula, y * celula, celula, celula);
    }

    //Verifica se a cabeça da cobra acertou alguma posição do vetor, ou seja, se ela bateu em si mesma.
    function verificaColisao(x, y, vet) {
        var i;
        for (i = 0; i < vet.length; i++) {
            if (vet[i].x == x && vet[i].y == y) {
                return true;
            }
        }
        return false;
    }

    /*
    Função que verifica se alguma das setas do teclado foi pressionada para mudar a direção da cobra, ou
    se a cobra estiver com tamanho 3 ou maior (2 pontos ou mais) e o jogador voltar para trás o jogo é reiniciado.
    */
    $(document).keydown(function(e) {
        var key = e.which;
        if (key == "40" && movimento != "cima") {
            movimento = "baixo";
        } else if (key == "39" && movimento != "esquerda") {
            movimento = "direita";
        } else if (key == "38" && movimento != "baixo") {
            movimento = "cima";
        } else if (key == "37" && movimento != "direita") {
            movimento = "esquerda";
        } else if (key == "40" && movimento == "cima" && pontos >= 2) {
            if (parseInt(document.getElementById("highscore").innerHTML.replace("HIGH SCORE: ", "")) < pontos) {
                document.getElementById("highscore").innerHTML = "HIGH SCORE: " + pontos;
            }
            iniciarJogo();
            return;
        } else if (key == "39" && movimento == "esquerda" && pontos >= 2) {
            if (parseInt(document.getElementById("highscore").innerHTML.replace("HIGH SCORE: ", "")) < pontos) {
                document.getElementById("highscore").innerHTML = "HIGH SCORE: " + pontos;
            }
            iniciarJogo();
            return;
        } else if (key == "38" && movimento == "baixo" && pontos >= 2) {
            if (parseInt(document.getElementById("highscore").innerHTML.replace("HIGH SCORE: ", "")) < pontos) {
                document.getElementById("highscore").innerHTML = "HIGH SCORE: " + pontos;
            }
            iniciarJogo();
            return;
        } else if (key == "37" && movimento == "direita" && pontos >= 2) {
            if (parseInt(document.getElementById("highscore").innerHTML.replace("HIGH SCORE: ", "")) < pontos) {
                document.getElementById("highscore").innerHTML = "HIGH SCORE: " + pontos;
            }
            iniciarJogo();
            return;
        }
    });

    //Realiza a chamada da função para se iniciar o jogo.
    iniciarJogo();

    function iniciarJogo() {
        //Inicia com a snake se movendo para baixo.
        movimento = "baixo";

        //Cria a cobra setando o vetor de acordo com o tamanho da mesma.
        criarCobra();

        //Sorteia um local para criar uma nova maçã.
        novaMaca();

        //Seta a pontuação e velocidade inicial.
        pontos = 0;
        velocidade = 100;
        contBonus = 0;

        if (typeof jogoIniciado != "undefined") {
            clearInterval(jogoIniciado);
        }
        jogoIniciado = setInterval(definicoesJogo, velocidade);
        //Realiza o loop para que a cobra nunca pare de andar, passando a velocidade que aumenta com o passar do tempo.
    }
});