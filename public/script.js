function generateCode() {
    const code = Math.random().toString(36).substr(2, 8);
    document.getElementById('generatedCode').value = code;
}

function copyCode() {
    const code = document.getElementById('generatedCode').value;
    navigator.clipboard.writeText(code);
    alert("Code copié !");
}

function createRoom() {
    const code = document.getElementById('generatedCode').value;
    if (!code) {
        alert("Génère d'abord un code !");
        return;
    }
    window.location.href = "pseudo.html?room=" + code;
}

function joinRoom() {
    const code = document.getElementById('joinCode').value.trim();
    if (!code) {
        alert("Entre un code pour rejoindre une session.");
        return;
    }
    window.location.href = "pseudo.html?room=" + code;
}

window.onload = () => {
    generateCode();
};
