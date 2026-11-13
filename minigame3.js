class C1 extends Phaser.Scene {

    constructor() {
        super({ key: 'Menu' });
    }

    preload() {
        this.load.image('botao','assets/botao.png');
    }

    create() {

        const largura = this.scale.width;
        const altura = this.scale.height;

        /*
        setOrigin(0,0.5) - esquerda
        setOrigin(0.5) - centro
        setOrigin(1,0.5) - direita
        */

        this.add.text(largura/2,200, 'Classificação das Misturas', {
            fontFamily: 'Alagard',
            fontSize: '80px',
            color: '#FF8C00'
        }).setOrigin(0.5);

        this.botao = this.add.image(largura/2,700,'botao',);

        this.botao.setInteractive({ useHandCursor: true });

        this.botao.on('pointerover', () => {

            this.tweens.add({
                targets: this.botao,
                scale: escala * 1.15,
                duration: 200,
                ease: 'Back.Out'
            });

            this.tweens.add({
                targets: this.textoBotao,
                scale: 1.15,
                duration: 200,
                ease: 'Back.Out'
            });

        });

        this.botao.on('pointerout', () => {

            this.tweens.add({
                targets: this.botao,
                scale: escala,
                duration: 200,
                ease: 'Back.Out'
            });

            this.tweens.add({
                targets: this.textoBotao,
                scale: 1,
                duration: 200,
                ease: 'Back.Out'
            });

        });


        this.botao.on('pointerdown', () => {
            this.scene.start('explicacao');
        });

        const escala = Math.min(
            300 / this.botao.width,
            300 / this.botao.height
        );

        this.botao.setScale(escala);

        this.textoBotao = this.add.text(largura / 2,700,'Começar',{
            fontFamily: 'Pixelify Sans',
            fontSize: '50px',
            color: '#FFFFFF'
        }).setOrigin(0.5);
    }
}


class C2 extends Phaser.Scene {

    constructor() {
        super({ key: 'explicacao' });
    }

    preload() {
        
        this.load.image('botao','assets/botao.png');

    }

