import {useEffect, useState} from 'react';
import {useCerbos} from '@cerbos/react';

import courseService from '../services/courseService';

const useCourses = () => {
	const cerbos = useCerbos();

	const [courses, setCourses] = useState([]);
	const [error, setError] = useState('');
	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);

		courseService
			.getAllCourses()
			.then(async res => {
				// Filter courses based on authorization
				const authorizedCourses = await Promise.all(
					res.data.map(async course => {
						const check = await cerbos.checkResource({
							resource: {
								kind: 'course',
								id: course.id,
								attr: JSON.parse(JSON.stringify(course)),
							},
							actions: ['view', 'update', 'delete'],
						});
						return (
							check.isAllowed('view') && {
								...course,
								canUpdate: check.isAllowed('update'),
								canDelete: check.isAllowed('delete'),
							}
						);
					})
				);

				// console.log(authorizedCourses); HTTP
				// Set the courses state with the filtered courses
				setCourses(authorizedCourses.filter(Boolean));
				// setCourses(res.data);
			})
			.catch(error => {
				setError(error.message);
			})
			.finally(() => {
				setTimeout(() => {
					setLoading(false);
				}, 1000);
			});
	}, [cerbos]);

	return {courses, error, isLoading, setCourses, setError};
};

export default useCourses;
