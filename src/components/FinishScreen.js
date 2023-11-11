function FinishScreen({
	dispatch,
	points,
	maxPoints,
	highScore,
}) {
	const percentage = Math.round(
		(points / maxPoints) * 100
	);

	let emoji;

	if (percentage === 100) {
		emoji = "🎖️";
	} else if (
		percentage > 80 &&
		percentage < 100
	) {
		emoji = "🏆";
	} else if (percentage > 60 && percentage < 80) {
		emoji = "😊";
	} else if (percentage > 40 && percentage < 60) {
		emoji = "😒";
	} else {
		emoji = "🤬";
	}

	return (
		<>
			<div className="result">
				<p>
					<span>{emoji}</span> You Scored{" "}
					<strong>{points}</strong> Out Of{" "}
					<strong>{maxPoints}</strong> (
					{percentage}
					%)
				</p>
			</div>
			<p className="highscore">
				(High Score: {highScore} Points)
			</p>
			<button
				className="btn btn-ui"
				onClick={() => {
					dispatch({ type: "restart" });
				}}
			>
				Restart Quiz
			</button>
		</>
	);
}

export default FinishScreen;
