import Main from "./Main";
import Header from "./Header";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import { useEffect, useReducer } from "react";

const initialState = {
	questions: [],
	// 'loading' | 'error' | 'ready' | 'active' | 'finished'
	status: "loading",
	index: 0,
	answer: null,
	points: 0,
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

		default:
			throw new Error("Action unknown");
	}
}

function App() {
	const [
		{ questions, status, index, answer, points },
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
						<NextButton
							dispatch={dispatch}
							answer={answer}
						/>
					</>
				)}
			</Main>
		</div>
	);
}

export default App;
