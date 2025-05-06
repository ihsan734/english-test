let currentQuestionIndex = 0;
let selectedAnswers = [];
let score = 0;
let showAnswerPhase = false;

const questionCounter = document.getElementById("question-counter");
const questionContainer = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-button");
const resultContainer = document.getElementById("result-container");
const resultText = document.getElementById("result-text");

let shuffledQuestions = [];

window.onload = () => {
  shuffledQuestions = shuffle(englishQuestions).slice(0, 25);
  showQuestion();
};

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function showQuestion() {
  resetState();
  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  questionCounter.innerText = `Question ${currentQuestionIndex + 1} of ${shuffledQuestions.length}`;
  questionContainer.innerText = currentQuestion.question;

  currentQuestion.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.innerText = option;
    button.classList.add("btn");
    button.addEventListener("click", () => selectAnswer(index, button));
    answerButtons.appendChild(button);
  });

  updateNextButtonState();
}

function resetState() {
  nextButton.innerText = "Next";
  showAnswerPhase = false;
  selectedAnswers = [];
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

function selectAnswer(index, button) {
  if (showAnswerPhase) return;

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const maxSelectable = currentQuestion.correctIndexes.length;

  const isSelected = selectedAnswers.includes(index);

  if (isSelected) {
    // Убираем выбор
    selectedAnswers = selectedAnswers.filter(i => i !== index);
    button.classList.remove("selected");
  } else {
    if (selectedAnswers.length < maxSelectable) {
      // Добавляем выбор
      selectedAnswers.push(index);
      button.classList.add("selected");
    }
  }

  updateNextButtonState();
}

function updateNextButtonState() {
  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const neededCount = currentQuestion.correctIndexes.length;
  nextButton.disabled = selectedAnswers.length !== neededCount;
}

nextButton.addEventListener("click", () => {
  if (!showAnswerPhase) {
    showCorrectAnswers();
    showAnswerPhase = true;
    nextButton.innerText = "Continue";
  } else {
    currentQuestionIndex++;
    if (currentQuestionIndex < shuffledQuestions.length) {
      showQuestion();
    } else {
      showResult();
    }
  }
});

function showCorrectAnswers() {
  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const buttons = document.querySelectorAll(".btn");

  // Sort both arrays for order-insensitive comparison
  const sortedSelected = [...selectedAnswers].sort();
  const sortedCorrect = [...currentQuestion.correctIndexes].sort();

  const isCorrect =
    sortedSelected.length === sortedCorrect.length &&
    sortedSelected.every((val, idx) => val === sortedCorrect[idx]);

  if (isCorrect) score++;

  buttons.forEach((button, index) => {
    if (currentQuestion.correctIndexes.includes(index)) {
      button.classList.add("correct");
    }
    if (selectedAnswers.includes(index)) {
      button.classList.add("selected");
    }
  });
}

function showResult() {
  document.getElementById("quiz-container").style.display = "none";
  resultContainer.style.display = "block";
  resultText.innerText = `You scored ${score} out of ${shuffledQuestions.length}`;
}
