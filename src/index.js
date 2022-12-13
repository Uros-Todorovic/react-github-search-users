import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { AppProvider } from './context/context';
import { Auth0Provider } from '@auth0/auth0-react';

// dev-qi4ss6o4dds53a8w.us.auth0.com
// SdnVasB294bbRtBePB9iilOagusAS4En

ReactDOM.render(
	<React.StrictMode>
		<Auth0Provider
			domain="dev-qi4ss6o4dds53a8w.us.auth0.com"
			clientId="SdnVasB294bbRtBePB9iilOagusAS4En"
			redirectUri={window.location.origin}
			cacheLocation="localstorage"
		>
			<AppProvider>
				<App />
			</AppProvider>
		</Auth0Provider>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
