let API_URL =
  "https://opentdb.com/api.php?amount=30&category=9&difficulty=easy&type=multiple";

const questionContainer = document.getElementsByClassName("question")[0];
const answersContainer = document.getElementsByClassName("answer");
const scoreBord = document.getElementsByClassName("score")[0];
const correctAnswerSound = new Audio("./Correct-answer.mp3");
const worngAnswerSound = new Audio("./Wrong-answer-sound-effect.mp3");
let questionNumber = 1;
let questions = [];
let score = 0;
async function getTHeQestion() {
  await fetch(API_URL)
    .then((data) => {
      data.json().then((question) => {
        // api response
        questions = [...question.results];
        let res = questions[questionNumber - 1];
        loadQuestion(
          res.question,
          [...res.incorrect_answers, res.correct_answer],
          res.correct_answer
        );
      });
    })
    .catch((err) => {
      console.log(err);
    });
}
getTHeQestion();
function loadQuestion(question, answers, correctAnswer) {
  console.log(correctAnswer);
  questionContainer.innerHTML = question;
  let indexes = getRandomSort();
  for (let i = 0; i < 4; i++) {
    answersContainer[indexes[i]].innerHTML = answers[i];
  }
}

function getRandomSort() {
  let arr = [];
  let num = ran();
  for (let i = 0; i < 4; i++) {
    while (arr.includes(num)) {
      num = ran();
    }
    arr.push(num);
  }
  return arr;
}

function ran() {
  return Math.floor(Math.random() * 4);
}

function correct(clicked) {
  score++;
  scoreBord.innerText = score;
  correctAnswerSound.play();
  clicked.classList.add("correct");
  setTimeout(loadNextQuestion, 1500);
}

function wrong(clicked, correctAnswerElem) {
  worngAnswerSound.play();
  clicked.classList.add("wrong");
  correctAnswerElem.classList.add("correct");
  setTimeout(loadNextQuestion, 1500);
}

function loadNextQuestion() {
  reset();
  questionNumber += 1;
  let res = questions[questionNumber - 1];
  loadQuestion(
    res.question,
    [...res.incorrect_answers, res.correct_answer],
    res.correct_answer
  );
}

function reset() {
  for (let answer of answersContainer) {
    answer.classList.remove("correct");
    answer.classList.remove("wrong");
  }
}
function check(elem) {
  let correctAnswer = questions[questionNumber - 1].correct_answer;
  let correctAnswerElem = [...answersContainer].filter(
    (ans) => ans.innerText == correctAnswer
  )[0];

  if (elem.innerText == correctAnswer) {
    correct(elem);
  } else {
    wrong(elem, correctAnswerElem);
  }
}

for (let answer of answersContainer) {
  answer.addEventListener("click", (e) => {
    check(e.target);
  });
}
