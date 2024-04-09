import {useEffect, useState} from 'react';
import {useCerbos} from '@cerbos/react';

import courseService from '../services/courseService';

const useCourses = () => {
	const cerbos = useCerbos();

	const [courses, setCourses] = useState([]);
	const [error, setError] = useState('');
	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
		console.log('Fetching courses...');
		setLoading(true);

		courseService
			.getAllCourses()
			.then(async res => {
				console.log('Courses retrieved:', res.data);
				// Filter courses based on authorization
				const authorizedCourses = await Promise.all(
					res.data.map(async course => {
						console.log('Checking authorization for course:', course.id);
						const check = await cerbos.checkResource({
							resource: {
								kind: 'course',
								id: course.id,
								attr: JSON.parse(JSON.stringify(course)),
							},
							actions: ['view', 'update', 'delete'],
						});
						console.log(
							'Authorization check result for course',
							course.id,
							':',
							check
						);

						return (
							check.isAllowed('view') && {
								...course,
								canUpdate: check.isAllowed('update'),
								canDelete: check.isAllowed('delete'),
							}
						);
					})
				);

				console.log('Authorized courses:', authorizedCourses);
				// Set the courses state with the filtered courses
				setCourses(authorizedCourses.filter(Boolean));
			})
			.catch(error => {
				console.error(
					'Error during course retrieval or authorization check:',
					error
				);
				setError(error.message);
			})
			.finally(() => {
				console.log('Course fetching completed.');
				setLoading(false);
			});
	}, [cerbos]);

	console.log('Returning courses:', courses);
	return {courses, error, isLoading, setCourses, setError};
};

export default useCourses;
