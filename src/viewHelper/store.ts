

import { createStore, applyMiddleware, compose} from "redux";
import thunk from "redux-thunk";
import reducer from "./reducer";

declare global {
	interface Window {
		__REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any
	}
}
const initialState = {};

const middleware = [thunk];

const composer = window["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"] || compose;

const store = createStore(
	reducer,
	initialState,
	composer(
		applyMiddleware(...middleware)
	)
);

export default store;