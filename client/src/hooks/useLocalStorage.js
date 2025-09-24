import { useEffect, useRef, useState } from 'react';

export function useLocalStorage(key, initialValue) {
	const isMountedRef = useRef(false);
	const [value, setValue] = useState(() => {
		try {
			const item = localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch {
			return initialValue;
		}
	});

	useEffect(() => {
		if (!isMountedRef.current) {
			isMountedRef.current = true;
			return;
		}
		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch (e) {
			console.error(e);
		}
	}, [key, value]);

	return [value, setValue];
}
