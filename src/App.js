import React, { useState, useEffect } from 'react';
import './App.css';

const questions = [
  {
    question: "Which programming language is often used for artificial intelligence and machine learning?",
    options: ["Java", "Python", "C++", "Ruby"],
    correctAnswer: "Python"
  },
  {
    question: "What is the capital of Brazil?",
    options: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"],
    correctAnswer: "Brasília"
  },
  {
    question: "In which year did the first iPhone launch?",
    options: ["2005", "2006", "2007", "2008"],
    correctAnswer: "2007"
  },
  {
    question: "What is the largest organ in the human body?",
    options: ["Brain", "Liver", "Skin", "Heart"],
    correctAnswer: "Skin"
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: "Leonardo da Vinci"
  },
  {
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Gl", "Gd", "Au"],
    correctAnswer: "Au"
  },
  {
    question: "Which planet in our solar system is known as the 'Red Planet'?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars"
  },
  {
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correctAnswer: "Pacific Ocean"
  },
  {
    question: "Who wrote the play 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    correctAnswer: "William Shakespeare"
  },
  {
    question: "What is the capital of Japan?",
    options: ["Seoul", "Beijing", "Tokyo", "Bangkok"],
    correctAnswer: "Tokyo"
  },
  {
    question: "Which element is the most abundant in the Earth's atmosphere?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
    correctAnswer: "Nitrogen"
  },
  {
    question: "What is the smallest prime number?",
    options: ["0", "1", "2", "3"],
    correctAnswer: "2"
  },
  {
    question: "Who is known as the 'Father of Computer Science'?",
    options: ["Alan Turing", "Bill Gates", "Steve Jobs", "Mark Zuckerberg"],
    correctAnswer: "Alan Turing"
  },
  {
    question: "What is the main ingredient in guacamole?",
    options: ["Tomato", "Avocado", "Onion", "Lemon"],
    correctAnswer: "Avocado"
  },
  {
    question: "Which country is home to the Great Barrier Reef?",
    options: ["Brazil", "Indonesia", "Australia", "Philippines"],
    correctAnswer: "Australia"
  }
];

