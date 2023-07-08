import './App.css';
import { useCallback, useEffect, useState } from 'react';
import Question from './components/Question';
import QuestionList from './components/QuestionList';
import Lifeline from './components/Lifeline';

const prizeMap = [
  1_000,
  2_000,
  3_000,
  5_000,
  10_000,
  20_000,
  40_000,
  80_000,
  1_60_000,
  3_20_000,
  6_40_000,
  12_50_000,
  25_00_000,
  50_00_000,
  75_00_000,
  1_00_00_000,
  7_50_00_000
];

const lockAudioString = '/assets/audios/lock.mp3';
const lifelineAudioString = '/assets/audios/lifeline.mp3';
const newAudioString = '/assets/audios/new.mp3';
const wrongAudioString = '/assets/audios/wrong.mp3';
const introAudioString = '/assets/audios/intro.mp3';

const lifelineIndexMap = {
  'fiftyFifty': 0,
  'doubleDip': 1,
  'powerPaplu': 2
};

function App() {
  const [playMode, setPlayMode] = useState(false);
  const [liflines, setLifelines] = useState([
    {name: 'fiftyFifty', isDisabled: false},
    {name: 'doubleDip', isDisabled: false},
    {name: 'powerPaplu', isDisabled: false}
  ]);
  const [quit, setQuit] = useState(false);
  const [shouldDisplayQuestions, setShouldDisplayQuestions] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [correct_answer, setCorrectAnswer] = useState(-1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [introAudio, setIntroAudio] = useState(new Audio(introAudioString));
  const [suspenseAudio, setSuspenseAudio] = useState(new Audio('/assets/audios/suspense1.mp3'));
  const [newAudio, setNewAudio] = useState(new Audio(newAudioString));
  const [wrongAudio, setWrongAudio] = useState(new Audio(wrongAudioString));
  const [lockAudio, setLockAudio] = useState(new Audio(lockAudioString));
  const [lifelineAudio, setLifelineAudio] = useState(new Audio(lifelineAudioString));
  const [usingDoubleDip, setUsingDoubleDip] = useState(0);
  const [usingLifeline, setUsingLifeline] = useState([]);
  const [lifeLinePrompt, setLifelinePrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldDisplayPrize, setShouldDisplayPrize] = useState(false);

  const getPrize = () => {
    if(currentQuestion <= 0){
      return 0;
    } else if(quit){
      return prizeMap[currentQuestion - 1];
    } else if(currentQuestion <= 4) {
      return 0;
    } else if(currentQuestion <= 9) {
      return prizeMap[4];
    } else if(currentQuestion <= 14) {
      return prizeMap[9];
    } else if(currentQuestion <= 15) {
      return prizeMap[14];
    } else {
      return prizeMap[16];
    }
  }
  const isPlaying = (audio) => {
    return !audio.paused;
  }

  const renderPlayButton = () => {
    return (playMode) ? null : 
    <button onClick={playStarted}>Play</button>
  }

  const fiftyFifty = () => {
    setUsingLifeline([...usingLifeline, 0]);
    const newQuestions = [...questions];
    const newQuestion = {...newQuestions[currentQuestion]};
    const wrongOptions = newQuestion.options.filter((option, index) => {
      return index !== newQuestion.correctAnswerIndex;
    });
    const randomIndex = Math.floor(Math.random() * wrongOptions.length);
    const wrongOption = wrongOptions[randomIndex];
    const correctOption = newQuestion.correct_answer;
    
    let newOptions = [wrongOption, correctOption];
    newOptions = newOptions.sort(() => Math.random() - 0.5);

    const correctAnswerIndex = newOptions.indexOf(correctOption);
    
    newQuestion.options = newOptions;
    newQuestion.correctAnswerIndex = correctAnswerIndex;
    newQuestions[currentQuestion] = newQuestion;
    setQuestions(newQuestions);
  }

  const doubleDip = () => {
    setUsingLifeline([...usingLifeline, 1]);
    setUsingDoubleDip(1);
  }

  const powerPaplu = () => {
    setUsingLifeline([...usingLifeline, 2]);
    setLifelinePrompt(true);
  }

  const getLifelineByIndex = (index) => {
    switch(index) {
      case 0:
        fiftyFifty();
        break;
      case 1:
        doubleDip();
        break;
      case 2:
        powerPaplu();
        break;
      default:
        break;
    }
  }

  const lifelineClick = (index) => {
    if(liflines[index].isDisabled) {
      return;
    }
    const newLifelines = [...liflines];
    newLifelines[index].isDisabled = true;
    setLifelines(newLifelines);
    lifelineAudio.play();
    getLifelineByIndex(index);
  }

  const renderLifeLines = () => {
    return (
      <Lifeline
        lifelines={liflines}
        onClick={lifelineClick}
      />
    );
  }

  const renderPrize = () => {
    return (
      <div className='prize__container'>
        <div className='prize__text'>Prize Won</div>
        <div className='prize__amount'> ₹ { getPrize()}</div>
      </div>
    );
  }

  const renderPlayConsole = () => {
    return (playMode) ? (
      <div className="playConsole">
        <div className='playConsole__container'>
          <img src="/assets/images/logo.png" alt="Logo" className='logo__img' />
          { shouldDisplayQuestions && loadQuestionComponent() }
          { shouldDisplayQuestions && renderLifeLines() }
          { shouldDisplayQuestions && renderQuitButton() }
          { shouldDisplayPrize && renderPrize() }
        </div>
        <QuestionList questions={prizeMap} current={currentQuestion} />
      </div>
    ) : null;
  }
  const playStarted = () => {
    introAudio.play();
    introAudio.addEventListener('ended', () => {
      suspenseAudio.loop = true;
      console.log('playing suspense3');
      suspenseAudio.play();
      setShouldDisplayQuestions(true);      
      setIntroAudio(new Audio(introAudioString));
    });
    setPlayMode(true);
  }

  const loadQuestion = () => {
    setIsLoading(true);
    if(questions.length === 0) {
      loadEasyQuestions();
    } else if(questions.length === 6) {
      loadMediumQuestions();
    } else {
      loadHardQuestions();
    }
  }

  const needNewQuestion = () => {
    return (currentQuestion >= questions.length) 
  }

  const loadQuestionComponent = () => {
    if(needNewQuestion() && !isLoading) {
      loadQuestion();
      return null;
    } else if(isLoading) {
      return (
        <div className='loading__container'>
          Loading Questions... 
          <div className='loading__circle'></div>
        </div>
      )
    } else {
      return (
        <Question
            question={questions[currentQuestion].question}
            category={questions[currentQuestion].category}
            options={questions[currentQuestion].options}
            correctAnswer={correct_answer}
            onAnswer={onAnswer}
            usingDoubleDip={usingDoubleDip}
        />
      )
    }
  }
  useEffect(() => {
    if(currentQuestion <= 0){
      return;
    }
    suspenseAudio.pause();
    newAudio.play();
    newAudio.addEventListener('ended', () => {
      if(!isPlaying(suspenseAudio)) {
        console.log('playing suspense1');
        suspenseAudio.play();
      }
      setNewAudio(new Audio(newAudioString));
    });
    setUsingLifeline([]);
  }, [currentQuestion]);

  useEffect(() => {
    if(shouldDisplayPrize) {
      suspenseAudio.pause();
      introAudio.loop = true;
      introAudio.play();
    }
  }, [shouldDisplayPrize]);

  const onAnswer = (index) => {
    if(isPlaying(suspenseAudio)) {
      suspenseAudio.pause(); 
    }
    const correctAnswer = questions[currentQuestion].correctAnswerIndex;
    if(usingDoubleDip === 2) {
      setUsingDoubleDip(0);
    }
    lockAudio.play();
    lockAudio.addEventListener('ended', () => {
      console.log('index', index, 'correctAnswer', correctAnswer);
      if(index === correctAnswer) {
        console.log('index', index, 'correctAnswer', correctAnswer);
        setCorrectAnswer(correctAnswer);
        setTimeout(() => {
          if(currentQuestion === 16) {
            setShouldDisplayQuestions(false);
            setShouldDisplayPrize(true);
            return;
          }
          setCurrentQuestion(currentQuestion + 1);
          setCorrectAnswer(-1);
          if(!isPlaying(suspenseAudio)) {
            let randomSuspense = Math.floor(Math.random() * 3) + 1;
            suspenseAudio.src = `/assets/audios/suspense${randomSuspense}.mp3`;
            console.log('playing suspense2');
            suspenseAudio.play();
          }
        }, 2000);
        setUsingDoubleDip(0);
      } else if(usingDoubleDip === 1) {
        wrongAudio.play();
        setUsingDoubleDip(2);
      } else {
        wrongAudio.play();
        setCorrectAnswer(correctAnswer);
        wrongAudio.addEventListener('ended', () => {
          setTimeout(() => {
            setShouldDisplayQuestions(false);
            setShouldDisplayPrize(true);
          }, 3000);
          setWrongAudio(new Audio(wrongAudioString));
        });
      }
      setLockAudio(new Audio(lockAudioString));
    });
  }

  const getShuffeledAnswers = (data) => {
    const questionData = data.map((question) => {
      const answers = [...question.incorrect_answers, question.correct_answer];
      const shuffledAnswers = answers.sort(() => Math.random() - 0.5);
      const correctAnswerIndex = shuffledAnswers.findIndex((answer) => answer === question.correct_answer);
      return {
        ...question,
        options: shuffledAnswers,
        correctAnswerIndex: correctAnswerIndex
      }
    });
    return questionData;
  }

  const loadEasyQuestions = () => {
    fetch('https://opentdb.com/api.php?amount=6&difficulty=easy&type=multiple').then(
      (response) => {
        return response.json();
      } 
    ).then(
      (data) => {
        const questionData = getShuffeledAnswers(data.results);
        setQuestions(questionData);
        setIsLoading(false);
      }
    )
  }

  const loadMediumQuestions = () => {
    fetch('https://opentdb.com/api.php?amount=6&difficulty=medium&type=multiple').then(
      (response) => {
        return response.json();
      } 
    ).then(
      (data) => {
        const questionData = getShuffeledAnswers(data.results);
        setQuestions([...questions, ...questionData]);
        setIsLoading(false);
      }
    )
  }

  const loadHardQuestions = () => {
    fetch('https://opentdb.com/api.php?amount=5&difficulty=hard&type=multiple').then(
      (response) => {
        return response.json();
      }
    ).then(
      (data) => {
        const questionData = getShuffeledAnswers(data.results);
        setQuestions([...questions, ...questionData]);
        setIsLoading(false);
      }
    )
  }

  const renderLifelinePrompt = () => {
    console.log('usingLifeline', usingLifeline);
    let usedLifelines = liflines.filter((lifeline, index) => lifeline.isDisabled && lifeline.name !== 'powerPaplu' && !usingLifeline.includes(index));
    usedLifelines = usedLifelines.map((lifeline) => {
      return {
        ...lifeline,
        isDisabled: false
      }
    });
    const myLifelineClick = (index) => {
      const papluIndex = lifelineIndexMap[usedLifelines[index].name];
      getLifelineByIndex(papluIndex);
    }
    console.log('usedLifelines', usedLifelines);
    console.log('lifelinePrompt', lifeLinePrompt);
    return (lifeLinePrompt && usedLifelines && usedLifelines.length > 0) ? (
      <div className='glass'>
        <div className='lifeline__prompt'>
          <Lifeline
            lifelines={usedLifelines}
            onClick={(index)=>{
              myLifelineClick(index);
              setLifelinePrompt(false);
            }}
          />
        </div>
      </div>
    ) : null;
  }

  const renderQuitButton = () => {
    return (
      <div className='quit__button'>
        <button onClick={() => {
          setShouldDisplayQuestions(false);
          setUsingLifeline([]);
          setQuit(true);
          setShouldDisplayPrize(true);
        }}>Quit</button>
      </div>
    )
  }

  return (
    <div className="App">
      { renderPlayButton() }
      { renderPlayConsole() }
      { renderLifelinePrompt() }
    </div>
  );
}

export default App;
