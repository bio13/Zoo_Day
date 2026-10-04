// MAPA
const canvas = document.querySelector("#jogo");
const ctx = canvas.getContext("2d");
const tamanho = 30;
const mapa = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1]
];

canvas.width = mapa[0].length * tamanho;
canvas.height = mapa.length * tamanho;

function desenharMapa() {
    for (let linha = 0; linha < mapa.length; linha++) {
        for (let coluna = 0; coluna < mapa[linha].length; coluna++) {
            if (mapa[linha][coluna] === 1) {
                ctx.fillStyle = "orange";
            } else {
                ctx.fillStyle = "brown";
            }
            ctx.fillRect(coluna * tamanho, linha * tamanho, tamanho, tamanho);
        }
    }
}

// PERSONAGEM
const jogador = {
    x: 100,
    y: 100,
    largura: 24,
    altura: 24,
    velocidade: 3
};



function colisao(x, y) {
    const pontos = [
        [x, y],
        [x + jogador.largura - 1, y],
        [x, y + jogador.altura - 1],
        [x + jogador.largura - 1, y + jogador.altura - 1]
    ];
    for (let ponto of pontos) {
        const coluna = Math.floor(ponto[0] / tamanho);
        const linha = Math.floor(ponto[1] / tamanho);
        if (
            linha < 0 ||
            linha >= mapa.length ||
            coluna < 0 ||
            coluna >= mapa[linha].length
        ) {
            return true;
        }
        if (mapa[linha][coluna] !== 0) {
            return true;
        }
    }
    return false;
}

const teclas = {};
document.addEventListener("keydown", (evento) => {
    teclas[evento.key] = true;
});
document.addEventListener("keyup", (evento) => {
    teclas[evento.key] = false;
});


function movimentarJogador() {
    let dx = 0;
    let dy = 0;
    if (teclas["a"]) {
        if (jogador.x > 1) {
            dx -= 1;
        }
    }
    if (teclas["d"]) {
        if (jogador.x < canvas.width - jogador.largura) {
            dx += 1;
        }
    }
    if (teclas["w"]) {
        if (jogador.y > 1) {
            dy -= 1;
        }
    }
    if (teclas["s"]) {
        if (jogador.y < canvas.height - jogador.altura) {
            dy += 1;
        }
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

function desenharJogador() {
    ctx.fillStyle = "white";
    ctx.fillRect(
        jogador.x,
        jogador.y,
        jogador.largura,
        jogador.altura
    );
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


const botoesMobile = document.querySelectorAll("#controlesMobile button");
botoesMobile.forEach((botao) => {
    const direcao = botao.dataset.direcao;
    botao.addEventListener("mousedown", () => {
        teclas[direcao] = true;
    });
    botao.addEventListener("mouseup", () => {
        teclas[direcao] = false;
    });
    botao.addEventListener("mouseleave", () => {
        teclas[direcao] = false;
    });
    botao.addEventListener("touchstart", (evento) => {
        evento.preventDefault();
        teclas[direcao] = true;
    });
    botao.addEventListener("touchend", () => {
        teclas[direcao] = false;
    });
});

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
    requestAnimationFrame(gameLoop);
}
gameLoop();
