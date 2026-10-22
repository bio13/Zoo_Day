/* Atenção caro programador! Não modifique nada que não entenda pois isso pode quebrar o fluxo do
jogo e consertar vai ser bem mais difícil do que imagina. Por isso, opte por criar outros arquivos .js
para os minigames e conectar com o HTML central. Obrigado pela atenção. */


// MAPAS
const tamanho = 30;
let mapaAberto = 1;

function criarMapa(largura, altura) {
    return Array.from({ length: altura }, (_, y) =>
        Array.from({ length: largura }, (_, x) =>
            x === 0 || x === largura - 1 || y === 0 || y === altura - 1 ? 1 : 0
        )
    );
}

const mapa4 = criarMapa(30, 20);
mapa4[0][15] = 4;
mapa4[19][15] = 4;

for (let y = 3; y <= 5; y++) {
    for (let x = 3; x <= 7; x++) mapa4[y][x] = 1;
    for (let x = 22; x <= 26; x++) mapa4[y][x] = 1;
}

for (let y = 13; y <= 15; y++) {
    for (let x = 3; x <= 7; x++) mapa4[y][x] = 1;
    for (let x = 22; x <= 26; x++) mapa4[y][x] = 1;
}

mapa4[7][10] = 2;
mapa4[10][20] = 3;

const mapas = {
    1: [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,4,4,1,1,1,1,1,1,1,1]
    ],

    2: [
        [1,1,1,1,1,1,1,1,4,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,4,1,1,1,1,1,1,1,1]
    ],

    3: [
        [1,1,1,1,1,1,1,1,4,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,0,0,0,0,0,1,1,1,1,0,1],
        [1,0,1,1,1,1,0,0,0,0,0,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,0,0,0,0,0,1,1,1,1,0,1],
        [1,0,1,1,1,1,0,0,0,0,0,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,4,1,1,1,1,1,1,1,1]
    ],

    4: mapa4
};


// CÂMERA
const mapasComCamera = [4];
const camera = { x: 0, y: 0 };

const larguraVisao = 17 * tamanho; 
const alturaVisao = 12 * tamanho; 

function mapaUsaCamera() {
    return mapasComCamera.includes(mapaAberto);
}

function atualizarCamera() {
    if (!mapaUsaCamera()) {
        camera.x = 0;
        camera.y = 0;
        return;
    }

    const mapa = mapas[mapaAberto];
    if (!mapa) return;

    const larguraMundo = mapa[0].length * tamanho;
    const alturaMundo = mapa.length * tamanho;

    // Mantém o jogador no centro, respeitando as bordas do mapa.
    camera.x = jogador.x + jogador.largura / 2 - canvas.width / 2;
    camera.y = jogador.y + jogador.altura / 2 - canvas.height / 2;

    camera.x = Math.max(0, Math.min(camera.x, larguraMundo - canvas.width));
    camera.y = Math.max(0, Math.min(camera.y, alturaMundo - canvas.height));
}


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

    if (mapasComCamera.includes(numeroMapa)) {
        canvas.width = larguraVisao;
        canvas.height = alturaVisao;
    } else {
        canvas.width = mapas[numeroMapa][0].length * tamanho;
        canvas.height = mapas[numeroMapa].length * tamanho;
    }

    jogador.x = x;
    jogador.y = y;

    camera.x = 0;
    camera.y = 0;

    atualizarCamera();
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

            ctx.fillRect(
                coluna * tamanho,
                linha * tamanho,
                tamanho,
                tamanho
            );
        }
    }
}


// COLISÕES
function colisao(x, y) {
    const mapa = mapas[mapaAberto];
    if (!mapa) return true;

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

    if (teclas["a"]) dx -= 1;
    if (teclas["d"]) dx += 1;
    if (teclas["w"]) dy -= 1;
    if (teclas["s"]) dy += 1;

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
    ctx.fillRect(
        jogador.x,
        jogador.y,
        jogador.largura,
        jogador.altura
    );
}


