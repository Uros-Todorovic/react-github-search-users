import React, { useState, useEffect, useContext } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
	const [githubUser, setGithubUser] = useState(mockUser);
	const [repos, setRepos] = useState(mockRepos);
	const [followers, setFollowers] = useState(mockFollowers);

	const [requests, setRequests] = useState({ remaining: 0, reset: 0 });
	const [isLoading, setisLoading] = useState(false);

	const [error, setError] = useState({ show: false, msg: '' });

	const searchGithubUser = async (user) => {
		toggleError();
		setisLoading(true);
		const response = await axios.get(`${rootUrl}/users/${user}`).catch((err) => {
			console.log(err);
		});
		if (response) {
			setGithubUser(response.data);
			const { login, followers_url } = response.data;
			await Promise.allSettled([
				axios(`${rootUrl}/users/${login}/repos?per_page=100`),
				axios(`${followers_url}?per_page=100`),
			]).then((results) => {
				const [repos, followers] = results;
				const STATUS = 'fulfilled';
				if (repos.status === STATUS) {
					setRepos(repos.value.data);
				}
				if (followers.status === STATUS) {
					setFollowers(followers.value.data);
				}
			});
		} else {
			toggleError(true, 'There is no user with that username');
		}
		setisLoading(false);
		checkRequests();
	};

	const checkRequests = () => {
		axios
			.get(`${rootUrl}/rate_limit`)
			.then(({ data }) => {
				let {
					rate: { remaining, reset },
				} = data;
				const resetTime = new Date(reset * 1000);
				setRequests({ remaining, reset: resetTime.toLocaleTimeString() });
				if (remaining === 0) {
					toggleError(true, 'Sorry you have exceeded your hourly rate limit');
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const toggleError = (show = false, msg = '') => {
		setError({ show, msg });
	};

	useEffect(checkRequests, []);

	return (
		<AppContext.Provider value={{ githubUser, repos, followers, requests, error, isLoading, searchGithubUser }}>
			{children}
		</AppContext.Provider>
	);
};

export const useGlobalContext = () => {
	return useContext(AppContext);
};

export { AppContext, AppProvider };
