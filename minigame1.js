function abrirMinigame1() {

    minigameAberto = true;

    const resultado = confirm(
        "MINIGAME 1\n\n" +
        "Você encontrou o primeiro desafio!\n\n" +
        "OK = venceu\n" +
        "Cancelar = perdeu"
    );

    minigameAberto = false;

    if (resultado) {
        console.log("Minigame 1 vencido!");
    } else {
        console.log("Minigame 1 perdido!");
    }
}