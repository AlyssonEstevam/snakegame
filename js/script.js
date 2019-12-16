$(document).ready(function() {
    var canvas = $('#canvas')[0];
    var contexto = canvas.getContext('2d');
    var largura = $('#canvas').width();
    var altura = $('#canvas').height();
    var celula = 10;
    var movimento;
    var comida;
    var pontos;
    var vetorCobra;
    var velocidade;

    function criarCobra() {
        var tamanhoCobra = 1;
        vetorCobra = [];
        var i;
        for (i = 0; i < tamanhoCobra; i++) {
            vetorCobra.push({ x: 45, y: 14 });
        }
    }

    function novaComida() {
        comida = {
            x: Math.round(Math.random() * (largura - celula) / celula),
            y: Math.round(Math.random() * (altura - celula) / celula)
        };
    }

    function definicoesJogo() {

        colorirMapa();

        var eixoX = vetorCobra[0].x;
        var eixoY = vetorCobra[0].y;

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


        if (eixoX == -1 || eixoX == largura / celula || eixoY == -1 || eixoY == altura / celula || verificaColisao(eixoX, eixoY, vetorCobra)) {
            iniciarJogo();
            return;
        }

        if (eixoX == comida.x && eixoY == comida.y) {
            var raboCobra = { x: eixoX, y: eixoY };
            pontos += 1;
            velocidade = 100 - pontos;
            novaComida();
        } else {
            var raboCobra = vetorCobra.pop();
            raboCobra.x = eixoX;
            raboCobra.y = eixoY;
        }

        vetorCobra.unshift(raboCobra);

        for (var i = 0; i < vetorCobra.length; i++) {
            var c = vetorCobra[i];
            renderizarCorpoCobra(c.x, c.y);
        }

        renderizarComida(comida.x, comida.y);

        document.getElementById("pontuacao").innerHTML = "PONTUAÇÃO: " + pontos;
    }

    function colorirMapa() {
        contexto.fillStyle = "white";
        contexto.fillRect(0, 0, largura, altura);
        contexto.strokeStyle = "#000000";
        contexto.strokeRect(0, 0, largura, altura);
    }

    function renderizarCorpoCobra(x, y) {
        contexto.fillStyle = "green";
        contexto.fillRect(x * celula, y * celula, celula, celula);
        contexto.strokeStyle = "#000000";
        contexto.strokeRect(x * celula, y * celula, celula, celula);
    }

    function renderizarComida(x, y) {
        contexto.fillStyle = "red";
        contexto.fillRect(x * celula, y * celula, celula, celula);
        contexto.strokeStyle = "#000000";
        contexto.strokeRect(x * celula, y * celula, celula, celula);
    }

    function verificaColisao(x, y, vet) {
        var i;
        for (i = 0; i < vet.length; i++) {
            if (vet[i].x == x && vet[i].y == y) {
                return true;
            }
        }
        return false;
    }

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
            iniciarJogo();
            return;
        } else if (key == "39" && movimento == "esquerda" && pontos >= 2) {
            iniciarJogo();
            return;
        } else if (key == "38" && movimento == "baixo" && pontos >= 2) {
            iniciarJogo();
            return;
        } else if (key == "37" && movimento == "direita" && pontos >= 2) {
            iniciarJogo();
            return;
        }
    });

    iniciarJogo();

    function iniciarJogo() {
        movimento = "baixo";
        criarCobra();
        novaComida();
        pontos = 0;
        velocidade = 100;

        if (typeof jogoIniciado != "undefined") {
            clearInterval(jogoIniciado);
        }
        jogoIniciado = setInterval(definicoesJogo, velocidade);
    }
});