    create() {

        const largura = this.scale.width;
        const altura = this.scale.height;

        this.add.text(largura/2,150, 'Como Jogar', {
            fontFamily: 'Alagard',
            fontSize: '80px',
            color: '#FF8C00'
        }).setOrigin(0.5);

        this.add.rectangle(330, 500, 470, 430, 0x24316F, 1)
        .setStrokeStyle(3, 0x8E44AD);

        this.add.text(330, 360, 'Objetivo', {
            fontFamily: 'Alagard',
            fontSize: '45px',
            color: '#FF8C00'
        }).setOrigin(0.5);

        this.add.text(330,490, 'Observe os alimentos apresentados \n' + 'e identifique o tipo de mistura', {
            fontFamily: 'Pixelify Sans',
            fontSize: '30px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        this.add.rectangle(870, 500, 470, 430, 0x24316F, 1)
        .setStrokeStyle(3, 0x8E44AD);

        this.add.text(870, 360, 'Tipos de mistura', {
            fontFamily: 'Alagard',
            fontSize: '45px',
            color: '#FF8C00'
         }).setOrigin(0.5);

        this.add.rectangle(870, 470, 400, 120, 0x34458B, 1);

        this.add.text(870, 445, 'Homogênea', {
            fontFamily: 'Pixelify Sans',
            fontSize: '35px',
            color: '#FF8C00'
        }).setOrigin(0.5);

        this.add.text(870, 495, 'Apresenta uma única fase.', {
            fontFamily: 'Pixelify Sans',
            fontSize: '25px',
            color: '#FFFFFF'
        }).setOrigin(0.5);

        this.add.rectangle(870, 630, 400, 120, 0x34458B, 1);

        this.add.text(870, 605, 'Heterogênea', {
            fontFamily: 'Pixelify Sans',
            fontSize: '35px',
            color: '#FF8C00'
        }).setOrigin(0.5);

        this.add.text(870, 655, 'Apresenta duas ou mais fases.', {
            fontFamily: 'Pixelify Sans',
            fontSize: '25px',
            color: '#FFFFFF'
        }).setOrigin(0.5);

        this.botao = this.add.image(largura/2,800,'botao',);

        this.botao.setInteractive({ useHandCursor: true });

        this.botao.on('pointerover', () => {

            this.tweens.add({
                targets: this.botao,
                scale: escala * 1.15,
                duration: 200,
                ease: 'Back.Out'
            });

            this.tweens.add({
                targets: this.textoBotao,
                scale: 1.15,
                duration: 200,
                ease: 'Back.Out'
            });

        });

        this.botao.on('pointerout', () => {

            this.tweens.add({
                targets: this.botao,
                scale: escala,
                duration: 200,
                ease: 'Back.Out'
            });

            this.tweens.add({
                targets: this.textoBotao,
                scale: 1,
                duration: 200,
                ease: 'Back.Out'
            });

        });

        this.botao.on('pointerdown', () => {
            this.scene.start('f1');
        });

        const escala = Math.min(
            300 / this.botao.width,
            300 / this.botao.height
        );

        this.botao.setScale(escala);

        this.textoBotao = this.add.text(largura / 2,800,'Começar',{
            fontFamily: 'Pixelify Sans',
            fontSize: '50px',
            color: '#FFFFFF'
        }).setOrigin(0.5);
    }

}

class C3 extends Phaser.Scene {

    constructor() {
        super({ key: 'f1' });
    }

    preload() {
        this.load.image('botao', 'assets/botao.png');
        this.load.image('cafe', 'assets/cafe.png');
        this.load.image('salada', 'assets/salada.png');
        this.load.image('suco', 'assets/suco.png');
    }

    create() {

        
        const largura = this.scale.width;
        const altura = this.scale.height;

        this.perguntas = [

            {
                nome:'Café',
                imagem: 'cafe',
                resposta: 'Homogênea',
                explicacao: 'Classificação correta: Homogênea.\n\n' +
                'O café coado é uma mistura homogênea  \n' + 'porque as substâncias extraídas do pó ficam distribuídas uniformementes.',
                explicacaoX: 600,
                explicacaoY: 650,
            },
            
            {
                nome:'Salada',
                imagem: 'salada',
                resposta: 'Heterogênea',
                explicacao: 'Classificação correta: Heterogênea.\n\n' +
                'A salada de frutas é heterogênea \n' + 'porque conseguimos identificar diferentes componentes.',
                explicacaoX: 450,
                explicacaoY: 650,
            },

            {
                nome:'suco de laranja',
                imagem: 'suco',
                resposta: 'Heterogênea',
                explicacao: 'Classificação correta: Heterogênea.\n\n' +
                'O suco de laranja é heterogêneo \n' + 'porque conseguimos identificar diferentes componentes, como o gelo.',
                explicacaoX: 550 ,
                explicacaoY: 650,
            }
        ]

        this.i = 0;
        this.acertos = 0;
        this.respondeu = false;

        this.add.text(largura/2,100, 'Classifique a comida!',{
                fontSize: '60px',
                color: '#FF8C00',
                fontFamily: 'Alagard'
            }).setOrigin(0.5);

        this.add.rectangle(largura/2, 325, 310, 310, 0x24316F, 1)
        .setStrokeStyle(3, 0xFF8C00);

        // this.add.rectangle(largura/2, altura/2, 1, 1000, 0x24316F, 1)
        // .setStrokeStyle(3, 0xFF8C00);

        this.imagem = this.add.image(
            largura/2,
            325,
            'cafe',
        );

        const escalaf = Math.min(
            300 / this.imagem.width,
            300 / this.imagem.height
        );

        this.imagem.setScale(escalaf);

        this.nome = this.add.text(largura/2,525, 'Café',{
                fontSize: '65px',
                color: '#ffffff',
                fontFamily: 'Alagard'
            }).setOrigin(0.5);

        //botao1

        this.rec = this.add.rectangle(600, 650, 1150, 200, 0x24316F, 1)
        .setStrokeStyle(3, 0xFF8C00);

        this.rec.setVisible(false);

        this.botao1 = this.add.image(400,700,'botao',);

        this.botao1.setInteractive({ useHandCursor: true });

        this.botao1.on('pointerover', () => {

            this.tweens.add({
                targets: this.botao1,
                scale: escala1 * 1.15,
                duration: 200,
                ease: 'Back.Out'
            });

            this.tweens.add({
                targets: this.textoBotao1,
                scale: 1.15,
                duration: 200,
                ease: 'Back.Out'
            });

        });

        this.botao1.on('pointerout', () => {

            this.tweens.add({
                targets: this.botao1,
                scale: escala1,
                duration: 200,
                ease: 'Back.Out'
            });

            this.tweens.add({
                targets: this.textoBotao1,
                scale: 1,
                duration: 200,
                ease: 'Back.Out'
            });

        });

        this.botao1.on('pointerdown', () => {
            this.verificarResposta('Homogênea');
        });

        const escala1 = Math.min(
            300 / this.botao1.width,
            300 / this.botao1.height
        );

        this.botao1.setScale(escala1);

        this.textoBotao1 = this.add.text(400,700,'Homogênea',{
            fontFamily: 'Pixelify Sans',
            fontSize: '50px',
            color: '#FFFFFF'
        }).setOrigin(0.5);
  
        var x1 = this.botao1.x + this.botao1.width;

        this.botao2 = this.add.image(x1 + 12,700,'botao',);

        this.botao2.setInteractive({ useHandCursor: true });

        this.botao2.on('pointerover', () => {

            this.tweens.add({
                targets: this.botao2,
                scale: escala2 * 1.15,
                duration: 200,
                ease: 'Back.Out'
            });

            this.tweens.add({
                targets: this.textoBotao2,
                scale: 1.15,
                duration: 200,
                ease: 'Back.Out'
            });

        });

        this.botao2.on('pointerout', () => {

            this.tweens.add({
                targets: this.botao2,
                scale: escala2,
                duration: 200,
                ease: 'Back.Out'
            });

            this.tweens.add({
                targets: this.textoBotao2,
                scale: 1,
                duration: 200,
                ease: 'Back.Out'
            });

        });

        this.botao2.on('pointerdown', () => {
            this.verificarResposta('Heterogênea');
        });

        const escala2 = Math.min(
            300 / this.botao1.width,
            300 / this.botao1.height
        );

        this.botao2.setScale(escala2);

        this.textoBotao2 = this.add.text(x1 + 12,700,'Heterogênea',{
            fontFamily: 'Pixelify Sans',
            fontSize: '50px',
            color: '#FFFFFF'
        }).setOrigin(0.5);


        this.botaop = this.add.image(1050,850,'botao',);

        this.botaop.setInteractive({ useHandCursor: true });

        this.botaop.on('pointerover', () => {

            this.tweens.add({
                targets: this.botaop,
                scale: escalap * 1.15,
                duration: 200,
                ease: 'Back.Out'
            });

            this.tweens.add({
                targets: this.textoBotaop,
                scale: 1.15,
                duration: 200,
                ease: 'Back.Out'
            });

        });

        this.botaop.on('pointerout', () => {

            this.tweens.add({
                targets: this.botaop,
                scale: escalap,
                duration: 200,
                ease: 'Back.Out'
            });

            this.tweens.add({
                targets: this.textoBotaop,
                scale: 1,
                duration: 200,
                ease: 'Back.Out'
            });

        });

        this.botaop.on('pointerdown', () => {
            this.proximaPergunta();
        });

        const escalap = Math.min(
            250 / this.botao1.width,
            250 / this.botao1.height
        );

        this.botaop.setScale(escalap);

        this.textoBotaop = this.add.text(1050,850,'',{
            fontFamily: 'Pixelify Sans',
            fontSize: '50px',
            color: '#FFFFFF'
        }).setOrigin(0.5);

        this.botaop.setVisible(false);
        this.textoBotaop.setVisible(false);

        this.resultado = this.add.text(largura/2,525,'',{
                fontSize: '50px',
                color: '#ffffff',
                fontFamily: 'Alagard'
            }
        ).setOrigin(0.5);

        this.resultado.setVisible(false);

        this.explicacao = this.add.text(600, 650,'',{
                fontSize: '35px',
                color: '#ffffff',
                fontFamily: 'Alagard'
            }
        ).setOrigin(0.5);

        this.explicacao.setVisible(false);
  
    }

    verificarResposta(resposta){

        if (this.respondeu) {
            return;
        }

        this.respondeu = true;

        const pergunta = this.perguntas[this.i];

        if(resposta === pergunta.resposta){
            
            this.acertos++;

            this.resultado.setText('Você acertou!');
            this.resultado.setColor('#00ff00');

        } else{

            this.resultado.setText('Você errou!');
            this.resultado.setColor('#ff0000');

        }

        this.textoBotao1.setVisible(false);
        this.botao1.setVisible(false);
        this.textoBotao2.setVisible(false);
        this.botao2.setVisible(false);
        this.nome.setVisible(false);

        this.explicacao.setText(pergunta.explicacao);
            
        this.explicacao.setPosition(
            pergunta.explicacaoX,
            pergunta.explicacaoY
        );    

        this.rec.setVisible(true);
        this.resultado.setVisible(true);
        
        this.explicacao.setAlpha(0);
        this.explicacao.setVisible(true);

        this.tweens.add({
            targets: this.explicacao,
            alpha: 1,
            duration: 600,
            ease: 'Sine.Out'
        });

        if (this.i === this.perguntas.length - 1) {
        this.textoBotaop.setText('Concluir');
        } else {
        this.textoBotaop.setText('Avançar');
        }

        this.botaop.setVisible(true);
        this.textoBotaop.setVisible(true);
    }

    proximaPergunta(){

        if(this.i <  this.perguntas.length - 1){
            this.i ++;

            this.mostrarPergunta();

        } else {

            this.scene.start('final', {
                acertos: this.acertos,
                total: this.perguntas.length
            });
        
        }
    }

    mostrarPergunta() {

        const pergunta = this.perguntas[this.i];

        this.imagem.setTexture(pergunta.imagem);

        const escalaf = Math.min(
            300 / this.imagem.width,
            300 / this.imagem.height
        );

        this.imagem.setScale(escalaf);

        this.nome.setText(pergunta.nome);

        this.resposta = pergunta.resposta;

        this.respondeu = false;

        this.textoBotao1.setVisible(true);
        this.botao1.setVisible(true);
        this.textoBotao2.setVisible(true);
        this.botao2.setVisible(true);
        this.nome.setVisible(true);

        this.rec.setVisible(false);
        this.resultado.setVisible(false);
        this.explicacao.setVisible(false);

        this.botaop.setVisible(false);
        this.textoBotaop.setVisible(false);

        this.mostrarPergunta();
    }
}

class C4 extends Phaser.Scene{
    
    constructor() {
        super({ key: 'final' });
    }

    init(data) {
        this.acertos = data.acertos;
        this.total = data.total;
    }


    preload() {

        this.load.image('botao','assets/botao.png');
        
    }

    create() {
        const largura = this.scale.width;
        const altura = this.scale.height;

        const porcentagem = Math.round(
            (this.acertos / this.total) * 100
        );

        this.add.text(largura/2, 120, 'Resultado Final!', {
            fontSize: '60px',
            color: '#FF8C00',
            fontFamily: 'Alagard'
        }).setOrigin(0.5);

        this.add.text(largura/2, 240,
            'Você acertou ' + this.acertos +
            ' de ' + this.total + ' perguntas!', {
            fontSize: '40px',
            color: '#FFFFFF',
            fontFamily: 'Alagard'
        }).setOrigin(0.5);

        this.add.text(largura/2, 330,
            'Aproveitamento: ' + porcentagem + '%', {
            fontSize: '40px',
            color: '#00FF00',
            fontFamily: 'Alagard'
        }).setOrigin(0.5);

        this.botao = this.add.image(largura/2,700,'botao',);

        this.botao.setInteractive({ useHandCursor: true });

        this.botao.on('pointerover', () => {

            this.tweens.add({
                targets: this.botao,
                scale: escala * 1.15,
                duration: 200,
                ease: 'Back.Out'
            });

            this.tweens.add({
                targets: this.textoBotao,
                scale: 1.15,
                duration: 200,
                ease: 'Back.Out'
            });

        });

        this.botao.on('pointerout', () => {

            this.tweens.add({
                targets: this.botao,
                scale: escala,
                duration: 200,
                ease: 'Back.Out'
            });

            this.tweens.add({
                targets: this.textoBotao,
                scale: 1,
                duration: 200,
                ease: 'Back.Out'
            });

        });


        this.botao.on('pointerdown', () => {
            this.scene.start('f1');
        });

        const escala = Math.min(
            400 / this.botao.width,
            150 / this.botao.height
        );

        this.botao.setScale(escala);

        this.textoBotao = this.add.text(largura / 2,700,'Jogar novamente',{
            fontFamily: 'Pixelify Sans',
            fontSize: '50px',
            color: '#FFFFFF'
        }).setOrigin(0.5);

        
        this.botao4 = this.add.text(50, 50,
            'X', {
            fontSize: '35px',
            color: '#FFFFFF',
            fontFamily: 'TypeWriter',
            backgroundColor: '#8E44AD',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        this.botao4.setInteractive({ useHandCursor: true });

        

        this.botao4.on('pointerdown', () => {
            this.scene.start('Menu');
        });
    }
}

var config = {

    type: Phaser.AUTO,

    width: 1200,
    height: 900,

    parent: 'game-container',

    backgroundColor: '#2D3A8F',

    scale: {
        mode: Phaser.Scale.NONE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    scene: [C1, C2, C3, C4]

};

var game = new Phaser.Game(config); 