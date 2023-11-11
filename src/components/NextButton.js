function NextButton({ dispatch, answer }) {
	if (answer === null) return null;
	return (
		<button
			className="btn btn-ui"
			onClick={() => {
				dispatch({ type: "nextQuestion" });
			}}
		>
			Next &rarr;
		</button>
	);
}

export default NextButton;
