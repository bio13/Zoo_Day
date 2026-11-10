(() => {
	"use strict";

	// ============================================================
	// MINIGAME 1 — Quebra-cabeça do cometa (Caroline Herschel)
	// ============================================================
	// Este arquivo é independente do script.js (que roda dentro de uma IIFE),
	// então as constantes abaixo precisam ser repetidas aqui.
	const VIEW_WIDTH = 17 * 32;   // 544
	const VIEW_HEIGHT = 12 * 32;  // 384
	const COLORS = { blue: 0x2D3A9F, purple: 0x8E44AD, pink: 0xFFB7B2, white: 0xFFFFFF };

	// A chave da cena deve ser igual ao id usado em MINIGAMES / action (script.js).
	const SCENE_KEY = "MiniGame_puzzle";

	const IMAGE_KEY = "puzzle_cometa";
	const IMAGE_PATH = "assets/sprites/puzzle/cometa.jpg";

	// grade do quebra cabeça
	const COLS = 5;
	const ROWS = 3;
	const PIECE = 55;                       // lado do quadrado da peça (sem os encaixes)
	const KNOB = Math.ceil(PIECE * 0.27);   // quanto o encaixe sai para fora do quadrado
	const TEX_SCALE = 3;                    // as texturas são geradas 3x maiores (nitidez)
	const BOARD_W = PIECE * COLS;           // 240
	const BOARD_H = PIECE * ROWS;           // 160
	const BOARD_X = (VIEW_WIDTH - BOARD_W) / 2;  // tabuleiro centralizado
	const BOARD_Y = 120;
	const EDGE_MARGIN = 20;                 // folga entre as peças e as bordas da tela
	const SNAP_DISTANCE = PIECE * 0.45;     // tolerância para encaixar (exige mais precisão)

	// Botão em 9-slice: os cantos de 9 px não são esticados,
	// só o centro e as bordas, então o botão pode ter qualquer tamanho sem distorcer.
	const BUTTON_KEY = "botao_9slice";
	const BUTTON_PATH = "assets/sprites/geral/botao_9slice.png";
	const BUTTON_SLICE = 9;
	const BUTTON_TEXT_COLOR = "#3B0050";

	const FONT_TITLE = '"Alagard", monospace';
	const FONT_TEXT = '"Pixelify Sans", monospace';

	const CURIOSITY =
		"Caroline Herschel (1750-1848) foi uma astrônoma alemã e a primeira mulher a " +
		"descobrir um cometa, em 1786. Ao todo, ela descobriu 8 cometas!\n\n" +
		"Cometas são bolas de gelo, poeira e rocha. Perto do Sol, o gelo evapora e forma " +
		"uma cauda brilhante que sempre aponta para longe dele.";

	// ------------------------------------------------------------
	// Desenho do formato de peça de quebra-cabeça
	// ------------------------------------------------------------
	// Traça UMA aresta a partir de (px, py) na direção (dx, dy), com comprimento PIECE.
	// sign: +1 = encaixe para fora, -1 = encaixe para dentro, 0 = borda reta.
	// A normal (dy, -dx) aponta para fora do quadrado quando o caminho é horário.
	function traceEdge(ctx, px, py, dx, dy, sign) {
		const S = PIECE;
		const nx = dy;
		const ny = -dx;
		const point = (t, h) => [
			px + dx * t * S + nx * h * S * sign,
			py + dy * t * S + ny * h * S * sign
		];
		if (sign === 0) {
			ctx.lineTo(px + dx * S, py + dy * S);
			return;
		}
		// Curva simétrica em relação ao meio da aresta (t = 0.5), para que duas
		// peças vizinhas encaixem exatamente uma na outra.
		const curves = [
			[[0.36, 0], null, null],
			[[0.44, 0.01], [0.40, 0.10], [0.34, 0.14]],
			[[0.28, 0.19], [0.38, 0.26], [0.50, 0.26]],
			[[0.62, 0.26], [0.72, 0.19], [0.66, 0.14]],
			[[0.60, 0.10], [0.56, 0.01], [0.64, 0.00]]
		];
		const [sx, sy] = point(0.36, 0);
		ctx.lineTo(sx, sy);
		for (const [c1, c2, end] of curves.slice(1)) {
			const a = point(c1[0], c1[1]);
			const b = point(c2[0], c2[1]);
			const e = point(end[0], end[1]);
			ctx.bezierCurveTo(a[0], a[1], b[0], b[1], e[0], e[1]);
		}
		ctx.lineTo(px + dx * S, py + dy * S);
	}

	// Traça o contorno completo de uma peça cujo quadrado começa em (x0, y0).
	function tracePiece(ctx, x0, y0, edges) {
		const S = PIECE;
		ctx.beginPath();
		ctx.moveTo(x0, y0);
		traceEdge(ctx, x0, y0, 1, 0, edges.top);
		traceEdge(ctx, x0 + S, y0, 0, 1, edges.right);
		traceEdge(ctx, x0 + S, y0 + S, -1, 0, edges.bottom);
		traceEdge(ctx, x0, y0 + S, 0, -1, edges.left);
		ctx.closePath();
	}

	// Sorteia os encaixes e devolve as arestas de cada peça já compatíveis
	// (o "fora" de uma peça é sempre o "dentro" da vizinha).
	function createEdgeMap() {
		const rnd = () => (Math.random() < 0.5 ? 1 : -1);
		const horizontal = Array.from({ length: ROWS }, () => Array.from({ length: COLS - 1 }, rnd));
		const vertical = Array.from({ length: ROWS - 1 }, () => Array.from({ length: COLS }, rnd));
		const get = (row, col) => ({
			top: row === 0 ? 0 : -vertical[row - 1][col],
			bottom: row === ROWS - 1 ? 0 : vertical[row][col],
			left: col === 0 ? 0 : -horizontal[row][col - 1],
			right: col === COLS - 1 ? 0 : horizontal[row][col]
		});
		return get;
	}

	class Minigame1Scene extends Phaser.Scene {
		constructor() {
			super(SCENE_KEY);
		}

		// Recebe { minigameId, title, description } enviados por openMinigame().
		init(data) {
			this.dataForMinigame = data || {};
			this.placed = 0;
			this.finished = false;
			// A instância da cena é reaproveitada ao reabrir o minigame.
			this.closing = false;
		}

		preload() {
			this.load.image(IMAGE_KEY, IMAGE_PATH);
			this.load.image(BUTTON_KEY, BUTTON_PATH);
		}

		// Texto nítido: o jogo usa pixelArt (filtro NEAREST) e o canvas é ampliado pelo
		// modo FIT, então o texto é renderizado na resolução real da tela, com filtro LINEAR.
		makeText(x, y, content, style) {
			const scale = (this.scale.displaySize.width / VIEW_WIDTH) * (window.devicePixelRatio || 1);
			// (as coordenadas continuam lógicas, então a conta acima segue valendo)
			const resolution = Math.min(4, Math.max(2, Math.ceil(scale)));
			const text = this.add.text(x, y, content, style).setResolution(resolution);
			text.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
			return text;
		}

		// Botão escalável: nineslice + texto, dentro de um container clicável.
		// width/height em coordenadas lógicas (mínimo: 2 x BUTTON_SLICE).
		makeButton(x, y, label, { width, height = 40, fontSize = "14px", onClick }) {
			const text = this.makeText(0, 0, label, {
				fontFamily: FONT_TEXT,
				fontSize,
				color: BUTTON_TEXT_COLOR
			}).setOrigin(0.5);
			const w = Math.max(BUTTON_SLICE * 2, width || Math.ceil(text.width) + 40);
			const h = Math.max(BUTTON_SLICE * 2, height);
			const slice = this.add.nineslice(0, 0, BUTTON_KEY, undefined, w, h,
				BUTTON_SLICE, BUTTON_SLICE, BUTTON_SLICE, BUTTON_SLICE);
			const button = this.add.container(x, y, [slice, text]).setSize(w, h);
			button.setInteractive({ useHandCursor: true });
			button.on("pointerdown", onClick);
			return button;
		}

		// Cria (ou recria) uma textura de canvas e deixa a função `draw` pintá-la.
		// O contexto já vem escalado por TEX_SCALE: desenhe em coordenadas do jogo.
		makeCanvasTexture(key, width, height, draw) {
			if (this.textures.exists(key)) this.textures.remove(key);
			const texture = this.textures.createCanvas(key, Math.ceil(width * TEX_SCALE), Math.ceil(height * TEX_SCALE));
			const ctx = texture.getContext();
			ctx.save();
			ctx.scale(TEX_SCALE, TEX_SCALE);
			draw(ctx);
			ctx.restore();
			texture.refresh();
			texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
			return texture;
		}

		create() {
			const { title = "Quebra-cabeça de Caroline Herschel" } = this.dataForMinigame;

			// O canvas do jogo é renderizado em ZOO_RENDER_SCALE x; o zoom mantém o
			// layout em coordenadas lógicas (544x384) e deixa tudo mais nítido.
			const renderScale = window.ZOO_RENDER_SCALE || 1;
			this.cameras.main.setZoom(renderScale).centerOn(VIEW_WIDTH / 2, VIEW_HEIGHT / 2);

			// Fundo ocupa a tela inteira do jogo (sem moldura).
			this.add.rectangle(VIEW_WIDTH / 2, VIEW_HEIGHT / 2, VIEW_WIDTH, VIEW_HEIGHT, COLORS.blue);
			this.add.rectangle(VIEW_WIDTH / 2, VIEW_HEIGHT / 2, VIEW_WIDTH, VIEW_HEIGHT, COLORS.purple, 0.45);

			this.titleText = this.makeText(VIEW_WIDTH / 2, 56, title, {
				fontFamily: FONT_TITLE,
				fontSize: "16px",
				color: "#FFFFFF",
				align: "center",
				wordWrap: { width: 240 }
			}).setOrigin(0.5);

			this.progressText = this.makeText(BOARD_X + BOARD_W / 2, BOARD_Y + BOARD_H + 36, "", {
				fontFamily: FONT_TEXT,
				fontSize: "13px",
				color: "#FFFFFF"
			}).setOrigin(0.5);
			this.updateProgress();

			// Botão de sair (no celular não existe ESC), no canto superior esquerdo.
			this.exitButton = this.makeButton(26, 24, "X", {
				width: 34,
				height: 34,
				fontSize: "16px",
				onClick: () => this.close(false)
			});

			this.keys = this.input.keyboard.addKeys({
				esc: Phaser.Input.Keyboard.KeyCodes.ESC
			});

			this.prepareImage();
			this.buildBoard();
			this.buildPieces();
			this.setupDragging();
		}

		// Recorta a foto no formato 3:2 (para a grade de peças quadradas)
		// e guarda a área recortada em this.crop.
		prepareImage() {
			const texture = this.textures.get(IMAGE_KEY);
			texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
			const source = texture.getSourceImage();
			const cropW = Math.min(source.width, source.height * COLS / ROWS);
			const cropH = cropW * ROWS / COLS;
			this.crop = {
				source,
				x: (source.width - cropW) / 2,
				y: (source.height - cropH) / 2,
				w: cropW,
				h: cropH
			};

			// Imagem completa recortada (usada na tela final).
			this.makeCanvasTexture("jig_full", BOARD_W, BOARD_H, (ctx) => {
				ctx.drawImage(source, this.crop.x, this.crop.y, this.crop.w, this.crop.h, 0, 0, BOARD_W, BOARD_H);
			});
		}

		// ----- Tabuleiro: fundo escuro, imagem "fantasma" e contornos das peças -----
		buildBoard() {
			this.edgeMap = createEdgeMap();
			this.boardBg = this.add.rectangle(BOARD_X + BOARD_W / 2, BOARD_Y + BOARD_H / 2, BOARD_W + 8, BOARD_H + 8, 0x000000, 0.6)
				.setStrokeStyle(2, COLORS.white);

			// Sem imagem de referência e sem linhas de guia: o jogador precisa
			// descobrir sozinho onde cada peça vai.
		}

		// ----- Peças: cada uma é uma textura recortada no formato de quebra-cabeça -----
		buildPieces() {
			const { source, x, y, w, h } = this.crop;
			const size = PIECE + KNOB * 2; // textura inclui a folga para os encaixes

			const pieces = [];
			for (let row = 0; row < ROWS; row += 1) {
				for (let col = 0; col < COLS; col += 1) {
					const key = `jig_piece_${row}_${col}`;
					const edges = this.edgeMap(row, col);
					const texture = this.makeCanvasTexture(key, size, size, (ctx) => {
						// Recorta pelo contorno da peça e desenha a imagem inteira deslocada.
						ctx.save();
						tracePiece(ctx, KNOB, KNOB, edges);
						ctx.clip();
						ctx.drawImage(source, x, y, w, h, KNOB - col * PIECE, KNOB - row * PIECE, BOARD_W, BOARD_H);
						ctx.restore();

						// Contorno: sombra escura + linha clara para destacar o formato.
						tracePiece(ctx, KNOB, KNOB, edges);
						ctx.lineJoin = "round";
						ctx.strokeStyle = "rgba(0, 0, 0, 0.55)";
						ctx.lineWidth = 2.6;
						ctx.stroke();
						ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
						ctx.lineWidth = 1.2;
						ctx.stroke();
					});
					// Máscara de transparência: só o desenho da peça (não o quadrado inteiro)
					// responde ao toque/mouse, para poder clicar numa peça por baixo de outra.
					const pixelSize = Math.ceil(size * TEX_SCALE);
					const mask = texture.getContext().getImageData(0, 0, pixelSize, pixelSize).data;
					pieces.push({
						key,
						mask,
						pixelSize,
						// Centro da posição correta no tabuleiro.
						targetX: BOARD_X + col * PIECE + PIECE / 2,
						targetY: BOARD_Y + row * PIECE + PIECE / 2
					});
				}
			}

			// Peças espalhadas "como se estivessem embaralhadas": metade em cada lado do
			// tabuleiro, em posições e ângulos aleatórios dentro de uma área limitada.
			const perSide = Math.ceil(pieces.length / 2);
			const sides = [
				this.scatterPositions(perSide, EDGE_MARGIN + PIECE / 2, BOARD_X - KNOB - PIECE / 2 - 2),
				this.scatterPositions(
					pieces.length - perSide,
					BOARD_X + BOARD_W + KNOB + PIECE / 2 + 2,
					VIEW_WIDTH - EDGE_MARGIN - PIECE / 2
				)
			];
			const homes = Phaser.Utils.Array.Shuffle([...sides[0], ...sides[1]]);

			this.pieces = pieces.map((data, index) => {
				const home = homes[index];

				const piece = this.add.image(home.x, home.y, data.key)
					.setScale(1 / TEX_SCALE)
					.setAngle(home.angle)
					.setDepth(10 + index)
					.setInteractive({
						hitArea: new Phaser.Geom.Rectangle(0, 0, data.pixelSize, data.pixelSize),
						hitAreaCallback: (area, x, y) => {
							if (!Phaser.Geom.Rectangle.Contains(area, x, y)) return false;
							const index = (Math.floor(y) * data.pixelSize + Math.floor(x)) * 4 + 3;
							return data.mask[index] > 40;
						},
						useHandCursor: true,
						draggable: true
					});

				piece.setData({
					homeX: home.x,
					homeY: home.y,
					homeAngle: home.angle,
					homeDepth: 10 + index,
					targetX: data.targetX,
					targetY: data.targetY
				});
				return piece;
			});
		}

		// Sorteia `count` posições dentro da faixa horizontal [minX, maxX] e da altura da
		// tela. Cada nova peça usa o melhor de vários candidatos (o mais longe das já
		// colocadas), então elas se espalham e nunca saem da área, mesmo com muitas peças.
		scatterPositions(count, minX, maxX) {
			// Topo da peça (sem os encaixes) não passa da base do botão X + margem.
			const minY = this.exitButton.getBounds().bottom + 8 + PIECE / 2;
			const maxY = VIEW_HEIGHT - EDGE_MARGIN - PIECE / 2; // não estoura embaixo
			const placed = [];
			for (let i = 0; i < count; i += 1) {
				let best = null;
				let bestDistance = -Infinity;
				for (let attempt = 0; attempt < 40; attempt += 1) {
					const candidate = {
						x: Phaser.Math.FloatBetween(minX, Math.max(minX, maxX)),
						y: Phaser.Math.FloatBetween(minY, maxY)
					};
					const nearest = placed.reduce(
						(min, other) => Math.min(min, Phaser.Math.Distance.Between(candidate.x, candidate.y, other.x, other.y)),
						Infinity
					);
					// Escolhe o candidato cuja distância à peça mais próxima é a mais perto
					// de 1,3 × PIECE: peças juntinhas, mas sem ficarem coladas.
					const score = nearest === Infinity ? 0 : -Math.abs(nearest - PIECE * 1.3);
					if (score > bestDistance) {
						bestDistance = score;
						best = candidate;
					}
				}
				best.angle = Phaser.Math.Between(-10, 10);
				placed.push(best);
			}
			return placed;
		}

		setupDragging() {
			this.input.on("dragstart", (_pointer, piece) => {
				if (this.finished) return;
				this.tweens.killTweensOf(piece);
				piece.setDepth(100).setAngle(0);
			});

			this.input.on("drag", (_pointer, piece, dragX, dragY) => {
				if (this.finished) return;
				piece.setPosition(dragX, dragY);
			});

			this.input.on("dragend", (_pointer, piece) => {
				if (this.finished) return;
				const distance = Phaser.Math.Distance.Between(
					piece.x, piece.y, piece.getData("targetX"), piece.getData("targetY")
				);
				if (distance <= SNAP_DISTANCE) this.snapPiece(piece);
				else this.returnPiece(piece);
			});
		}

		// Peça no lugar certo: fixa e não pode mais ser movida.
		snapPiece(piece) {
			piece.disableInteractive();
			piece.setDepth(5).setAngle(0);
			this.tweens.add({
				targets: piece,
				x: piece.getData("targetX"),
				y: piece.getData("targetY"),
				duration: 120,
				onComplete: () => {
					this.placed += 1;
					this.updateProgress();
					if (this.placed >= COLS * ROWS) this.win();
				}
			});
		}

		// Peça no lugar errado: volta para a posição inicial.
		returnPiece(piece) {
			this.tweens.add({
				targets: piece,
				x: piece.getData("homeX"),
				y: piece.getData("homeY"),
				angle: piece.getData("homeAngle"),
				duration: 220,
				ease: "Cubic.easeOut",
				onComplete: () => piece.setDepth(piece.getData("homeDepth"))
			});
		}

		updateProgress() {
			this.progressText.setText(`Peças: ${this.placed || 0}/${COLS * ROWS}`);
		}

		// ----- Conclusão -----
		// 1) as linhas das peças somem (a imagem inteira, sem linhas, surge por cima);
		// 2) a imagem sobe e diminui, o resto da tela some;
		// 3) o texto aparece linha por linha; 4) o botão CONTINUAR surge.
		win() {
			this.finished = true;
			this.exitButton.disableInteractive();

			const cx = BOARD_X + BOARD_W / 2;
			const cy = BOARD_Y + BOARD_H / 2;
			const base = 1 / TEX_SCALE;
			const full = this.add.image(cx, cy, "jig_full").setScale(base).setAlpha(0).setDepth(20);
			this.finalImage = full;

			// Brilho rápido sobre a imagem quando as linhas desaparecem.
			const flash = this.add.rectangle(cx, cy, BOARD_W, BOARD_H, 0xFFFFFF, 0).setDepth(21);

			this.tweens.add({
				targets: full,
				alpha: 1,
				duration: 800,
				ease: "Sine.easeInOut",
				onComplete: () => {
					for (const piece of this.pieces) piece.setVisible(false);
					this.tweens.add({ targets: flash, alpha: { from: 0.55, to: 0 }, duration: 600, onComplete: () => flash.destroy() });
					this.tweens.add({ targets: full, scale: base * 1.05, duration: 220, yoyo: true, ease: "Sine.easeOut" });
					this.time.delayedCall(1100, () => this.showCuriosity());
				}
			});
		}

		showCuriosity() {
			// O resto da tela some suavemente.
			this.tweens.add({
				targets: [this.titleText, this.progressText, this.exitButton, this.boardBg],
				alpha: 0,
				duration: 450
			});

			// A imagem completa sobe e diminui para dar lugar ao texto.
			const imageY = 112;
			this.tweens.add({
				targets: this.finalImage,
				x: VIEW_WIDTH / 2,
				y: imageY,
				scale: (1 / TEX_SCALE) * 0.8,
				duration: 800,
				ease: "Cubic.easeInOut"
			});

			const heading = this.makeText(VIEW_WIDTH / 2, 26, "Parabéns!", {
				fontFamily: FONT_TITLE,
				fontSize: "22px",
				color: "#FFFFFF"
			}).setOrigin(0.5).setDepth(30).setAlpha(0);
			this.tweens.add({ targets: heading, alpha: 1, duration: 600, delay: 500 });

			// Texto: uma linha por vez, subindo e surgindo em sequência.
			const style = {
				fontFamily: FONT_TEXT,
				fontSize: "13px",
				color: "#FFFFFF",
				align: "center",
				lineSpacing: 5,
				wordWrap: { width: VIEW_WIDTH - 90 }
			};
			const probe = this.makeText(0, 0, CURIOSITY, style).setVisible(false);
			const lines = probe.getWrappedText();
			const lineHeight = probe.height / lines.length;
			probe.destroy();

			const startY = 196;
			const firstDelay = 1000;
			const step = 170;
			let lastTween = null;
			lines.forEach((line, i) => {
				if (!line.trim()) return;
				const text = this.makeText(VIEW_WIDTH / 2, startY + i * lineHeight + 8, line, style)
					.setOrigin(0.5, 0).setDepth(30).setAlpha(0);
				lastTween = this.tweens.add({
					targets: text,
					alpha: 1,
					y: startY + i * lineHeight,
					duration: 450,
					delay: firstDelay + i * step,
					ease: "Sine.easeOut"
				});
			});

			const textEnd = startY + lines.length * lineHeight;
			const buttonY = Math.min(VIEW_HEIGHT - 28, textEnd + 30);
			const showButton = () => {
				const next = this.makeButton(VIEW_WIDTH / 2, buttonY, "CONTINUAR", {
					height: 40,
					fontSize: "14px",
					onClick: () => this.close(true)
				}).setDepth(30).setAlpha(0);
				this.tweens.add({ targets: next, alpha: 1, duration: 500 });
				// Enter também conclui (teclado).
				this.input.keyboard.once("keydown-ENTER", () => this.close(true));
			};
			if (lastTween) lastTween.once("complete", showButton);
			else this.time.delayedCall(firstDelay, showButton);
		}

		update() {
			if (Phaser.Input.Keyboard.JustDown(this.keys.esc)) this.close(this.finished);
		}

		// completed = true marca o progresso no jogo principal.
		close(completed) {
			if (this.closing) return;
			this.closing = true;
			this.game.events.emit("minigame:closed", this.dataForMinigame.minigameId, completed);
			this.scene.stop();
			this.scene.resume("MainScene");
		}
	}

	// Registro global: o script.js lê esta lista ao criar o Phaser.Game.
	window.MINIGAME_SCENES = window.MINIGAME_SCENES || [];
	window.MINIGAME_SCENES.push({ id: "puzzle", key: SCENE_KEY, scene: Minigame1Scene });
})();
