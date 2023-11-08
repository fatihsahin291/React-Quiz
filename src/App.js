import Main from "./Main";
import Header from "./Header";
import { useEffect, useReducer } from "react";

const initialState = {
	questions: [],
	// 'loading' | 'error' | 'ready' | 'active' | 'finished'
	status: "loading",
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

		default:
			throw new Error("Action unknown");
	}
}

export default function App() {
	const [state, dispatch] = useReducer(
		reducer,
		initialState
	);

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

	return (
		<div className="app">
			<Header />
			<Main className="main">
				<p>1/15</p>
				<p>Question?</p>
			</Main>
		</div>
	);
}
