// ========================================
// QUIZ DE CONHECIMENTOS GERAIS
// 12 perguntas + 5 vidas
// ========================================

const questions = [

    {
        question: "Qual é o maior planeta do Sistema Solar?",
        options: [
            "Marte",
            "Saturno",
            "Júpiter",
            "Netuno"
        ],
        answer: 2
    },

    {
        question: "Quem pintou a obra 'Mona Lisa'?",
        options: [
            "Vincent van Gogh",
            "Leonardo da Vinci",
            "Pablo Picasso",
            "Michelangelo"
        ],
        answer: 1
    },

    {
        question: "Qual é o metal cujo símbolo químico é Au?",
        options: [
            "Prata",
            "Cobre",
            "Ouro",
            "Alumínio"
        ],
        answer: 2
    },

    {
        question: "Em que país surgiram os Jogos Olímpicos da Antiguidade?",
        options: [
            "Itália",
            "Grécia",
            "Egito",
            "França"
        ],
        answer: 1
    },

    {
        question: "Qual é o oceano que banha a costa leste do Brasil?",
        options: [
            "Oceano Pacífico",
            "Oceano Índico",
            "Oceano Ártico",
            "Oceano Atlântico"
        ],
        answer: 3
    },

    {
        question: "Qual é o animal terrestre mais rápido do mundo?",
        options: [
            "Guepardo",
            "Leão",
            "Antílope",
            "Elefante"
        ],
        answer: 0
    },

    {
        question: "Quantos ossos tem, aproximadamente, o corpo humano adulto?",
        options: [
            "206",
            "300",
            "180",
            "215"
        ],
        answer: 0
    },

    {
        question: "Qual é o país mais populoso do mundo?",
        options: [
            "Estados Unidos",
            "Índia",
            "Brasil",
            "Rússia"
        ],
        answer: 1
    },

    {
        question: "Qual gás é essencial para a respiração humana?",
        options: [
            "Gás carbônico",
            "Nitrogênio",
            "Oxigênio",
            "Hidrogênio"
        ],
        answer: 2
    },

    {
        question: "Em que ano ocorreu o primeiro pouso humano na Lua?",
        options: [
            "1959",
            "1969",
            "1975",
            "1980"
        ],
        answer: 1
    },

    {
        question: "Qual é a capital do Brasil?",
        options: [
            "São Paulo",
            "Rio de Janeiro",
            "Brasília",
            "Salvador"
        ],
        answer: 2
    },

    {
        question: "Qual é o maior oceano da Terra?",
        options: [
            "Atlântico",
            "Índico",
            "Pacífico",
            "Ártico"
        ],
        answer: 2
    }

];


// ========================================
// CONFIGURAÇÕES
// ========================================

const MAX_LIVES = 5;

let currentQuestionIndex = 0;
let score = 0;
let lives = MAX_LIVES;
let combo = 0;
let answered = false;


// ========================================
// ELEMENTOS HTML
// ========================================

const questionElement =
    document.getElementById("question");

const optionsElement =
    document.getElementById("options");

const nextButton =
    document.getElementById("next-btn");

const pageIndicator =
    document.getElementById("page-indicator");

const progressBar =
    document.getElementById("progress");

const quizScreen =
    document.getElementById("quiz");

const resultScreen =
    document.getElementById("result-screen");

const scoreElement =
    document.getElementById("score");

const scoreLiveElement =
    document.getElementById("score-live");

const livesElement =
    document.getElementById("lives");

const feedbackElement =
    document.getElementById("feedback");

const comboElement =
    document.getElementById("combo");

const characterElement =
    document.getElementById("character");

const finalLivesElement =
    document.getElementById("final-lives");

const finalMessageElement =
    document.getElementById("final-message");

const resultCharacterElement =
    document.getElementById("result-character");


// ========================================
// SOM
// ========================================

let audioContext = null;

function getAudioContext() {

    if (!audioContext) {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (AudioContext) {
            audioContext = new AudioContext();
        }
    }

    return audioContext;
}


