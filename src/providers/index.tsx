import { TooltipProvider } from '@/components/ui/tooltip';
import { PropsWithChildren } from 'react';
import TouchProvider from './TouchProvider';

const Providers = ({ children }: PropsWithChildren) => {
	return (
		<TouchProvider>
			<TooltipProvider>{children}</TooltipProvider>
		</TouchProvider>
	);
};

export default Providers;
