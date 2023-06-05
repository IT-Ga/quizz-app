import { useEffect, useState } from 'react'

import './App.css'

const Quiz = () => {
  const [activeQuestion, setActiveQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null)
  const [result, setResult] = useState({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  })

 const [data, setData] = useState([]);
 const [choices, setChoices] = useState([]);
  const { questions } = data
  // const { question , correctAnswer } = questions[activeQuestion]
  
  const getData = async()=> {
    const response = await fetch("https://opentdb.com/api.php?amount=5");
  const jsonData = await response.json();
  console.log(jsonData.results);
  setData(jsonData?.results);

  }
  useEffect (()=>{ 
    getData();
  },[data])
  
  const onClickNext = () => {
    // again reset the selectedAnwerIndex, so it won't effect next question
    setSelectedAnswerIndex(null)
    setResult((prev) =>
      selectedAnswer
        ? {
            ...prev,
            score: prev.score + 5,
            correctAnswers: prev.correctAnswers + 1,
          }
        : { ...prev, wrongAnswers: prev.wrongAnswers + 1 }
    )
    if (activeQuestion !== questions.length - 1) {
      setActiveQuestion((prev) => prev + 1)
    } else {
      setActiveQuestion(0)
      setShowResult(true)
    }
  }

  const onAnswerSelected = (answer, index) => {
    setSelectedAnswerIndex(index)
    if (answer === correctAnswer) {// eslint-disable-line
      setSelectedAnswer(true)
    } else {
      setSelectedAnswer(false)
    }
  }

  const addLeadingZero = (number) => (number > 9 ? number : `0${number}`)

  return (
    <div className="quiz-container">

      {  !showResult ?
        (
          <div>
                    <div>
              <span className="active-question-no">{addLeadingZero(activeQuestion + 1)}</span>
              {/* <span className="total-question">/{addLeadingZero(questions.length)}</span> */}
            </div>
            {/* <h2>{question}</h2> */}
            <ul>
              {choices.map((answer, index) => (
                <li
                  onClick={() => onAnswerSelected(answer, index)}
                  key={answer}
                  className={selectedAnswerIndex === index ? 'selected-answer' : null}>
                  {answer}
                </li>
              ))}
            </ul>
            <div className="flex-right">
              <button onClick={onClickNext} disabled={selectedAnswerIndex === null}>
                {/* {activeQuestion === questions.length - 1 ? 'Finish' : 'Next'} */}aa
              </button>
            </div>
          </div>

        ) : (
          <div className="result">
          <h3>Result</h3>
          <p>
            Total Question: <span>{questions.length}</span>
          </p>
          <p>
            Total Score:<span> {result.score}</span>
          </p>
          <p>
            Correct Answers:<span> {result.correctAnswers}</span>
          </p>
          <p>
            Wrong Answers:<span> {result.wrongAnswers}</span>
          </p>
        </div>

        )
       } 
      </div>
      
  )
}

export default Quiz