function playTone(
    frequency,
    duration,
    type = "sine",
    volume = 0.08
) {

    const ctx = getAudioContext();

    if (!ctx) return;

    if (ctx.state === "suspended") {
        ctx.resume();
    }

    const oscillator =
        ctx.createOscillator();

    const gain =
        ctx.createGain();

    oscillator.type = type;

    oscillator.frequency.setValueAtTime(
        frequency,
        ctx.currentTime
    );

    gain.gain.setValueAtTime(
        volume,
        ctx.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start();

    oscillator.stop(
        ctx.currentTime + duration
    );
}


// Som de acerto

function playCorrectSound() {

    playTone(523, 0.12, "sine", 0.08);

    setTimeout(() => {
        playTone(659, 0.12, "sine", 0.08);
    }, 100);

    setTimeout(() => {
        playTone(784, 0.2, "sine", 0.08);
    }, 200);
}


// Som de erro

function playWrongSound() {

    playTone(220, 0.18, "sawtooth", 0.07);

    setTimeout(() => {
        playTone(160, 0.25, "sawtooth", 0.06);
    }, 150);
}


// ========================================
// INICIAR QUIZ
// ========================================

function startQuiz() {

    currentQuestionIndex = 0;

    score = 0;

    lives = MAX_LIVES;

    combo = 0;

    answered = false;

    quizScreen.classList.remove("hide");

    resultScreen.classList.add("hide");

    scoreLiveElement.innerText = score;

    updateLives();

    updateCombo();

    showQuestion();
}


// ========================================
// MOSTRAR PERGUNTA
// ========================================

function showQuestion() {

    resetState();

    const currentQuestion =
        questions[currentQuestionIndex];

    pageIndicator.innerText =
        `Pergunta ${currentQuestionIndex + 1} de ${questions.length}`;

    progressBar.style.width =
        `${((currentQuestionIndex + 1) / questions.length) * 100}%`;

    questionElement.innerText =
        currentQuestion.question;

    currentQuestion.options.forEach(
        (option, index) => {

            const button =
                document.createElement("button");

            button.innerText = option;

            button.classList.add(
                "option-btn"
            );

            button.addEventListener(
                "click",
                () => selectOption(button, index)
            );

            optionsElement.appendChild(button);
        }
    );
}


// ========================================
// RESETAR ESTADO
// ========================================

function resetState() {

    nextButton.disabled = true;

    optionsElement.innerHTML = "";

    feedbackElement.innerText = "";

    feedbackElement.className =
        "feedback";

    characterElement.className =
        "character";

    answered = false;
}


// ========================================
// ESCOLHER ALTERNATIVA
// ========================================

function selectOption(
    selectedButton,
    index
) {

    if (answered) return;

    answered = true;

    const currentQuestion =
        questions[currentQuestionIndex];

    const buttons =
        optionsElement.querySelectorAll(
            ".option-btn"
        );

    buttons.forEach(
        button => {
            button.disabled = true;
        }
    );


    // ====================================
    // ACERTO
    // ====================================

    if (index === currentQuestion.answer) {

        selectedButton.classList.add(
            "correct"
        );

        score++;

        combo++;

        scoreLiveElement.innerText =
            score;

        playCorrectSound();

        characterElement.innerText =
            "🤩";

        characterElement.classList.add(
            "correct"
        );

        feedbackElement.innerText =
            getCorrectMessage();

        feedbackElement.classList.add(
            "show",
            "correct-text"
        );

        if (combo >= 2) {
            comboElement.classList.add(
                "active"
            );
        }

        if (combo >= 3) {
            comboElement.classList.add(
                "hot"
            );

            createConfetti(15);
        }

    }

    // ====================================
    // ERRO
    // ====================================

    else {

        selectedButton.classList.add(
            "wrong"
        );

        buttons[
            currentQuestion.answer
        ].classList.add(
            "correct"
        );

        lives--;

        combo = 0;

        updateLives();

        updateCombo();

        playWrongSound();

        characterElement.innerText =
            "😵";

        characterElement.classList.add(
            "wrong"
        );

        feedbackElement.innerText =
            `Ops! Você perdeu 1 ❤️`;

        feedbackElement.classList.add(
            "show",
            "wrong-text"
        );

        // Vibração no celular

        if (
            navigator.vibrate
        ) {
            navigator.vibrate(
                [100, 50, 100]
            );
        }
    }


    nextButton.disabled = false;


    // Se acabou as vidas

    if (lives <= 0) {

        nextButton.innerText =
            "Ver Resultado 💀";
    }

    else if (
        currentQuestionIndex ===
        questions.length - 1
    ) {

        nextButton.innerText =
            "Ver Resultado 🏆";
    }

    else {

        nextButton.innerText =
            "Próxima Pergunta ➜";
    }
}


// ========================================
// MENSAGENS DE ACERTO
// ========================================

function getCorrectMessage() {

    const messages = [
        "🎉 Acertou!",
        "🔥 Mandou muito bem!",
        "⭐ Resposta perfeita!",
        "🧠 Você é fera!",
        "🚀 Excelente!",
        "💥 Boa demais!",
        "🏆 Acertou em cheio!"
    ];

    return messages[
        Math.floor(
            Math.random() * messages.length
        )
    ];
}


// ========================================
// PRÓXIMA PERGUNTA
// ========================================

function nextQuestion() {

    if (!answered) return;


    // Se acabou as vidas

    if (lives <= 0) {

        showResult();

        return;
    }


    currentQuestionIndex++;


    // Acabaram as perguntas

    if (
        currentQuestionIndex >=
        questions.length
    ) {

        showResult();

    }

    else {

        showQuestion();

    }
}


// ========================================
// ATUALIZAR VIDAS
// ========================================

function updateLives() {

    const hearts =
        livesElement.querySelectorAll(
            "span"
        );

    hearts.forEach(
        (heart, index) => {

            if (index < lives) {

                heart.classList.remove(
                    "lost"
                );

                heart.innerText = "❤️";

            }
            else {

                heart.classList.add(
                    "lost"
                );

                heart.innerText = "🖤";

            }
        }
    );
}


// ========================================
// ATUALIZAR COMBO
// ========================================

function updateCombo() {

    comboElement.innerText =
        `🔥 Combo: ${combo}`;

    if (combo === 0) {

        comboElement.classList.remove(
            "active",
            "hot"
        );
    }
}


// ========================================
// RESULTADO
// ========================================

function showResult() {

    quizScreen.classList.add(
        "hide"
    );

    resultScreen.classList.remove(
        "hide"
    );

    scoreElement.innerText =
        score;

    finalLivesElement.innerText =
        lives;


    if (lives <= 0) {

        resultCharacterElement.innerText =
            "💀";

        finalMessageElement.innerText =
            "Suas vidas acabaram! Tente novamente e melhore sua pontuação.";

    }

    else if (score === 12) {

        resultCharacterElement.innerText =
            "👑";

        finalMessageElement.innerText =
            "PERFEITO! Você acertou todas! 🏆";

        createConfetti(80);

    }

    else if (score >= 9) {

        resultCharacterElement.innerText =
            "🏆";

        finalMessageElement.innerText =
            "Sensacional! Você conhece bastante! 🔥";

        createConfetti(50);

    }

    else if (score >= 6) {

        resultCharacterElement.innerText =
            "😎";

        finalMessageElement.innerText =
            "Muito bom! Continue treinando! ⭐";

        createConfetti(30);

    }

    else {

        resultCharacterElement.innerText =
            "💪";

        finalMessageElement.innerText =
            "Boa tentativa! Jogue novamente para melhorar!";

    }
}


// ========================================
// CONFETES
// ========================================

function createConfetti(amount) {

    const container =
        document.getElementById(
            "confetti-container"
        );

    const colors = [
        "#ff007f",
        "#00f0ff",
        "#ffd700",
        "#00ff88",
        "#ffffff",
        "#7928ca"
    ];

    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const confetti =
            document.createElement(
                "div"
            );

        confetti.classList.add(
            "confetti"
        );

        confetti.style.left =
            `${Math.random() * 100}%`;

        confetti.style.background =
            colors[
                Math.floor(
                    Math.random() *
                    colors.length
                )
            ];

        confetti.style.animationDelay =
            `${Math.random() * 0.8}s`;

        confetti.style.transform =
            `rotate(${Math.random() * 360}deg)`;

        container.appendChild(
            confetti
        );

        setTimeout(
            () => confetti.remove(),
            3500
        );
    }
}


// ========================================
// RECOMEÇAR
// ========================================

function restartQuiz() {

    startQuiz();
}


// ========================================
// INICIAR
// ========================================

startQuiz();
