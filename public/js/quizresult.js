const finalScore = document.querySelector('#finalScore')
const mostRecentScore = localStorage.getItem('mostRecentScore')
const resultPassFail = document.querySelector('#resultPassFail');
const takeQuizAgain = document.querySelector('#takeQuizAgain');
const goRegister = document.querySelector('#goRegister');

finalScore.innerText = mostRecentScore




if (mostRecentScore != 4) {
    resultPassFail.innerText = 'You failed, try again.'
    goRegister.innerText = ''
}

if (mostRecentScore == 4) {
    resultPassFail.innerText = 'You passed, you can now proceed with registration.'
    takeQuizAgain.innerText = ''
}