const numToWords = {
    1_000: '1 thousand',
    2_000: '2 thousand',
    3_000: '3 thousand',
    5_000: '5 thousand',
    10_000: '10 thousand',
    20_000: '20 thousand',
    40_000: '40 thousand',
    80_000: '80 thousand',
    1_60_000: '1 lakh 60 thousand',
    3_20_000: '3 lakh 20 thousand',
    6_40_000: '6 lakh 40 thousand',
    12_50_000: '12 lakh 50 thousand',
    25_00_000: '25 lakh',
    50_00_000: '50 lakh',
    75_00_000: '75 lakh',
    1_00_00_000: '1 crore',
    7_50_00_000: '7 crore 50 lakh'
}
function QuestionList({ questions, current }) {
    const isMilestone = (index) => (index + 1) % 5 === 0;
    const getQuestionClass = (index, current) => {
        if (index < current) {
            return 'question-list__question--answered';
        } else if (index === current) {
            return 'question-list__question--current';
        } else if (isMilestone(index)) {
            return 'question-list__question--milestone';
        } else {
            return 'question-list__question--unanswered';
        }
    }

    const inWords = (num) => {
        return numToWords[num];
    }
    return (
        <table className="milestone_table">
            <tbody>
                <tr>
                    <th>Q. No.</th>
                    <th>Prize Money</th>
                    <th>Prize in words</th>
                </tr>
                {questions.map((question, index) => (
                    <tr key={index} className={getQuestionClass(index, current)+' question-list__question'}>
                        <td>{index + 1}</td>
                        <td>{question}</td>
                        <td>{inWords(question)}</td>
                    </tr>
                )).slice(0).reverse()}
            </tbody>
        </table>
    );
}

export default QuestionList;