// INTERAÇÕES COM O MAPA
function realizarInteracao() {
    if (minigameAberto) {
        return;
    }

    const mapa = mapas[mapaAberto];

    const coluna = Math.floor(
        (jogador.x + jogador.largura / 2) / tamanho
    );

    const linha = Math.floor(
        (jogador.y + jogador.altura / 2) / tamanho
    );

    if (
        linha < 0 ||
        linha >= mapa.length ||
        coluna < 0 ||
        coluna >= mapa[linha].length
    ) {
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
    const linha = Math.floor(
        (jogador.y + jogador.altura / 2) / tamanho
    );

    if (mapaAberto === 1) {
        carregarMapa(2, 8 * tamanho + 3, 1 * tamanho + 3);
    } else if (mapaAberto === 2 && linha <= 1) {
        carregarMapa(1, 7 * tamanho + 3, 10 * tamanho + 3);
    } else if (mapaAberto === 2) {
        carregarMapa(3, 8 * tamanho + 3, 1 * tamanho + 3);
    } else if (mapaAberto === 3 && linha <= 1) {
        carregarMapa(2, 8 * tamanho + 3, 10 * tamanho + 3);
    } else if (mapaAberto === 3) {
        carregarMapa(4, 15 * tamanho + 3, 1 * tamanho + 3);
    } else if (mapaAberto === 4) {
        carregarMapa(3, 8 * tamanho + 3, 10 * tamanho + 3);
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


// ORIENTAÇÃO DA TELA
const avisoOrientacao = document.querySelector("#aviso-orientacao");

async function solicitarOrientacaoHorizontal() {
    if (modoJogo !== "mobile") return;

    try {
        if (
            screen.orientation &&
            typeof screen.orientation.lock === "function"
        ) {
            await screen.orientation.lock("landscape");
        }
    } catch (erro) {
        // Alguns navegadores não permitem travar a orientação.
        // Nesse caso, o aviso visual orienta a pessoa a girar o dispositivo.
    }
}

function atualizarOrientacao() {
    if (!avisoOrientacao) return;

    const telaVertical = window.innerHeight > window.innerWidth;
    const mostrarAviso = modoJogo === "mobile" && telaVertical;

    avisoOrientacao.style.display = mostrarAviso ? "flex" : "none";

    // Oculta o conteúdo por trás do aviso, sem alterar o estado do jogo.
    if (telaInicial) {
        telaInicial.style.visibility = mostrarAviso ? "hidden" : "";
    }

    if (containerJogo) {
        containerJogo.style.visibility = mostrarAviso ? "hidden" : "";
    }
}

window.addEventListener("load", () => {
    atualizarOrientacao();
    solicitarOrientacaoHorizontal();
});

window.addEventListener("resize", atualizarOrientacao);

window.addEventListener("orientationchange", () => {
    atualizarOrientacao();
    solicitarOrientacaoHorizontal();
});

// Tenta bloquear em paisagem após interação do usuário, quando permitido.
document.addEventListener("click", solicitarOrientacaoHorizontal);


// TROCAR MANUALMENTE ENTRE PC E MOBILE
trocarModo.addEventListener("click", () => {
    if (modoJogo === "pc") {
        modoJogo = "mobile";
        trocarModo.textContent = "Modo: Mobile";
        controlesMobile.style.display = "block";
        solicitarOrientacaoHorizontal();
    } else {
        modoJogo = "pc";
        trocarModo.textContent = "Modo: PC";
        controlesMobile.style.display = "none";
    }

    atualizarOrientacao();
});


// BOTÕES MOBILE
const botoesMobile = document.querySelectorAll(
    "#controlesMobile button[data-direcao]"
);

botoesMobile.forEach((botao) => {
    const direcao = botao.dataset.direcao;

    const pressionar = (evento) => {
        evento.preventDefault();
        teclas[direcao] = true;

        if (botao.setPointerCapture && evento.pointerId !== undefined) {
            try {
                botao.setPointerCapture(evento.pointerId);
            } catch (erro) {}
        }
    };

    const soltar = (evento) => {
        if (evento) evento.preventDefault();
        teclas[direcao] = false;
    };

    botao.addEventListener("pointerdown", pressionar);
    botao.addEventListener("pointerup", soltar);
    botao.addEventListener("pointercancel", soltar);
    botao.addEventListener("lostpointercapture", soltar);

    botao.addEventListener("contextmenu", (evento) => {
        evento.preventDefault();
    });
});


// BOTÃO DE INTERAÇÃO MOBILE
const botaoInteragir = document.querySelector("#botaoInteragir");

if (botaoInteragir) {
    botaoInteragir.addEventListener("pointerdown", (evento) => {
        evento.preventDefault();
        realizarInteracao();
    });

    botaoInteragir.addEventListener("contextmenu", (evento) => {
        evento.preventDefault();
    });
}


// LOOP DO JOGO
function atualizar() {
    movimentarJogador();
}

function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (mapaUsaCamera()) {
        atualizarCamera();
        ctx.save();
        ctx.translate(-camera.x, -camera.y);
        desenharMapa();
        desenharJogador();
        ctx.restore();
    } else {
        desenharMapa();
        desenharJogador();
    }
}

function gameLoop() {
    atualizar();
    desenhar();

    requestAnimationFrame(gameLoop);
}


// TELA INICIAL E INÍCIO DO JOGO
let jogoIniciado = false;
const telaInicial = document.querySelector("#telaInicial");
const botaoIniciar = document.querySelector("#botaoIniciar");
const containerJogo = document.querySelector("#container-jogo");

botaoIniciar.addEventListener("click", () => {
    if (jogoIniciado) return;
    jogoIniciado = true;
    telaInicial.style.display = "none";
    containerJogo.classList.remove("aguardando-inicio");
    atualizarOrientacao();
    carregarMapa(1, jogador.x, jogador.y);
    solicitarOrientacaoHorizontal();
    gameLoop();
});