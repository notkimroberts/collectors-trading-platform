// https://github.com/briancodex/quiz-app-js
const question = document.querySelector('#question');
const choices = Array.from(document.querySelectorAll('.choice-text'));
const progressText = document.querySelector('#progressText');
const scoreText = document.querySelector('#score');


let currentQuestion = {}
let acceptingAnswers = true
let score = 0
let questionCounter = 0
let availableQuestions = []

// array of questions
let questions = [
    {
        question: 'What types of links can I send other users?',
        choice1: 'eBay links',
        choice2: 'instagram/twitter profile',
        choice3: 'Facebook group links',
        choice4: 'none of the above',
        answer: 4,
    },
    {
        question:
            "After agreeing upon a trade, how many days do I get to send my package to the other party?",
        choice1: "1 business day",
        choice2: "3 business days",
        choice3: "1 week",
        choice4: "there's no time limit if I ask the other party for more time to send",
        answer: 2,
    },
    {
        question: "Before a trade can be agreed upon, which of the below must be done?",
        choice1: "have a PayPal account",
        choice2: "exchange phone numbers",
        choice3: "ask each other for trade references to prove each other is a good trader",
        choice4: "send pictures of item with namecard to prove you own the item",
        answer: 1,
    },
    {
        question: "What is the first thing you should you do if you have not received your end of the trade?",
        choice1: "Let Collector Trading Platform know",
        choice2: "check the tracking number to see where your package is",
        choice3: "file a PayPal Claim",
        choice4: "do nothing and just wait",
        answer: 2,
    }
]

const MAX_QUESTIONS = 4

// start the quiz
startQuiz = () => {
    questionCounter = 0
    score = 0
    availableQuestions = [...questions]
    getNewQuestion()
}

// get a new question
getNewQuestion = () => {

    // if there are no more questions left or the question counter is above how many questions we have
    if(availableQuestions.length === 0 || questionCounter > MAX_QUESTIONS) {
        localStorage.setItem('currentScore', score)

        // send user to the quiz results page
        return window.location.assign('/quizresult')
    }

    // if there is still available questions, increment question counter and update question progress
    questionCounter++
    progressText.innerText = `Question ${questionCounter} of ${MAX_QUESTIONS}`
    
    // generate random question from the questions left
    const questionsIndex = Math.floor(Math.random() * availableQuestions.length)
    // get the current question
    currentQuestion = availableQuestions[questionsIndex]
    // display the current question and choices
    question.innerText = currentQuestion.question

    choices.forEach(choice => {
        const number = choice.dataset['number']
        choice.innerText = currentQuestion['choice' + number]
    })

    availableQuestions.splice(questionsIndex, 1)

    acceptingAnswers = true
}

choices.forEach(choice => {
    // obtain user's answer clicked
    choice.addEventListener('click', e => {
        if(!acceptingAnswers) return

        acceptingAnswers = false

        // store the user's choice selection
        const selectedChoice = e.target
        const selectedAnswer = selectedChoice.dataset['number']


        // let classToApply be correct if equal, or incorrect if not equal
        let classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect'

        // if answer is correct, increment score
        if(classToApply === 'correct') {
            score++
            scoreText.innerText = score
        }

       // add class 
       selectedChoice.parentElement.classList.add(classToApply)

        // pause to show user's selectio nchange color before going to next question
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply) // remove class
            getNewQuestion() // go to next question

        }, 500)
    })
})

// initialize quiz
startQuiz()
