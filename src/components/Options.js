import { useQuiz } from "../contexts/QuizContext";

function Options() {
	const { questions, dispatch, answer, index } =
		useQuiz();
	const question = questions[index];

	const hasAnswered = answer !== null;

	return (
		<div>
			<div className="options">
				{question.options.map((option, index) => {
					return (
						<button
							className={`btn btn-option ${
								index === answer ? "answer" : ""
							} ${
								hasAnswered
									? index ===
									  question.correctOption
										? "correct"
										: "wrong"
									: ""
							}`}
							key={option}
							disabled={hasAnswered}
							onClick={() => {
								dispatch({
									type: "newAnswer",
									payload: index,
								});
							}}
						>
							{option}
						</button>
					);
				})}
			</div>
		</div>
	);
}

export default Options;
