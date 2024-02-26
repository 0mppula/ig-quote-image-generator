import { TouchContext } from '@/providers/TouchProvider';
import { useContext } from 'react';

const useTouch = () => {
	const context = useContext(TouchContext);

	if (context === undefined) {
		console.error('useTouch must be used within a TouchProvider');
	}

	return context;
};

export default useTouch;
