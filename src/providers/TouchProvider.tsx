import { PropsWithChildren, createContext, useState } from 'react';

export const TouchContext = createContext<boolean | undefined>(undefined);

const TouchProvider = (props: PropsWithChildren) => {
	const [isTouch, _] = useState<boolean>(window.matchMedia('(pointer: coarse)').matches);

	return <TouchContext.Provider value={isTouch} {...props} />;
};

export default TouchProvider;
