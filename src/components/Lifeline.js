function Lifeline(props) {
    const { lifelines, onClick } = props;
    const getLifelineImage = (name) => {
        return `/assets/images/${name}.png`;
    }
    const getLifelineClass = (isDisabled) => {
        return (isDisabled) ? 'lifeline__item--disabled' : 'lifeline__item--enabled';
    }
    const renderLifelines = () => {
        console.log(lifelines);
        return lifelines.map((lifeline, index) => {
            const lifelineName = lifeline.name;
            const isDisabled = lifeline.isDisabled;
            return (
                <div 
                    className={"lifeline__item "+getLifelineClass(isDisabled)} 
                    key={index}
                    onClick={()=>onClick(index)}>
                    <img 
                        className="lifeline__img"
                        src={getLifelineImage(lifelineName)} 
                        alt={lifelineName} />
                </div>
            )
        })
    }

    return (
        <div className="lifeline__container">
            {renderLifelines()}
        </div>
    )
}

export default Lifeline;