(() => {
  "use strict";

  // ============================================================
  // 1. CONFIGURAÇÃO GLOBAL
  // ============================================================

  const TILE_SIZE = 32;
  const VIEW_COLS = 17;
  const VIEW_ROWS = 12;
  const VIEW_WIDTH = VIEW_COLS * TILE_SIZE;
  const VIEW_HEIGHT = VIEW_ROWS * TILE_SIZE;
  // O canvas é renderizado em RENDER_SCALE x a resolução lógica (544x384) e as câmeras
  // dão zoom equivalente: o jogo continua igual, mas textos e imagens ficam nítidos.
  const RENDER_SCALE = 2;
  window.ZOO_RENDER_SCALE = RENDER_SCALE;
  const PLAYER_SIZE = 24;
  const PLAYER_SPEED = 180;

  const COLORS = {
    blue: 0x2D3A9F,
    purple: 0x8E44AD,
    orange: 0xFF8C00,
    pink: 0xFFB7B2,
    white: 0xFFFFFF,
    ink: "#FFFFFF"
  };

  const TILE_ASSETS = {
    tile_floor_house: "assets/sprites/tiles/floor-house.png",
    tile_rug_top: "assets/sprites/tiles/rug_top.png",
    tile_rug_bottom: "assets/sprites/tiles/rug_bottom.png",
    tile_rug_left: "assets/sprites/tiles/rug_left.png",
    tile_rug_right: "assets/sprites/tiles/rug_right.png",
    tile_rug_top_left: "assets/sprites/tiles/rug_top_left.png",
    tile_rug_top_right: "assets/sprites/tiles/rug_top_right.png",
    tile_rug_bottom_left: "assets/sprites/tiles/rug_bottom_left.png",
    tile_rug_bottom_right: "assets/sprites/tiles/rug_bottom_right.png",
    tile_rug_center: "assets/sprites/tiles/rug_center.png",
    tile_hall_a: "assets/sprites/tiles/hallway_a.png",
    tile_hall_b: "assets/sprites/tiles/hallway_b.png",
    tile_grass_a: "assets/sprites/tiles/grass_a.png",
    tile_grass_b: "assets/sprites/tiles/grass_b.png",
    tile_concrete_a: "assets/sprites/tiles/concrete_a.png",
    tile_concrete_b: "assets/sprites/tiles/concrete_b.png",
    tile_wall_front: "assets/sprites/tiles/wall_house_front.png",
    tile_wall_other: "assets/sprites/tiles/wall_house_other.png",
    tile_fence_h: "assets/sprites/tiles/fence_h.png",
    tile_fence_v: "assets/sprites/tiles/fence_v.png",
    tile_rug: "assets/sprites/tiles/rug_tile.png",
    tile_dirt: "assets/sprites/tiles/dirt.png",
    tile_water: "assets/sprites/tiles/water.png",
    tile_wall_pink: "assets/sprites/tiles/wall_pink.png",
    tile_wall_blue: "assets/sprites/tiles/wall_blue.png",
    tile_green: "assets/sprites/tiles/tile_green.png",
    tile_orange: "assets/sprites/tiles/tile_orange.png",
    tile_hedge: "assets/sprites/tiles/hedge.png",
    tile_stone: "assets/sprites/tiles/stone.png"
  };

  const OBJECT_ASSETS = {
    obj_bed: "assets/sprites/objects/bed.png",
    obj_desk: "assets/sprites/objects/desk.png",
    obj_wardrobe: "assets/sprites/objects/wardrobe.png",
    obj_space_poster: "assets/sprites/objects/space_poster.png",
    obj_space_poster_2: "assets/sprites/objects/space_poster_2.png",
    obj_cat_decoration: "assets/sprites/objects/cat_decoration.png",
    obj_books: "assets/sprites/objects/books.png",
    obj_door_closed_front: "assets/sprites/objects/door_closed_front.png",
    obj_door_closed_back: "assets/sprites/objects/door_closed_back.png",
    obj_door_closed_side: "assets/sprites/objects/door_closed_side.png",
    obj_door_open_left: "assets/sprites/objects/door_open_left.png",
    obj_door_open_front: "assets/sprites/objects/door_open_front.png",
    obj_door_open_back: "assets/sprites/objects/door_open_back.png",
    obj_sofa: "assets/sprites/objects/sofa.png",
    obj_fridge: "assets/sprites/objects/fridge.png",
    obj_counter: "assets/sprites/objects/counter.png",
    obj_stove: "assets/sprites/objects/stove.png",
    obj_sink: "assets/sprites/objects/sink.png",
    obj_sandwich_station: "assets/sprites/objects/sandwich_station.png",
    obj_puzzle_table: "assets/sprites/objects/puzzle_table.png",
    obj_book: "assets/sprites/objects/book.png",
    obj_puzzle: "assets/sprites/objects/puzzle.png",
    obj_bench: "assets/sprites/objects/bench.png",
    obj_tree: "assets/sprites/objects/tree.png",
    obj_bush: "assets/sprites/objects/bush.png",
    obj_plant: "assets/sprites/objects/plant.png",
    obj_zoo_gate: "assets/sprites/objects/zoo_gate.png",
    obj_picnic_blanket: "assets/sprites/objects/picnic_blanket.png",
    obj_picnic_basket: "assets/sprites/objects/picnic_basket.png",
    obj_sign_animals: "assets/sprites/objects/sign_animals.png",
    obj_fountain: "assets/sprites/objects/fountain.png",
    obj_flower: "assets/sprites/objects/flower.png",
    obj_sofia: "assets/sprites/objects/sofia.png",
    obj_cabinet: "assets/sprites/objects/cabinet.png"
  };

  // ============================================================
  // 2. FUNÇÕES PARA CRIAR A GRADE DOS CENÁRIOS
  // ============================================================
  // Símbolos do layout:
  // # = parede/grade sólida; . = piso; p = caminho de concreto; D = passagem.
  function createRoomLayout({ width = VIEW_COLS, height = VIEW_ROWS, doors = [] } = {}) {
    const grid = Array.from({ length: height }, (_, row) =>
      Array.from({ length: width }, (_, col) =>
        row === 0 || row === height - 1 || col === 0 || col === width - 1 ? "#" : "."
      )
    );

    for (const door of doors) {
      if (grid[door.row] && grid[door.row][door.col] !== undefined) {
        grid[door.row][door.col] = "D";
      }
    }

    return grid.map((row) => row.join(""));
  }

  function createZooLayout() {
    const width = 30;
    const height = 20;
    const grid = Array.from({ length: height }, () => Array(width).fill("."));

    // Cercamento ao redor do zoológico, com uma passagem de entrada na borda inferior.
    for (let col = 0; col < width; col += 1) {
      grid[0][col] = "#";
      grid[height - 1][col] = "#";
    }
    for (let row = 0; row < height; row += 1) {
      grid[row][0] = "#";
      grid[row][width - 1] = "#";
    }
    grid[height - 1][15] = "D";

    // Caminhos de concreto em volta do gramado e conexão com a entrada.
    for (let col = 3; col <= 26; col += 1) {
      grid[4][col] = "p";
      grid[15][col] = "p";
    }
    for (let row = 4; row <= 15; row += 1) {
      grid[row][3] = "p";
      grid[row][26] = "p";
    }
    for (let row = 15; row <= 18; row += 1) grid[row][15] = "p";

    return grid.map((row) => row.join(""));
  }

  function object(sprite, col, row, w, h, options = {}) {
    return {
      sprite,
      col,
      row,
      w: 1,
      h: 1,
      solid: false,
      collision: null,
      action: null,
      label: "",
      depthOffset: 0,
      interactionRadius: null,
      ...options
    };
  }

  // ============================================================
  // 3. MAPAS E POSICIONAMENTO DOS SPRITES
  // ============================================================
  const MAPS = {
    bedroom: {
      title: "Quarto da Sofia",
      width: 9,
      height: 8,
      layout: [
        "#########",
        "#########",
        "#.......#",
        "#.......#",
        "#.RRRRR.#",
        "#.RRRRR.#",
        "#.......#",
        "####D####"
      ],
      floorFrames: ["tile_floor_house"],
      wallFrontFrame: "tile_wall_front",
      wallOtherFrame: "tile_wall_other",
      rugFrames: {
        top: "tile_rug_top",
        bottom: "tile_rug_bottom",
        left: "tile_rug_left",
        right: "tile_rug_right",

        topLeft: "tile_rug_top_left",
        topRight: "tile_rug_top_right",
        bottomLeft: "tile_rug_bottom_left",
        bottomRight: "tile_rug_bottom_right",

        center: "tile_rug_center"
      },
      spawn: { col: 4, row: 4 },
      portals: [
        { col: 4, row: 7, to: "hallway", spawn: { col: 2, row: 2 }, label: "Ir para o corredor" }
      ],
      objects: [
        object("obj_space_poster", 1.5, 0.7, 2, 1, { depthOffset: 20 }),
        object("obj_space_poster_2", 5.5, 0.73, 2, 1, { depthOffset: 20 }),
        object("obj_desk", 3.5, 1.4, 2, 1, { solid: true, collision: [0.08, 0.2, 0.84, 0.72], visualWidth: 50 }),
        object("obj_door_open_back", 4, 7, 1, 1, { depthOffset: 3 }),
        object("obj_cat_decoration", 0.8, 5.5, 1, 1, { depthOffset: 20, visualWidth: 20}),
        object("obj_books", 7.2, 5, 1, 1, { depthOffset: 20, visualWidth: 20, solid: true, collision: [0.15, 0.12, 0.75, 0.85] }),
        object("obj_bed", 1.5, 2.2, 2, 2, {
          solid: true,
          collision: [0.14, 0.02, 1.1, 0.7],
          visualWidth: 50
        }),
        object("obj_wardrobe", 7, 1.6, 2, 2, {
          solid: true,
          collision: [0.05, 0.14, 0.9, 0.82],
          action: "look",
          label: "Escolher o look",
          interactionRadius: 50,
        }),
      ]
    },

    hallway: {
      title: "Corredor",
      width: 5,
      height: 9,
      layout: [
        "#####",
        "##D##",
        "#...#",
        "#...#",
        "#...#",
        "#...#",
        "#...#",
        "#...#",
        "##D##"
      ],
      floorFrames: ["tile_floor_house"],
      wallFrontFrame: "tile_wall_front",
      wallOtherFrame: "tile_wall_other",
      spawn: { col: 2, row: 2 },
      portals: [
        { col: 2, row: 1, to: "bedroom", spawn: { col: 4, row: 7 }, label: "Entrar no quarto" },
        { col: 2, row: 8, to: "livingroom", spawn: { col: 5, row: 2 }, label: "Ir para a sala de estar" }
      ],
      objects: [
        object("obj_door_open_front", 2, 1, 1, 1, { depthOffset: 3, solid: true }),
        object("obj_door_open_back", 2, 8, 1, 1, { depthOffset: 3 }),
      ]
    },

    livingroom: {
      title: "Sala de estar",
      width: 11,
      height: 8,
      layout: [
        "###########",
        "#####D#####",
        "#.........#",
        "#.........#",
        "#.........D",
        "#.........#",
        "#.........#",
        "#######D###"
      ],
      floorFrames: ["tile_floor_house"],
      wallFrontFrame: "tile_wall_front",
      wallOtherFrame: "tile_wall_other",
      tileOverrides: {"3,10": "tile_wall_front"},
      spawn: { col: 5, row: 2 },
      portals: [
        { col: 5, row: 1, to: "hallway", spawn: { col: 2, row: 8 }, label: "Ir para o corredor" },
        { col: 10, row: 4, to: "kitchen", spawn: { col: 1, row: 5 }, label: "Ir para a cozinha" },
        { col: 5, row: 7, to: "zoo", spawn: { col: 15, row: 17 }, label: "Sair de casa para o zoológico", locked: true }
      ],
      objects: [
        object("obj_sofa", 1.8, 2, 3, 2, { solid: true, collision: [-0.1, 0.3, 1.7, 0.5], visualWidth: 80 }),
        object("obj_bench", 1.8, 3.5, 2, 2, {
          solid: true,
          collision: [-0.1, 0.35, 1.4, 0.55],
          action: "puzzle",
          label: "Ler o livro e montar o quebra-cabeça",
          interactionRadius: 50,
          visualWidth: 60
        }),        
        object("obj_door_open_front", 5, 1, 1, 1, { depthOffset: 3, solid: true }),
        object("obj_door_closed_back", 7, 7, 1, 1, { solid: true })
      ]
    },

    kitchen: {
      title: "Cozinha",
      width: 10,
      height: 8,
      layout: [
        "##########",
        "##########",
        "#........#",
        "#........#",
        "D........#",
        "#........#",
        "#........#",
        "##########"
      ],
      floorFrames: ["tile_floor_house"],
      wallFrontFrame: "tile_wall_front",
      wallOtherFrame: "tile_wall_other",
      tileOverrides: {"3,0": "tile_wall_front"},
      spawn: { col: 8, row: 5 },
      portals: [
        { col: 0, row: 4, to: "livingroom", spawn: { col: 10, row: 4 }, label: "Voltar para a sala de estar" }
      ],
      objects: [
        object("obj_fridge", 1, 2, 2, 3, { solid: true, collision: [0.08, 0.1, 0.84, 0.85] }),
        object("obj_counter", 5, 2, 3, 1, { solid: true, collision: [0.02, 0.25, 0.96, 0.72] }),
        object("obj_stove", 4, 2, 2, 2, { solid: true, collision: [0.08, 0.22, 0.84, 0.72] }),
        object("obj_sink", 4, 2, 2, 2, { solid: true, collision: [0.08, 0.22, 0.84, 0.72] }),
        object("obj_cabinet", 5, 2, 3, 1, { solid: true, collision: [0.02, 0.25, 0.96, 0.72] }),
        object("obj_sandwich_station", 1, 8, 3, 2, {
          solid: true,
          collision: [0.04, 0.44, 0.92, 0.5],
          action: "sandwiches",
          label: "Preparar os sanduíches",
          interactionRadius: 82
        }),

      ]
    },

    zoo: {
      title: "Zoológico — Piquenique",
      width: 30,
      height: 20,
      layout: createZooLayout(),
      floorFrames: ["tile_grass_a", "tile_grass_b"],
      pathFrames: ["tile_concrete_a", "tile_concrete_b"],
      wallFrame: "tile_fence_h",
      wallStyle: "fence",
      spawn: { col: 15, row: 17 },
      portals: [],
      objects: [
        object("obj_tree", 1, 1, 2, 3, { solid: true, collision: [0.18, 0.48, 0.64, 0.45] }),
        object("obj_tree", 7, 1, 2, 3, { solid: true, collision: [0.18, 0.48, 0.64, 0.45] }),
        object("obj_tree", 27, 5, 2, 3, { solid: true, collision: [0.18, 0.48, 0.64, 0.45] }),
        object("obj_tree", 1, 11, 2, 3, { solid: true, collision: [0.18, 0.48, 0.64, 0.45] }),
        object("obj_tree", 24, 11, 2, 3, { solid: true, collision: [0.18, 0.48, 0.64, 0.45] }),
        object("obj_bush", 5, 5, 1, 1, { solid: true }),
        object("obj_bush", 10, 3, 1, 1, { solid: true }),
        object("obj_bush", 24, 6, 1, 1, { solid: true }),
        object("obj_bush", 21, 13, 1, 1, { solid: true }),
        object("obj_flower", 5, 12, 1, 1),
        object("obj_flower", 8, 14, 1, 1),
        object("obj_bench", 10, 13, 1, 1, { solid: true, collision: [0.05, 0.35, 0.9, 0.6] }),
        object("obj_sofia", 7, 8, 1, 1, { depthOffset: 2 }),
        object("obj_sofia", 19, 10, 1, 1, { depthOffset: 2 }),
        object("obj_sofia", 21, 14, 1, 1, { depthOffset: 2 }),
        object("obj_fountain", 4, 11, 2, 2, { solid: true, collision: [0.1, 0.35, 0.8, 0.6] }),
        object("obj_picnic_blanket", 13, 8, 4, 2, {
          action: "mixtures",
          label: "Estudar as misturas com as amigas",
          interactionRadius: 104,
          depthOffset: 1
        }),
        object("obj_picnic_basket", 14, 7, 1, 1, { depthOffset: 75 }),
        object("obj_picnic_basket", 16, 9, 1, 1, { depthOffset: 75 }),
        object("obj_sign_animals", 22, 3, 3, 2, { depthOffset: 2 }),
        object("obj_zoo_gate", 22, 0, 4, 3, {
          solid: true,
          collision: [0.04, 0.65, 0.92, 0.3],
          action: "animalsEntrance",
          label: "Entrada da área dos animais",
          interactionRadius: 112,
          depthOffset: 4
        })
      ]
    }
  };

  const MINIGAMES = {
    sandwiches: {
      title: "Preparação dos sanduíches",
      description: "Escolha e combine ingredientes para atender aos pedidos das amigas e revisar os nutrientes dos alimentos."
    },
    puzzle: {
      title: "Quebra-cabeça de Caroline Herschel",
      description: "Arraste as peças para montar a imagem do cometa e descubra a contribuição da astrônoma."
    },
    look: {
      title: "Escolha do look",
      description: "Combine blusa, parte de baixo e calçado para se preparar para um dia caminhando pelo zoológico."
    },
    mixtures: {
      title: "Classificação das misturas",
      description: "Observe alimentos e bebidas do piquenique e classifique-os como misturas homogêneas ou heterogêneas."
    }
  };

  const mobileDirections = { w: false, a: false, s: false, d: false };
  window.ZooGame = null;
  window.ZooMainScene = null;

  // ============================================================
  // 4. CENA PRINCIPAL
  // ============================================================
  class MainScene extends Phaser.Scene {
    constructor() {
      super("MainScene");
      this.currentMapId = "bedroom";
      this.playerState = { x: 0, y: 0, width: PLAYER_SIZE, height: PLAYER_SIZE };
      this.minigameOpen = false;
      this.progress = { sandwiches: false, puzzle: false, look: false, phone: false, zoo: false, mixtures: false };
      this.transitioning = false;
      this.dialogueOpen = false;
      this.scenarioViews = new Map();
      this.objectInstances = [];
      this.lastHudText = "";
      this.noticeUntil = 0;
      this.noticeMessage = "";
    }

    preload() {
      for (const [key, path] of Object.entries(TILE_ASSETS)) this.load.image(key, path);
      for (const [key, path] of Object.entries(OBJECT_ASSETS)) this.load.image(key, path);
    }

    create() {
      this.buildAllScenarios();

      const initial = MAPS[this.currentMapId];
      this.playerState.x = initial.spawn.col * TILE_SIZE + (TILE_SIZE - PLAYER_SIZE) / 2;
      this.playerState.y = initial.spawn.row * TILE_SIZE + (TILE_SIZE - PLAYER_SIZE) / 2;

      // O sprite do personagem é ancorado pelos pés.
      this.player = this.add.image(
        this.playerState.x + PLAYER_SIZE / 2,
        this.playerState.y + PLAYER_SIZE,
        "obj_sofia"
      ).setOrigin(0.5, 1).setDisplaySize(24, 36).setDepth(100);

      this.hud = {
        setText: (text) => {
          const label = document.querySelector("#label-cenario");
          const instructions = document.querySelector("#label-instrucoes");
          if (!label || !instructions) return;
          const value = String(text);
          const separator = "  ·  ";
          if (value.startsWith("E  ·  ")) {
            label.textContent = MAPS[this.currentMapId]?.title || "O Curioso Mundo de Sofia";
            instructions.textContent = value;
            return;
          }
          const parts = value.split(separator);
          label.textContent = parts[0] || "O Curioso Mundo de Sofia";
          instructions.textContent = parts.slice(1).join(separator) || "WASD / SETAS: mover · E: interagir";
        }
      };
      this.notice = {
        visible: false,
        setText(text) {
          const element = document.querySelector("#label-aviso");
          if (element) element.textContent = text;
          return this;
        },
        setVisible(visible) {
          this.visible = visible;
          const element = document.querySelector("#label-aviso");
          if (element) element.hidden = !visible;
          return this;
        }
      };

      this.keys = this.input.keyboard.addKeys({
        w: Phaser.Input.Keyboard.KeyCodes.W,
        a: Phaser.Input.Keyboard.KeyCodes.A,
        s: Phaser.Input.Keyboard.KeyCodes.S,
        d: Phaser.Input.Keyboard.KeyCodes.D,
        up: Phaser.Input.Keyboard.KeyCodes.UP,
        left: Phaser.Input.Keyboard.KeyCodes.LEFT,
        down: Phaser.Input.Keyboard.KeyCodes.DOWN,
        right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
        interact: Phaser.Input.Keyboard.KeyCodes.E
      });

      this.game.events.on("minigame:closed", this.onMinigameClosed, this);
      this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
        this.game.events.off("minigame:closed", this.onMinigameClosed, this);
        if (window.ZooMainScene === this) window.ZooMainScene = null;
      });

      window.ZooMainScene = this;
      this.loadScenario(this.currentMapId, initial.spawn);
      const loading = document.querySelector("#loadingOverlay");
      if (loading) loading.hidden = true;
      this.showNotice("Sofia: Hoje vai ser um dia especial no zoológico! Vou me arrumar e preparar os sanduíches.", 5200);
    }

    update(_time, delta) {
      if (this.minigameOpen || this.dialogueOpen || this.transitioning) return;

      this.movePlayer(Math.min(delta, 50) / 1000);
      this.updateCamera();
      this.updatePlayerDepth();
      this.updateInteractionPrompt();

      if (Phaser.Input.Keyboard.JustDown(this.keys.interact)) this.interact();
    }

    buildAllScenarios() {
      for (const [mapId, map] of Object.entries(MAPS)) {
        const worldWidth = map.width * TILE_SIZE;
        const worldHeight = map.height * TILE_SIZE;
        const background = this.add.renderTexture(0, 0, worldWidth, worldHeight)
          .setOrigin(0, 0)
          .setDepth(0)
          .setVisible(false);

        const objectInstances = [];

        for (let row = 0; row < map.height; row += 1) {
          for (let col = 0; col < map.width; col += 1) {
            const symbol = map.layout[row][col];
            const key = this.getTileTexture(map, symbol, row, col);

            if (symbol === "#") {
              const sprite = this.add.image(
                col * TILE_SIZE + TILE_SIZE / 2,
                (row + 1) * TILE_SIZE,
                key
              ).setOrigin(0.5, 1);

              const sourceWidth = sprite.width || TILE_SIZE;
              sprite.setScale(TILE_SIZE / sourceWidth);
              sprite.setDepth((row + 1) * TILE_SIZE + 1).setVisible(false);

              const definition = {
                sprite: key,
                col,
                row,
                w: 1,
                h: 1,
                solid: true,
                collision: null,
                action: null,
                label: "",
                depthOffset: 1,
                kind: "wall"
              };
              const instance = {
                mapId,
                definition,
                sprite,
                x: col * TILE_SIZE + TILE_SIZE / 2,
                y: (row + 1) * TILE_SIZE,
                width: TILE_SIZE,
                height: sprite.displayHeight,
                collider: null
              };
              objectInstances.push(instance);
              this.objectInstances.push(instance);
              continue;
            }

            background.stamp(key, null, col * TILE_SIZE, row * TILE_SIZE, {
              originX: 0,
              originY: 0
            });
          }
        }
        background.render();

        for (const definition of map.objects) {
          const footprintWidth = definition.w * TILE_SIZE;
          const footprintHeight = definition.h * TILE_SIZE;
          const x = definition.col * TILE_SIZE + footprintWidth / 2;
          const groundY = (definition.row + definition.h) * TILE_SIZE;
          const sprite = this.add.image(x, groundY, definition.sprite)
            .setOrigin(0.5, 1);

          const sourceWidth = sprite.width || footprintWidth;
          const sourceHeight = sprite.height || footprintHeight;
          const hasVisualWidth = Number.isFinite(definition.visualWidth);
          const hasVisualHeight = Number.isFinite(definition.visualHeight);
          let visualWidth;
          let visualHeight;

          if (hasVisualWidth && hasVisualHeight) {
            visualWidth = definition.visualWidth;
            visualHeight = definition.visualHeight;
          } else if (hasVisualWidth) {
            visualWidth = definition.visualWidth;
            visualHeight = visualWidth * sourceHeight / sourceWidth;
          } else if (hasVisualHeight) {
            visualHeight = definition.visualHeight;
            visualWidth = visualHeight * sourceWidth / sourceHeight;
          } else {
            visualWidth = footprintWidth;
            visualHeight = visualWidth * sourceHeight / sourceWidth;
          }

          sprite.setDisplaySize(visualWidth, visualHeight)
            .setDepth(groundY + definition.depthOffset)
            .setVisible(false);

          const collider = definition.solid
            ? this.createObjectCollider(definition)
            : null;

          const instance = {
            mapId,
            definition,
            sprite,
            x,
            y: groundY,
            width: footprintWidth,
            height: footprintHeight,
            collider
          };
          objectInstances.push(instance);
          this.objectInstances.push(instance);
        }

        this.scenarioViews.set(mapId, { background, objectInstances });
      }
    }

    getTileTexture(map, symbol, row, col) {
      const override = map.tileOverrides?.[`${row},${col}`];
      if (override) {
        return override;
      }
      if (symbol === "#") {
        if (map.wallStyle === "fence") {
          return (row === 0 || row === map.height - 1)
            ? "tile_fence_h"
            : "tile_fence_v";
        }
        if (row === 1 && col > 0 && col < map.width - 1) {
          return map.wallFrontFrame;
        }
        return map.wallOtherFrame;
      }
      if (symbol === "R") {
        const rug = map.rugFrames;
        const top = map.layout[row - 1]?.[col] !== "R";
        const bottom = map.layout[row + 1]?.[col] !== "R";
        const left = map.layout[row]?.[col - 1] !== "R";
        const right = map.layout[row]?.[col + 1] !== "R";
        if (top && left) return rug.topLeft;
        if (top && right) return rug.topRight;
        if (bottom && left) return rug.bottomLeft;
        if (bottom && right) return rug.bottomRight;
        if (top) return rug.top;
        if (bottom) return rug.bottom;
        if (left) return rug.left;
        if (right) return rug.right;
        return rug.center;
      }
      if (symbol === "p") {
        const frames = map.pathFrames || ["tile_concrete_a", "tile_concrete_b"];
        return frames[(row * 3 + col * 5) % frames.length];
      }
      if (symbol === "D") {
        const frames = map.floorFrames;
        return frames[(row + col) % frames.length];
      }
      const frames = map.floorFrames;
      return frames[(row * 7 + col * 3) % frames.length];
    }

    createObjectCollider(definition) {
      const left = definition.col * TILE_SIZE;
      const top = definition.row * TILE_SIZE;
      const width = definition.w * TILE_SIZE;
      const height = definition.h * TILE_SIZE;
      const fraction = definition.collision || [0.08, 0.2, 0.84, 0.72];
      return {
        x: left + fraction[0] * width,
        y: top + fraction[1] * height,
        width: fraction[2] * width,
        height: fraction[3] * height
      };
    }

    loadScenario(mapId, spawn = null) {
      const map = MAPS[mapId];
      const view = this.scenarioViews.get(mapId);
      if (!map || !view) {
        console.error(`Cenário "${mapId}" não encontrado.`);
        return;
      }

      this.currentMapId = mapId;
      for (const [id, scenarioView] of this.scenarioViews.entries()) {
        const active = id === mapId;
        scenarioView.background.setVisible(active);
        for (const item of scenarioView.objectInstances) item.sprite.setVisible(active);
      }

      const position = spawn || map.spawn;
      this.playerState.x = position.col * TILE_SIZE + (TILE_SIZE - PLAYER_SIZE) / 2;
      this.playerState.y = position.row * TILE_SIZE + (TILE_SIZE - PLAYER_SIZE) / 2;
      this.updatePlayerVisualPosition();

      // A câmera não usa limites rígidos: mapas menores que a tela precisam
      // poder receber scroll negativo para ficarem centralizados no viewport.
      this.cameras.main.setZoom(this.getMapZoom(map));
      this.updateCamera();
      this.setHudText(`${map.title}  ·  WASD/SETAS mover  ·  E interagir`);
      this.releaseAllDirections();
    }

    movePlayer(deltaSeconds) {
      let dx = 0;
      let dy = 0;
      const left = this.keys.a.isDown || this.keys.left.isDown || mobileDirections.a;
      const right = this.keys.d.isDown || this.keys.right.isDown || mobileDirections.d;
      const up = this.keys.w.isDown || this.keys.up.isDown || mobileDirections.w;
      const down = this.keys.s.isDown || this.keys.down.isDown || mobileDirections.s;

      if (left) dx -= 1;
      if (right) dx += 1;
      if (up) dy -= 1;
      if (down) dy += 1;
      if (dx === 0 && dy === 0) return;

      // Normalização para impedir que a diagonal seja mais rápida.
      const magnitude = Math.hypot(dx, dy) || 1;
      const stepX = (dx / magnitude) * PLAYER_SPEED * deltaSeconds;
      const stepY = (dy / magnitude) * PLAYER_SPEED * deltaSeconds;
      const state = this.playerState;

      if (!this.collidesAt(state.x + stepX, state.y)) state.x += stepX;
      if (!this.collidesAt(state.x, state.y + stepY)) state.y += stepY;
      this.updatePlayerVisualPosition();
    }

    collidesAt(x, y) {
      const map = MAPS[this.currentMapId];
      if (!map) return true;
      const right = x + this.playerState.width - 1;
      const bottom = y + this.playerState.height - 1;
      const firstCol = Math.floor(x / TILE_SIZE);
      const lastCol = Math.floor(right / TILE_SIZE);
      const firstRow = Math.floor(y / TILE_SIZE);
      const lastRow = Math.floor(bottom / TILE_SIZE);

      // Colisão com paredes e limites do cenário.
      for (let row = firstRow; row <= lastRow; row += 1) {
        for (let col = firstCol; col <= lastCol; col += 1) {
          if (row < 0 || row >= map.height || col < 0 || col >= map.width) return true;
          if (map.layout[row][col] === "#") return true;
        }
      }

      // Colisão AABB com móveis, árvores, arbustos e outros objetos sólidos.
      for (const item of this.objectInstances) {
        if (item.mapId !== this.currentMapId || !item.collider) continue;
        const box = item.collider;
        const overlaps = x < box.x + box.width &&
          x + this.playerState.width > box.x &&
          y < box.y + box.height &&
          y + this.playerState.height > box.y;
        if (overlaps) return true;
      }
      return false;
    }

    updatePlayerVisualPosition() {
      // O ponto de referência visual do personagem fica nos pés.
      this.player.setPosition(
        this.playerState.x + this.playerState.width / 2,
        this.playerState.y + this.playerState.height
      );
    }

    updatePlayerDepth() {
      this.player.setDepth(this.playerState.y + this.playerState.height);
    }

    getMapZoom(map) {
      const worldWidth = map.width * TILE_SIZE;
      const worldHeight = map.height * TILE_SIZE;
      const fitX = VIEW_WIDTH / worldWidth;
      const fitY = VIEW_HEIGHT / worldHeight;
      if (worldWidth <= VIEW_WIDTH && worldHeight <= VIEW_HEIGHT) {
        return Math.min(fitX, fitY) * RENDER_SCALE;
      }
      return RENDER_SCALE;
    }

    updateCamera() {
      const map = MAPS[this.currentMapId];
      if (!map) return;

      const camera = this.cameras.main;
      const worldWidth = map.width * TILE_SIZE;
      const worldHeight = map.height * TILE_SIZE;

      const visibleWidth = camera.width / camera.zoom;
      const visibleHeight = camera.height / camera.zoom;
      const centerX = this.playerState.x + this.playerState.width / 2;
      const centerY = this.playerState.y + this.playerState.height / 2;

      const mapFitsX = worldWidth <= visibleWidth;
      const mapFitsY = worldHeight <= visibleHeight;
      const centeredX = (worldWidth - visibleWidth) / 2;
      const centeredY = (worldHeight - visibleHeight) / 2;
      const minX = mapFitsX ? centeredX : 0;
      const minY = mapFitsY ? centeredY : 0;
      const boundsWidth = mapFitsX ? visibleWidth : worldWidth;
      const boundsHeight = mapFitsY ? visibleHeight : worldHeight;

      camera.setBounds(minX, minY, boundsWidth, boundsHeight);

      const x = mapFitsX
        ? centeredX
        : Phaser.Math.Clamp(centerX - visibleWidth / 2, 0, worldWidth - visibleWidth);
      const y = mapFitsY
        ? centeredY
        : Phaser.Math.Clamp(centerY - visibleHeight / 2, 0, worldHeight - visibleHeight);

      camera.setScroll(x, y);
    }

    getPlayerTile() {
      const centerX = this.playerState.x + this.playerState.width / 2;
      const centerY = this.playerState.y + this.playerState.height / 2;
      const col = Math.floor(centerX / TILE_SIZE);
      const row = Math.floor(centerY / TILE_SIZE);
      return { col, row };
    }

    getNearbyTarget() {
      const map = MAPS[this.currentMapId];
      const px = this.playerState.x + this.playerState.width / 2;
      const py = this.playerState.y + this.playerState.height / 2;
      let best = null;
      let bestDistance = Infinity;

      for (const item of this.objectInstances) {
        if (item.mapId !== this.currentMapId || !item.definition.action) continue;
        const dx = px - item.x;
        const dy = py - item.y;
        const distance = Math.hypot(dx, dy);
        const radius = item.definition.interactionRadius || Math.max(item.width, item.height) / 2 + TILE_SIZE;
        if (distance <= radius && distance < bestDistance) {
          best = { type: "object", action: item.definition.action, label: item.definition.label, distance };
          bestDistance = distance;
        }
      }

      for (const portal of map.portals || []) {
        const portalX = portal.col * TILE_SIZE + TILE_SIZE / 2;
        const portalY = portal.row * TILE_SIZE + TILE_SIZE / 2;
        const distance = Math.hypot(px - portalX, py - portalY);
        const radius = TILE_SIZE * 1.3;
        if (distance <= radius && distance < bestDistance) {
          best = { type: "portal", portal, label: portal.label, distance };
          bestDistance = distance;
        }
      }
      return best;
    }

    updateInteractionPrompt() {
      const map = MAPS[this.currentMapId];
      const target = this.getNearbyTarget();
      let text = `${map.title}  ·  WASD/SETAS mover  ·  E interagir`;
      if (target) text = `E  ·  ${target.label}`;
      this.setHudText(text);
      if (this.notice.visible && this.time.now > this.noticeUntil) this.notice.setVisible(false);
    }

    setHudText(text) {
      if (text === this.lastHudText || !this.hud) return;
      this.hud.setText(text);
      this.lastHudText = text;
    }

    showNotice(message, duration = 2600) {
      this.noticeMessage = message;
      this.noticeUntil = this.time.now + duration;
      this.notice.setText(message).setVisible(true);
    }

    interact() {
      if (this.minigameOpen) return;
      const target = this.getNearbyTarget();
      if (!target) {
        this.showNotice("Chegue mais perto de um objeto ou de uma porta.");
        return;
      }

      if (target.type === "portal") {
        if (target.portal.locked && !(this.progress.sandwiches && this.progress.puzzle && this.progress.look && this.progress.phone)) {
          this.showNotice("A saída está trancada. Prepare os sanduíches, conclua o quebra-cabeça e o look, depois ligue para suas amigas.");
          return;
        }
        if (target.portal.to === "zoo") {
          this.transitionToZoo(target.portal);
          return;
        }
        this.loadScenario(target.portal.to, target.portal.spawn);
        return;
      }

      switch (target.action) {
        case "sandwiches":
          if (this.progress.sandwiches) { this.showNotice("Os sanduíches já estão prontos!"); break; }
          this.progress.sandwiches = true;
          this.showNotice("Sofia: Prontinho! Sanduíches preparados. Agora posso continuar me arrumando.", 4200);
          break;
        case "puzzle":
          //if (!this.progress.sandwiches) { this.showNotice("Primeiro, vá à cozinha e prepare os sanduíches."); break; }
          if (this.progress.puzzle) { this.showNotice("O quebra-cabeça já está montado."); break; }
          this.openMinigame(target.action);
          break;
        case "look":
          if (!this.progress.puzzle) { this.showNotice("Antes de escolher o look, termine o quebra-cabeça na sala de estar."); break; }
          if (this.progress.look) { this.showNotice("Você já escolheu seu look!"); break; }
          this.openMinigame(target.action);
          break;
        case "phone":
          if (!this.progress.puzzle || !this.progress.look) { this.showNotice("Sofia: Vou ligar para as meninas depois de terminar o quebra-cabeça e escolher meu look."); break; }
          if (this.progress.phone) { this.showNotice("Sofia: Até já, meninas! Estou indo encontrar vocês."); break; }
          this.progress.phone = true;
          this.showNotice("Sofia: Oi, meninas! Já estou pronta e com os sanduíches.\nAmiga: Estamos esperando você no zoológico!\nSofia: Estou a caminho!", 6500);
          break;
        case "mixtures":
          if (!this.progress.zoo) { this.showNotice("Vamos aproveitar o piquenique!"); break; }
          this.openMinigame(target.action);
          break;
        case "animalsEntrance":
          this.showNotice("A área dos recintos será construída em um cenário próprio.", 3200);
          break;
        default:
          this.showNotice("Esta interação ainda está sendo preparada.");
      }
    }

    openMinigame(minigameId) {
      const data = MINIGAMES[minigameId];
      if (!data) {
        this.showNotice("Este minigame ainda não foi configurado.");
        return;
      }
      this.minigameOpen = true;
      this.releaseAllDirections();
      document.body.classList.add("em-minigame"); // esconde controles e textos da interface
      const custom = (window.MINIGAME_SCENES || []).find((m) => m.id === minigameId);
      this.scene.launch(custom ? custom.key : "MiniGameScene", { minigameId, ...data });
      this.scene.pause();
    }

    onMinigameClosed(minigameId, completed = true) {
      this.minigameOpen = false;
      document.body.classList.remove("em-minigame");
      // Cenas customizadas enviam completed=false ao sair com ESC.
      if (!completed) return;
      if (minigameId === "puzzle") {
        this.progress.puzzle = true;
        this.showNotice("Quebra-cabeça concluído! Agora vá ao quarto e escolha seu look.", 4200);
      } else if (minigameId === "look") {
        this.progress.look = true;
        this.showNotice("Look escolhido! Agora use o telefone no quarto para falar com suas amigas.", 4200);
      } else if (minigameId === "mixtures") {
        this.progress.mixtures = true;
        this.playEnding();
      }
    }

    transitionToZoo(portal) {
      if (this.transitioning) return;
      this.transitioning = true;
      this.progress.zoo = true;
      this.showNotice("Sofia está a caminho do zoológico...", 2000);
      this.cameras.main.fadeOut(450, 45, 58, 159);
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        this.loadScenario(portal.to, portal.spawn);
        this.cameras.main.fadeIn(600, 45, 58, 159);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, () => {
          this.transitioning = false;
          this.showNotice("Zoológico! Sofia encontrou suas amigas. Vamos começar o piquenique!", 4200);
        });
      });
    }

    playEnding() {
      this.dialogueOpen = true;
      const overlay = document.querySelector("#endingOverlay");
      if (!overlay) { this.dialogueOpen = false; return; }
      overlay.hidden = false;
      overlay.innerHTML = '<div class="ending-card"><div class="ending-stars">✦ ✧ ✦</div><h2>Um dia cheio de descobertas!</h2><p>Sofia e suas amigas terminam o piquenique felizes, aprendendo juntas.</p><div class="ending-credits">O CURIOSO MUNDO DE SOFIA<br><small>Um jogo sobre amizade e aprendizado</small><br><br>Fim</div><button id="fecharCreditos" type="button">FECHAR</button></div>';
      const card = overlay.querySelector(".ending-card");
      card.classList.add("ending-animate");
      overlay.querySelector("#fecharCreditos").addEventListener("click", () => {
        overlay.hidden = true;
        this.dialogueOpen = false;
        this.showNotice("Obrigado por jogar!", 5000);
      }, { once: true });
    }

    releaseAllDirections() {
      for (const key of Object.keys(mobileDirections)) mobileDirections[key] = false;
    }
  }

  // ============================================================
  // 5. CENA TEMPORÁRIA DOS MINIGAMES
  // ============================================================
  // Os quatro pontos de interação funcionam, mas as mecânicas finais ainda
  // precisam ser implementadas e integradas
  class MiniGameScene extends Phaser.Scene {
    constructor() {
      super("MiniGameScene");
    }

    init(data) {
      this.dataForMinigame = data || {};
    }

    create() {
      this.cameras.main.setZoom(RENDER_SCALE).centerOn(VIEW_WIDTH / 2, VIEW_HEIGHT / 2);
      const { title = "Minigame", description = "" } = this.dataForMinigame;
      this.add.rectangle(VIEW_WIDTH / 2, VIEW_HEIGHT / 2, VIEW_WIDTH - 28, VIEW_HEIGHT - 28, COLORS.blue)
        .setStrokeStyle(4, COLORS.white);
      this.add.rectangle(VIEW_WIDTH / 2, VIEW_HEIGHT / 2, VIEW_WIDTH - 44, VIEW_HEIGHT - 44, COLORS.purple, 0.65)
        .setStrokeStyle(2, COLORS.pink);

      this.add.text(VIEW_WIDTH / 2, 70, title, {
        fontFamily: '"Alagard", monospace',
        fontSize: "23px",
        color: "#FFFFFF",
        align: "center",
        wordWrap: { width: VIEW_WIDTH - 70 }
      }).setOrigin(0.5);

      this.add.text(VIEW_WIDTH / 2, 165, `${description}\n\nO espaço de integração está pronto para receber a mecânica.`, {
        fontFamily: '"Type Writer", monospace',
        fontSize: "11px",
        color: "#FFFFFF",
        align: "center",
        lineSpacing: 7,
        wordWrap: { width: VIEW_WIDTH - 90 }
      }).setOrigin(0.5);

      const back = this.add.text(VIEW_WIDTH / 2, VIEW_HEIGHT - 58, "[ ESC / ENTER ] VOLTAR AO CENÁRIO", {
        fontFamily: '"Type Writer", monospace',
        fontSize: "10px",
        color: "#FFFFFF",
        backgroundColor: "#8E44AD",
        padding: { x: 10, y: 9 }
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      back.on("pointerdown", () => this.close());

      this.keys = this.input.keyboard.addKeys({
        esc: Phaser.Input.Keyboard.KeyCodes.ESC,
        enter: Phaser.Input.Keyboard.KeyCodes.ENTER
      });
    }

    update() {
      if (Phaser.Input.Keyboard.JustDown(this.keys.esc) ||
        Phaser.Input.Keyboard.JustDown(this.keys.enter)) {
        this.close();
      }
    }

    close() {
      this.game.events.emit("minigame:closed", this.dataForMinigame.minigameId);
      this.scene.stop();
      this.scene.resume("MainScene");
    }
  }

  // ============================================================
  // 6. INTERFACE HTML: MOBILE, TELA INICIAL E ORIENTAÇÃO
  // ============================================================
  let mode = navigator.maxTouchPoints > 0 ? "mobile" : "pc";
  let gameStarted = false;
  let orientationLockRequested = false;

  const getElement = (selector) => document.querySelector(selector);

  function releaseMobileDirections() {
    for (const key of Object.keys(mobileDirections)) mobileDirections[key] = false;
  }

  function setMobileMode(enabled) {
    mode = enabled ? "mobile" : "pc";
    getElement("#controlesMobile").style.display = enabled ? "block" : "none";
    getElement("#trocarModo").textContent = enabled ? "Modo: Mobile" : "Modo: PC";
    getElement("#container-jogo").classList.toggle("modo-mobile", enabled);
    if (!enabled) releaseMobileDirections();
    updateOrientationNotice();
  }

  function requestLandscape() {
    if (mode !== "mobile" || orientationLockRequested) return;
    const orientation = screen.orientation;
    if (!orientation || typeof orientation.lock !== "function") return;

    try {
      const result = orientation.lock("landscape");
      if (result && typeof result.catch === "function") {
        result.catch(() => { /* Alguns navegadores não permitem bloquear a orientação. */ });
      }
      orientationLockRequested = true;
    } catch (_error) {
      // O aviso visual continua disponível mesmo sem bloqueio da orientação.
    }
  }

  // Precisa ser chamada dentro de um gesto do usuário (clique/toque).
  function requestFullscreen() {
    const root = document.documentElement;
    const request = root.requestFullscreen || root.webkitRequestFullscreen || root.msRequestFullscreen;
    if (!request || document.fullscreenElement || document.webkitFullscreenElement) return;
    try {
      const result = request.call(root);
      if (result && typeof result.catch === "function") {
        result.catch(() => { /* O navegador pode negar; o jogo segue normalmente. */ });
      }
    } catch (_error) {
      // Alguns navegadores (ex.: Safari no iPhone) não suportam tela cheia.
    }
  }

  // Altura realmente visível (descontando barras do navegador no celular). As unidades
  // vh/dvh nem sempre acompanham isso, então o CSS usa --app-h (ver style.css).
  function updateAppHeight() {
    const height = (window.visualViewport && window.visualViewport.height) || window.innerHeight;
    document.documentElement.style.setProperty("--app-h", `${Math.round(height)}px`);
  }

  function updateOrientationNotice() {
    const portrait = window.innerHeight > window.innerWidth;
    const show = mode === "mobile" && portrait;
    getElement("#aviso-orientacao").style.display = show ? "flex" : "none";
    getElement("#telaInicial").style.visibility = show ? "hidden" : "";
    getElement("#container-jogo").style.visibility = show ? "hidden" : "";
  }

  function createGame() {
    if (window.ZooGame || !window.Phaser) return;

    const config = {
      type: Phaser.AUTO,
      parent: "game-host",
      width: VIEW_WIDTH * RENDER_SCALE,
      height: VIEW_HEIGHT * RENDER_SCALE,
      backgroundColor: "#2D3A9F",
      pixelArt: true,
      antialias: false,
      roundPixels: true,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: VIEW_WIDTH * RENDER_SCALE,
        height: VIEW_HEIGHT * RENDER_SCALE
      },
      render: { pixelArt: true, antialias: false },
      scene: [MainScene, MiniGameScene, ...(window.MINIGAME_SCENES || []).map((m) => m.scene)]
    };

    window.ZooGame = new Phaser.Game(config);
    window.ZooGame.events.once("destroy", () => {
      const loading = document.querySelector("#loadingOverlay");
      if (loading) loading.hidden = true;
    });
  }

  getElement("#botaoIniciar").addEventListener("click", () => {
    if (gameStarted) return;

    // O navegador bloqueia o carregamento dos PNGs via XHR quando a página
    // é aberta diretamente pelo protocolo file://. Oriente antes de iniciar.
    if (window.location.protocol === "file:") {
      window.alert(
        "Abra este jogo por um servidor local para carregar os sprites.\n\n" +
        "No Windows, execute start-server.bat nesta pasta.\n" +
        "Ou rode: python -m http.server 8000\n" +
        "Depois acesse http://localhost:8000."
      );
      return;
    }

    gameStarted = true;
    requestFullscreen();
    const loading = getElement("#loadingOverlay");
    if (loading) loading.hidden = false;
    getElement("#telaInicial").style.display = "none";
    getElement("#container-jogo").classList.remove("aguardando-inicio");
    createGame();
    requestLandscape();
    updateOrientationNotice();
  });

  getElement("#trocarModo").addEventListener("click", () => {
    setMobileMode(mode !== "mobile");
    requestLandscape();
  });

  document.querySelectorAll("#controlesMobile button[data-direcao]").forEach((button) => {
    const direction = button.dataset.direcao;
    const press = (event) => {
      event.preventDefault();
      mobileDirections[direction] = true;
      if (button.setPointerCapture && event.pointerId !== undefined) {
        try { button.setPointerCapture(event.pointerId); } catch (_error) { /* Ignorado intencionalmente. */ }
      }
    };
    const release = (event) => {
      if (event) event.preventDefault();
      mobileDirections[direction] = false;
    };
    button.addEventListener("pointerdown", press);
    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);
    button.addEventListener("lostpointercapture", release);
    button.addEventListener("contextmenu", (event) => event.preventDefault());
  });

  getElement("#botaoInteragir").addEventListener("pointerdown", (event) => {
    event.preventDefault();
    window.ZooMainScene?.interact();
  });
  getElement("#botaoInteragir").addEventListener("contextmenu", (event) => event.preventDefault());

  window.addEventListener("blur", releaseMobileDirections);
  updateAppHeight();
  window.addEventListener("resize", updateAppHeight);
  window.addEventListener("orientationchange", () => setTimeout(updateAppHeight, 250));
  document.addEventListener("fullscreenchange", updateAppHeight);
  if (window.visualViewport) window.visualViewport.addEventListener("resize", updateAppHeight);
  window.addEventListener("resize", updateOrientationNotice);
  window.addEventListener("orientationchange", () => {
    updateOrientationNotice();
    requestLandscape();
  });
  window.addEventListener("load", () => {
    setMobileMode(mode === "mobile");
    updateOrientationNotice();
  });
})();
