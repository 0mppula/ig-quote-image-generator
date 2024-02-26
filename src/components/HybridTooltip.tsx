import useTouch from '@/hooks/useTouch';
import { PopoverContentProps, PopoverProps, PopoverTriggerProps } from '@radix-ui/react-popover';
import { TooltipContentProps, TooltipProps, TooltipTriggerProps } from '@radix-ui/react-tooltip';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export const HybridTooltip = (props: TooltipProps & PopoverProps) => {
	const isTouch = useTouch();

	return isTouch ? <Popover {...props} /> : <Tooltip {...props} />;
};

export const HybridTooltipTrigger = (props: TooltipTriggerProps & PopoverTriggerProps) => {
	const isTouch = useTouch();

	return isTouch ? <PopoverTrigger {...props} /> : <TooltipTrigger {...props} />;
};

export const HybridTooltipContent = (props: TooltipContentProps & PopoverContentProps) => {
	const isTouch = useTouch();

	return isTouch ? <PopoverContent {...props} /> : <TooltipContent {...props} />;
};
