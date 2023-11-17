import Main from "./Main";
import Header from "./Header";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";
import { useEffect } from "react";
import { useQuiz } from "../contexts/QuizContext";

function App() {
	const { questions, status, dispatch } =
		useQuiz();

	useEffect(() => {
		fetch("http://localhost:5000/questions")
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				dispatch({
					type: "dataReceived",
					payload: data,
				});
			})
			.catch((error) => {
				dispatch({
					type: "dataFailed",
				});
				console.log(error);
			});
	}, [dispatch]);

	const numQuestions = questions.length;
	const maxPoints = questions.reduce(
		(prev, cur) => {
			return prev + cur.points;
		},
		0
	);

	return (
		<div className="app">
			<Header />
			<Main className="main">
				{status === "loading" && <Loader />}
				{status === "error" && <Error />}
				{status === "ready" && (
					<StartScreen
						numQuestions={numQuestions}
					/>
				)}
				{status === "active" && (
					<>
						<Progress
							numQuestions={numQuestions}
							maxPoints={maxPoints}
						></Progress>
						<Question />
						<Footer>
							<Timer />
							<NextButton
								numQuestions={numQuestions}
							/>
						</Footer>
					</>
				)}
				{status === "finished" && (
					<FinishScreen maxPoints={maxPoints} />
				)}
			</Main>
		</div>
	);
}

export default App;
