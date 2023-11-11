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
import { useEffect, useReducer } from "react";

const SECS_PER_QUESTION = 30;

const initialState = {
	questions: [],
	// 'loading' | 'error' | 'ready' | 'active' | 'finished'
	status: "loading",
	index: 0,
	answer: null,
	points: 0,
	highScore: 0,
	secondsRemaining: null,
};

function reducer(state, action) {
	switch (action.type) {
		case "dataReceived":
			return {
				...state,
				questions: action.payload,
				status: "ready",
			};

		case "dataFailed":
			return {
				...state,
				status: "error",
			};

		case "start":
			return {
				...state,
				status: "active",
				secondsRemaining:
					state.questions.length *
					SECS_PER_QUESTION,
			};

		case "newAnswer":
			const question = state.questions.at(
				state.index
			);
			return {
				...state,
				answer: action.payload,
				points:
					action.payload ===
					question.correctOption
						? state.points + question.points
						: state.points,
			};

		case "nextQuestion":
			console.log(state);
			return {
				...state,
				index: state.index + 1,
				answer: null,
			};

		case "finish":
			return {
				...state,
				status: "finished",
				highScore:
					state.points > state.highScore
						? state.points
						: state.highScore,
			};

		case "restart":
			return {
				...state,
				status: "ready",
				index: 0,
				answer: null,
				points: 0,
				secondsRemaining: 10,
			};

		case "tick":
			return {
				...state,
				secondsRemaining:
					state.secondsRemaining - 1,
				status:
					state.secondsRemaining === 0
						? "finished"
						: state.status,
			};

		default:
			throw new Error("Action unknown");
	}
}

function App() {
	const [
		{
			questions,
			status,
			index,
			answer,
			points,
			highScore,
			secondsRemaining,
		},
		dispatch,
	] = useReducer(reducer, initialState);

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
	}, []);

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
						dispatch={dispatch}
					/>
				)}
				{status === "active" && (
					<>
						<Progress
							index={index}
							numQuestions={numQuestions}
							maxPoints={maxPoints}
							points={points}
							answer={answer}
						></Progress>
						<Question
							question={questions[index]}
							dispatch={dispatch}
							answer={answer}
						/>
						<Footer>
							<Timer
								dispatch={dispatch}
								secondsRemaining={
									secondsRemaining
								}
							/>
							<NextButton
								dispatch={dispatch}
								answer={answer}
								numQuestions={numQuestions}
								index={index}
							/>
						</Footer>
					</>
				)}
				{status === "finished" && (
					<FinishScreen
						dispatch={dispatch}
						points={points}
						maxPoints={maxPoints}
						highScore={highScore}
					/>
				)}
			</Main>
		</div>
	);
}

export default App;
