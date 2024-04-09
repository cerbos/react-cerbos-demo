import {HTTP as Cerbos} from '@cerbos/http';
// import { Embedded as Cerbos } from "@cerbos/embedded";

import {CerbosProvider} from '@cerbos/react';

import {Route, Routes} from 'react-router-dom';
import {HomePage, CoursesPage} from './Pages';

const client = new Cerbos('http://localhost:3592');

const App = () => {
	return (
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="/courses/*" element={<ProtectedCoursesPage />} />
		</Routes>
	);
};

export default App;

import userService from './services/userService';
import {getAccessToken} from './services/tokenStroge';

const ProtectedCoursesPage = () => {
	const currentUser = userService.getUserId(getAccessToken());
	console.log(userService.getUserId(getAccessToken()));

	return (
		<CerbosProvider
			client={client}
			principal={{
				id: currentUser?.id,
				roles: currentUser?.roles,
			}}
		>
			<Routes>
				<Route path="/" element={<CoursesPage />} />
			</Routes>
		</CerbosProvider>
	);
};
