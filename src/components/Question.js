import React, { useEffect, useState } from 'react';

function Question(props) {
    const { question, category, options, onAnswer, correctAnswer, usingDoubleDip} = props;
    const [locked, setLocked] = useState(-1);
    const getAnswerClass = (index) => {
        if (locked === index && correctAnswer === -1 && usingDoubleDip !== 2) {
            return 'question__option--locked';
        } else if (correctAnswer === index) {
            return 'question__option--correct';
        } else if (locked === index && (correctAnswer !== index || usingDoubleDip === 2)) {
            return 'question__option--wrong';
        } else {
            return 'question__option--unlocked';
        }
    }
    useEffect(() => {
        setLocked(-1);
    }, [question]);
    
    const onLocked = (index) => {
        setLocked(index);
        onAnswer(index);
    }
    return (
        <div className="question">
            <div className="question__category">Category: {category}</div>
            <div className="question__title_wrapper">
                <div
                    className="question__title"
                    dangerouslySetInnerHTML={{ __html: question }}>
                </div>
            </div>
            <div className={`question__options ${locked !== -1 && usingDoubleDip !== 2 ? "question__options--disabled" : ''}`}>
                {options.map((option, index) => {
                    return (
                        <div 
                            className={getAnswerClass(index) + ' question__option'} 
                            key={index} 
                            onClick={() => onLocked(index)} 
                            dangerouslySetInnerHTML={{ __html: option }}>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default Question;