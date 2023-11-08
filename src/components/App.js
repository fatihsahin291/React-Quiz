import Main from "./Main";
import Header from "./Header";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import { useEffect, useReducer } from "react";

const initialState = {
	questions: [],
	// 'loading' | 'error' | 'ready' | 'active' | 'finished'
	status: "loading",
	index: 0,
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

		default:
			throw new Error("Action unknown");
	}
}

export default function App() {
	const [{ questions, status, index }, dispatch] =
		useReducer(reducer, initialState);

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
			});
	}, []);

	const numQuestions = questions.length;

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
					<Question question={questions[index]} />
				)}
			</Main>
		</div>
	);
}