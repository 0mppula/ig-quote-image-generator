import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { TooltipProvider } from './components/ui/tooltip.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<TooltipProvider>
			<App />
		</TooltipProvider>
	</React.StrictMode>
);
