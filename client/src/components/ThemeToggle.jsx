import { useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function ThemeToggle() {
	const [theme, setTheme] = useLocalStorage('theme', 'light');

	useEffect(() => {
		const root = document.documentElement;
		if (theme === 'dark') root.classList.add('dark');
		else root.classList.remove('dark');
	}, [theme]);

	return (
		<button className="theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
			{theme === 'light' ? '🌞' : '🌙'}
		</button>
	);
}
