import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import reportWebVitals from './reportWebVitals';
import AppRoutes from './view/appRoute';
import store from "./viewHelper/store";
import 'semantic-ui-css/semantic.min.css'
import "./index.scss"

ReactDOM.render(
    <Provider store={store}>
      <AppRoutes />
    </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
