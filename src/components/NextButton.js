import { useQuiz } from "../contexts/QuizContext";

function NextButton({ numQuestions }) {
	const { dispatch, answer, index } = useQuiz();

	if (answer === null) return null;
	if (index < numQuestions - 1) {
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
	if (index === numQuestions - 1) {
		return (
			<button
				className="btn btn-ui"
				onClick={() => {
					dispatch({ type: "finish" });
				}}
			>
				Finish Quiz
			</button>
		);
	}
}

export default NextButton;