const QuestionNavigationBox = ({ questions, currentQuestionIndex, answers, flaggedQuestions, visitedQuestions, onQuestionSelect }) => {
  return (
    <div className="question-navigation-box">
      <h3>Question Navigator</h3>
      <div className="question-number-grid">
        {questions.map((_, index) => {
          let status = 'unvisited';
          if (visitedQuestions[index]) status = 'visited';
          if (answers[index] !== null) status = 'answered';
          if (flaggedQuestions[index]) status = 'flagged';

          return (
            <button
              key={index}
              className={`question-number-button ${status} ${index === currentQuestionIndex ? 'current' : ''}`}
              onClick={() => onQuestionSelect(index)}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const QuizTaker = ({ questions, onQuizComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  const [visitedQuestions, setVisitedQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (questions && questions.length > 0) {
      setAnswers(new Array(questions.length).fill(null));
      setFlaggedQuestions(new Array(questions.length).fill(false));
      setVisitedQuestions(new Array(questions.length).fill(false));
      setVisitedQuestions(prevState => {
        const newState = [...prevState];
        newState[0] = true; // Mark the first question as visited
        return newState;
      });
      setIsLoading(false);
    }
  }, [questions]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 0) {
          clearInterval(timer);
          completeQuiz();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const completeQuiz = () => {
    onQuizComplete(answers, flaggedQuestions, visitedQuestions);
  };

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);
  };

  const handleFlagQuestion = () => {
    const newFlaggedQuestions = [...flaggedQuestions];
    newFlaggedQuestions[currentQuestionIndex] = !newFlaggedQuestions[currentQuestionIndex];
    setFlaggedQuestions(newFlaggedQuestions);
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
    setVisitedQuestions(prevState => {
      const newState = [...prevState];
      newState[index] = true;
      return newState;
    });
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      goToQuestion(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      goToQuestion(currentQuestionIndex - 1);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (isLoading) {
    return <div>Loading quiz...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return <div>Error: Question not found</div>;
  }

  const isUnvisited = !visitedQuestions[currentQuestionIndex];
  const isVisited = visitedQuestions[currentQuestionIndex] && !answers[currentQuestionIndex];
  const isAnswered = answers[currentQuestionIndex] !== null;
  const isFlagged = flaggedQuestions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      <div className="timer">Time left: {formatTime(timeLeft)}</div>
      <h2>Question {currentQuestionIndex + 1} of {questions.length}</h2>
      <div className="quiz-header">
        <div className="question-status">
          <span className={`status-indicator unvisited ${isUnvisited ? 'active' : ''}`}>
            <span className="bracket left"></span>
            <span className="status-text">Unvisited</span>
            <span className="bracket right"></span>
          </span>
          <span className={`status-indicator visited ${isVisited ? 'active' : ''}`}>
            <span className="bracket left"></span>
            <span className="status-text">Visited</span>
            <span className="bracket right"></span>
          </span>
          <span className={`status-indicator answered ${isAnswered ? 'active' : ''}`}>
            <span className="bracket left"></span>
            <span className="status-text">Answered</span>
            <span className="bracket right"></span>
          </span>
          <span className={`status-indicator flagged ${isFlagged ? 'active' : ''}`}>
            <span className="bracket left"></span>
            <span className="status-text">Flagged</span>
            <span className="bracket right"></span>
          </span>
        </div>
        <button
          onClick={handleFlagQuestion}
          className={`flag-button ${isFlagged ? 'flagged' : ''}`}
        >
          {isFlagged ? 'Unflag' : 'Flag'} Question
        </button>
      </div>
      <div className="question-container">
        <p className="question">{currentQuestion.question}</p>
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            className={`answer-button ${answers[currentQuestionIndex] === option ? 'selected' : ''}`}
          >
            {option}
          </button>
        ))}
      </div>
      <QuestionNavigationBox
        questions={questions}
        currentQuestionIndex={currentQuestionIndex}
        answers={answers}
        flaggedQuestions={flaggedQuestions}
        visitedQuestions={visitedQuestions}
        onQuestionSelect={goToQuestion}
      />
      <div className="navigation-buttons">
        <button
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className="nav-button"
        >
          Previous
        </button>
        {currentQuestionIndex === questions.length - 1 ? (
          <button
            onClick={completeQuiz}
            className="nav-button finish-button"
          >
            Finish Quiz
          </button>
        ) : (
          <button
            onClick={goToNextQuestion}
            className="nav-button"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};
const QuizResult = ({ questions, answers, flaggedQuestions, visitedQuestions }) => {
  const results = questions.map((question, index) => ({
    question: question.question,
    userAnswer: answers[index],
    correctAnswer: question.correctAnswer,
    isCorrect: answers[index] === question.correctAnswer,
    isFlagged: flaggedQuestions[index],
    isVisited: visitedQuestions[index],
    isAnswered: answers[index] !== null
  }));

  const totalQuestions = questions.length;
  const correctAnswers = results.filter(r => r.isCorrect).length;
  const wrongAnswers = results.filter(r => r.isAnswered && !r.isCorrect).length;
  const unvisitedQuestions = results.filter(r => !r.isVisited).length;
  const unansweredQuestions = results.filter(r => r.isVisited && !r.isAnswered).length;
  const score = (correctAnswers / totalQuestions) * 100;

  return (
    <div className="result-container">
      <h2>Quiz Results</h2>
      <div className="result-summary">
        <p className="score">Your Score: {score.toFixed(2)}%</p>
        <div className="progress-bar">
          <div className="progress" style={{width: `${score}%`}}></div>
        </div>
        <div className="result-stats">
          <p>Total Questions: {totalQuestions}</p>
          <p>Correct Answers: {correctAnswers}</p>
          <p>Wrong Answers: {wrongAnswers}</p>
          <p>Unvisited Questions: {unvisitedQuestions}</p>
          <p>Questions Left Unanswered: {unansweredQuestions}</p>
        </div>
      </div>
      <div className="question-summary">
        <h3>Question Details</h3>
        {results.map((result, index) => (
          <div key={index} className={`question-result ${result.isCorrect ? 'correct' : 'incorrect'} ${result.isFlagged ? 'flagged' : ''}`}>
            <p className="question-number">Question {index + 1}:</p>
            <p className="question">{result.question}</p>
            <p className="user-answer">Your answer: {result.userAnswer || 'Not answered'}</p>
            <p className="correct-answer">Correct answer: {result.correctAnswer}</p>
            <p className="status">
              {result.isCorrect ? 'Correct' : (result.isAnswered ? 'Incorrect' : 'Not answered')}
              {result.isFlagged && ' (Flagged)'}
              {!result.isVisited && ' (Unvisited)'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const App = () => {
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  const [visitedQuestions, setVisitedQuestions] = useState([]);

  const handleQuizComplete = (quizAnswers, quizFlaggedQuestions, quizVisitedQuestions) => {
    setAnswers(quizAnswers);
    setFlaggedQuestions(quizFlaggedQuestions);
    setVisitedQuestions(quizVisitedQuestions);
    setQuizCompleted(true);
  };

  return (
    <div className="app-container">
      <h1>Online Quiz Platform</h1>
      {!quizCompleted ? (
        <QuizTaker 
          questions={questions} 
          onQuizComplete={handleQuizComplete} 
        />
      ) : (
        <QuizResult 
          questions={questions} 
          answers={answers} 
          flaggedQuestions={flaggedQuestions}
          visitedQuestions={visitedQuestions}
        />
      )}
    </div>
  );
};

export default App;