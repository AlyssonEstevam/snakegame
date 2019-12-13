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

    function configuracao() {

        colorirMapa();

        var eixo_x = vetorCobra[0].x;
        var eixo_y = vetorCobra[0].y;

        switch (movimento) {
            case "direita":
                eixo_x++;
                break;
            case "esquerda":
                eixo_x--;
                break;
            case "baixo":
                eixo_y++;
                break;
            case "cima":
                eixo_y--;
                break;
        }


        if (eixo_x == -1 || eixo_x == largura / celula || eixo_y == -1 || eixo_y == altura / celula || verificaColisao(eixo_x, eixo_y, vetorCobra)) {
            iniciarJogo();
            return;
        }

        if (eixo_x == comida.x && eixo_y == comida.y) {
            var raboCobra = { x: eixo_x, y: eixo_y };
            pontos += 1;
            novaComida();
        } else {
            var raboCobra = vetorCobra.pop();
            raboCobra.x = eixo_x;
            raboCobra.y = eixo_y;
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
        contexto.fillStyle = "blue";
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

        if (typeof jogoIniciado != "undefined") {
            clearInterval(jogoIniciado);
        }
        jogoIniciado = setInterval(configuracao, 60);
    }
});