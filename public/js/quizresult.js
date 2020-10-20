// https://github.com/briancodex/quiz-app-js

const finalScore = document.querySelector('#finalScore')
const currentScore = localStorage.getItem('currentScore')
const resultPassFail = document.querySelector('#resultPassFail');
const takeQuizAgain = document.querySelector('#takeQuizAgain');
const goRegister = document.querySelector('#goRegister');

// obtain the score from local storage and display it
finalScore.innerText = currentScore



// if score is not 4 out of 4, display failed message and retake button only
if (currentScore != 4) {
    resultPassFail.innerText = 'You failed, try again.'
    goRegister.innerText = ''
}

// if score is 4 out of 4, display passed message and registration button
if (currentScore == 4) {
    resultPassFail.innerText = 'You passed, you can now proceed with registration.'
    takeQuizAgain.innerText = ''
}