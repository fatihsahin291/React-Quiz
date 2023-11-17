import { useQuiz } from "../contexts/QuizContext";

function Progress({ numQuestions, maxPoints }) {
	const { index, points, answer } = useQuiz();

	return (
		<header className="progress">
			<progress
				value={index + Number(answer !== null)}
				max={numQuestions}
			/>
			<p>
				Question <strong>{index + 1}</strong> /{" "}
				{numQuestions}
			</p>
			<p>
				<strong>{points}</strong> / {maxPoints}
			</p>
		</header>
	);
}

export default Progress;
