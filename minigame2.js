function abrirMinigame2() {

    minigameAberto = true;

    const resultado = confirm(
        "MINIGAME 2\n\n" +
        "Você encontrou o segundo desafio!\n\n" +
        "OK = venceu\n" +
        "Cancelar = perdeu"
    );

    minigameAberto = false;

    if (resultado) {
        console.log("Minigame 2 vencido!");
    } else {
        console.log("Minigame 2 perdido!");
    }
}