import React, { useState, useEffect } from 'react';
import axios from 'axios';

function shuffleArray(array) {
  // Sử dụng thuật toán Fisher-Yates để xáo trộn mảng
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [choiceAnswer, setChoiceAnswer] = useState(null)

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('https://opentdb.com/api.php?amount=5');
      const formattedQuestions = response.data.results.map((question) => {
        const answers = shuffleArray([...question.incorrect_answers, question.correct_answer]);
        return {
          question: question.question,
          answers: answers
        };
      });
      setQuestions(formattedQuestions);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStartQuiz = () => {
    setStartTime(Date.now());
    setCurrentIndex(0);
  };

  const handleAnswerChange = (answer, answerIndex) => {
    setChoiceAnswer(answerIndex)
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentIndex] = answer;
    setSelectedAnswers(updatedAnswers);
  };

  const handleNextQuestion = () => {
    setChoiceAnswer(null);
    if (!selectedAnswers[currentIndex]) {
      return; // Không thể chuyển câu nếu chưa chọn câu trả lời cho câu hiện tại
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setEndTime(Date.now());
      setShowResults(true);
    }
  };

  const calculateDuration = () => {
    if (startTime && endTime) {
      const duration = (endTime - startTime) / 1000; // Đổi thành giây
      return duration.toFixed(2); // Lấy 2 chữ số sau dấu thập phân
    }
    return null;
  };

  const calculateScore = () => {
    let correctCount = 0;
    let wrongCount = 0;

    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.answers[question.answers.length - 1]) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    return { correctCount, wrongCount };
  };

  const handleRestartQuiz = () => {
    // Reset các state về giá trị mặc định để bắt đầu lại quiz
    setSelectedAnswers([]);
    setShowResults(false);
    setStartTime(null);
    setEndTime(null);
  };

  return (
    <div className="quiz-container relative">
      {!startTime && !showResults ? (
        
        <div >
          <h1 className=' text-2xl font-bold text-center'>Quiz App</h1>
         
          <button  class="w-full bg-primary-600 hover:bg-primary-700 
                          focus:ring-4 focus:outline-none focus:ring-primary-300 
                          font-medium rounded-lg text-sm px-5 py-2.5 
                          text-center
                          bg-indigo-600 text-white  tracking-wide
                           "
                          onClick={handleStartQuiz}
                          >Start</button>
        </div>
      ) : !showResults ? (
        <div className='leading-6'>
          <h1 className=''>Quiz App</h1>
          {questions.length > 0 && (
            <div >
              <h2>{questions[currentIndex].question}</h2>
              <ul className='leading-6' >
                {questions[currentIndex].answers.map((answer, answerIndex) => (
                  <li  key={answerIndex} className='w-full'>
                    
                    <button className={ choiceAnswer === answerIndex ? 'w-full border-4 border-teal-500  block mt-4   rounded-lg py-2 px-6 text-lg' : 
                    'w-full block mt-4 border border-gray-300 rounded-lg py-2 px-6 text-lg'
                    }  onClick={() => handleAnswerChange(answer, answerIndex)} >{answer}</button>
                     

                  </li>
                ))}
              </ul>
            </div>
          )}
          {currentIndex < questions.length - 1 ? (
            <button className=' bg-indigo-600 text-white text-sm font-bold tracking-wide rounded-full px-5 py-2 absolute bottom-8 right-8' disabled={!selectedAnswers[currentIndex]} onClick={handleNextQuestion}>Next</button>
          ) : (
            <button className=' bg-indigo-600 text-white text-sm font-bold tracking-wide rounded-full px-5 py-2 absolute bottom-8 right-8'  onClick={handleNextQuestion}>Finish</button>
          )}
        </div>
      ) : (
        <div>
          <h1>Quiz Results</h1>
          <h2 className='text-xl font-bold text-center'>{Math.round(calculateScore().correctCount / questions.length * 100 *100)/100 > 50 ? "Pass":"Fail"}</h2>
          <p>Correct answers: {calculateScore().correctCount}</p>
          <p>Wrong answers: {calculateScore().wrongCount}</p>
          <p>Score answers: {Math.round(calculateScore().correctCount / questions.length * 100 *100)/100}</p>
          <p>Time taken: {calculateDuration()} seconds</p>
          <button className="m-auto mt-4 block bg-indigo-600 text-white text-sm font-bold tracking-wide rounded-full px-5 py-2" onClick={handleRestartQuiz}>Restart</button>

        </div>
      )}
    </div>
  );
}

export default App;
