/* Atenção caro programador! Não modifique nada que não entenda pois isso pode quebrar o fluxo do
jogo e consertar vai ser bem mais difícil do que imagina. Por isso, opte por criar outros arquivos .js
para os minigames e conectar com o HTML central. Obrigado pela atenção. */


// MAPAS
const tamanho = 30;
let mapaAberto = 1;
const mapas = {
    1: [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    2: [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 4, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 4, 1, 1, 1, 1, 1]
    ]
};


// CANVAS
const canvas = document.querySelector("#jogo");
const ctx = canvas.getContext("2d");


// JOGADOR
const jogador = {
    x: 100,
    y: 100,
    largura: 24,
    altura: 24,
    velocidade: 3
};


// ESTADO DO JOGO
let minigameAberto = false;


// CARREGAR MAPA
function carregarMapa(numeroMapa, x, y) {
    mapaAberto = numeroMapa;
    canvas.width = mapas[numeroMapa][0].length * tamanho;
    canvas.height = mapas[numeroMapa].length * tamanho;
    jogador.x = x;
    jogador.y = y;
}


// DESENHAR MAPA
function desenharMapa() {
    const mapa = mapas[mapaAberto];
    for (let linha = 0; linha < mapa.length; linha++) {
        for (let coluna = 0; coluna < mapa[linha].length; coluna++) {
            if (mapa[linha][coluna] === 1) {
                ctx.fillStyle = "orange";
            } else if (mapa[linha][coluna] === 2) {
                ctx.fillStyle = "yellow";
            } else if (mapa[linha][coluna] === 3) {
                ctx.fillStyle = "pink";
            } else if (mapa[linha][coluna] === 4) {
                ctx.fillStyle = "blue";
            } else {
                ctx.fillStyle = "brown";
            }
            ctx.fillRect(coluna * tamanho, linha * tamanho, tamanho, tamanho);
        }
    }
}


// COLISÕES
function colisao(x, y) {
    const mapa = mapas[mapaAberto];
    const pontos = [
        [x, y],
        [x + jogador.largura - 1, y],
        [x, y + jogador.altura - 1],
        [x + jogador.largura - 1, y + jogador.altura - 1]
    ];

    for (let ponto of pontos) {
        const coluna = Math.floor(ponto[0] / tamanho);
        const linha = Math.floor(ponto[1] / tamanho);
        if (linha < 0 || linha >= mapa.length || coluna < 0 || coluna >= mapa[linha].length
        ) {
            return true;
        }

        if (mapa[linha][coluna] == 1) {
            return true;
        }
    }
    return false;
}


// MOVIMENTAÇÃO
const teclas = {};
document.addEventListener("keydown", (evento) => {
    teclas[evento.key.toLowerCase()] = true;
    if (evento.key.toLowerCase() === "e" && !evento.repeat) {
        realizarInteracao();
    }
});
document.addEventListener("keyup", (evento) => {
    teclas[evento.key.toLowerCase()] = false;
});

function movimentarJogador() {
    if (minigameAberto) {
        return;
    }

    let dx = 0;
    let dy = 0;
    if (teclas["a"]) {
        dx -= 1;
    }
    if (teclas["d"]) {
        dx += 1;
    }
    if (teclas["w"]) {
        dy -= 1;
    }
    if (teclas["s"]) {
        dy += 1;
    }

    const novoX = jogador.x + dx * jogador.velocidade; 
    const novoY = jogador.y + dy * jogador.velocidade;
    if (!colisao(novoX, jogador.y)) {
        jogador.x = novoX;
    }
    if (!colisao(jogador.x, novoY)) {
        jogador.y = novoY;
    }
}


// DESENHAR JOGADOR
function desenharJogador() {
    ctx.fillStyle = "white";
    ctx.fillRect(jogador.x, jogador.y, jogador.largura, jogador.altura);
}


// INTERAÇÕES COM O MAPA
function realizarInteracao() {
    if (minigameAberto) {
        return;
    }

    const mapa = mapas[mapaAberto];
    const coluna = Math.floor((jogador.x + jogador.largura / 2) /tamanho);
    const linha = Math.floor((jogador.y + jogador.altura / 2) /tamanho);
    if (linha < 0 || linha >= mapa.length || coluna < 0 || coluna >= mapa[linha].length) {
        return;
    }

    const area = mapa[linha][coluna];
    if (area === 2) {
        abrirMinigame1();
        return;
    }
    if (area === 3) {
        abrirMinigame2();
        return;
    }
    if (area === 4) {
        trocarMapa();
        return;
    }
}


// TROCAR MAPA
function trocarMapa() {
    if (mapaAberto === 1) {
        carregarMapa(
            2,
            4 * tamanho + 3,
            4 * tamanho + 3
        );
        return;
    }
    if (mapaAberto === 2) {
        carregarMapa(
            1,
            7 * tamanho + 3,
            10 * tamanho + 3
        );
        return;
    }
}


// MODO PC / MOBILE
let modoJogo = "pc";
const trocarModo = document.querySelector("#trocarModo");
const controlesMobile = document.querySelector("#controlesMobile");
if (navigator.maxTouchPoints > 0) {
    modoJogo = "mobile";
    trocarModo.textContent = "Modo: Mobile";
    controlesMobile.style.display = "block";

} else {
    modoJogo = "pc";
    trocarModo.textContent = "Modo: PC";
    controlesMobile.style.display = "none";
}


// TROCAR MANUALMENTE
trocarModo.addEventListener("click", () => {
    if (modoJogo === "pc") {
        modoJogo = "mobile";
        trocarModo.textContent = "Modo: Mobile";
        controlesMobile.style.display = "block";
    } else {
        modoJogo = "pc";
        trocarModo.textContent = "Modo: PC";
        controlesMobile.style.display = "none";
    }
});


// BOTÕES MOBILE
const botoesMobile = document.querySelectorAll("#controlesMobile button[data-direcao]");
botoesMobile.forEach((botao) => {
    const direcao = botao.dataset.direcao;
    botao.addEventListener(
        "mousedown",
        () => {
            teclas[direcao] = true;
        }
    );
    botao.addEventListener(
        "mouseup",
        () => {
            teclas[direcao] = false;
        }
    );
    botao.addEventListener(
        "mouseleave",
        () => {
            teclas[direcao] = false;
        }
    );
    botao.addEventListener(
        "touchstart",
        (evento) => {
            evento.preventDefault();
            teclas[direcao] = true;
        }
    );
    botao.addEventListener(
        "touchend",
        () => {
            teclas[direcao] = false;
        }
    );
});


// BOTÃO DE INTERAÇÃO MOBILE
const botaoInteragir = document.querySelector("#botaoInteragir");
if (botaoInteragir) {
    botaoInteragir.addEventListener(
        "click",
        () => {
            realizarInteracao();
        }
    );
    botaoInteragir.addEventListener(
        "touchstart",
        (evento) => {
            evento.preventDefault();
            realizarInteracao();
        }
    );
}


// LOOP DO JOGO
function atualizar() {
    movimentarJogador();
}

function desenhar() {
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
    desenharMapa();
    desenharJogador();
}

function gameLoop() {
    atualizar();
    desenhar();
    requestAnimationFrame(
        gameLoop
    );
}


// INICIAR JOGO
carregarMapa(
    1,
    jogador.x,
    jogador.y
);
gameLoop();
