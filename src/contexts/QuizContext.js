import {
	createContext,
	useContext,
	useReducer,
} from "react";

const QuizContext = createContext();

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
			console.log(state);
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

function QuizProvider({ children }) {
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

	return (
		<QuizContext.Provider
			value={{
				questions,
				status,
				index,
				answer,
				points,
				highScore,
				secondsRemaining,
				dispatch,
			}}
		>
			{children}
		</QuizContext.Provider>
	);
}

function useQuiz() {
	const context = useContext(QuizContext);
	if (context === undefined) {
		throw new Error(
			"useQuiz must be used within a QuizProvider"
		);
	}
	return context;
}

export { QuizProvider, useQuiz };
