import { Button } from './components/ui/button';
import './global.css';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createRef, useEffect, useState } from 'react';
// @ts-ignore
import { createFileName, useScreenshot } from 'use-react-screenshot';
import { cn } from './lib/utils';

function App() {
	const [isLoading, setIsLoading] = useState(false);
	const [quoteData, setQuoteData] = useState({
		quote: 'When you arise in the morning, think of what a precious privilege it is to be alive - to breathe, to think, to enjoy, to love.',
		author: 'Marcus Aurelius',
		textColor: '#1B1B1B',
		bgColor: '#FAFAFA',
		quoteAppendix: 'Follow @lifeforcequotes for more!',
	});

	useEffect(() => {
		if (!isLoading && ref.current) {
			resetRefScale(ref.current);
		}
	}, [isLoading]);

	const ref = createRef<HTMLDivElement>();

	const [_, takeScreenShot] = useScreenshot({
		type: 'image/jpeg',
		quality: 4.0,
	});

	const download = (image: any, { name = quoteData.author.trim(), extension = 'jpg' } = {}) => {
		const a = document.createElement('a');
		a.href = image;
		a.download = createFileName(extension, name);
		a.click();
	};

	const downloadScreenshot = () =>
		takeScreenShot(scaleRef(ref.current, 2))
			.then(download)
			.finally(() => {
				setIsLoading(false);
			});

	const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let field = e.target.name;
		let hex = e.target.value.trim(); // Trim any leading or trailing spaces

		setQuoteData((prev) => ({
			...prev,
			[field]: hex,
		}));
	};

	const handleHexBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		let field = e.target.name;
		let hex = e.target.value.trim(); // Trim any leading or trailing space

		// Remove dubplicate # if present
		hex = hex.replace(/#/g, '');

		if (!hex.startsWith('#')) {
			hex = '#' + hex; // Add # prefix if it's not present
		}

		if (hex === '#') {
			hex = '#ffffff';
		}

		setQuoteData((prev) => ({
			...prev,
			[field]: hex.toUpperCase(),
		}));
	};

	const scaleRef = (ref: any, scaleFactor: number) => {
		setIsLoading(true);
		// Apply CSS transformations to scale the element
		ref.style.transform = `scale(${scaleFactor})`;

		// Scale font size if necessary
		const currentFontSize = window.getComputedStyle(ref).fontSize;
		const scaledFontSize = parseFloat(currentFontSize) * scaleFactor;
		ref.style.fontSize = `${scaledFontSize}px`;

		return ref;
	};

	const resetRefScale = (ref: any) => {
		ref.style.transform = 'none';
		ref.style.fontSize = 'inherit';
	};

	const handleFullQuoteCopy = () => {
		let fullQuote = quoteData.quote;

		if (quoteData.author) {
			fullQuote += '\n\n- ' + quoteData.author;
		}

		if (quoteData.quoteAppendix) {
			fullQuote += '\n\n' + quoteData.quoteAppendix;
		}

		navigator.clipboard.writeText(fullQuote);
	};

	return (
		<div className="container px-4 sm:px-8 flex flex-col gap-4 items-center justify-center min-h-svh w-full sm:w-[604px] lg:w-[1000px] xl:w-[1160px] py-4 lg:py-8 relative">
			{/* Loading overlay */}
			{isLoading && (
				<div className="absolute inset-0 scale-[2] lg:scale-150 bg-white z-50 flex items-center justify-center">
					<div className="animate-spin rounded-full h-12 lg:h-16 w-12 lg:w-16 border-t-2 border-b-2 border-primary"></div>
				</div>
			)}

			<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center mb-0 lg:mb-4">
				Generate Quote
			</h1>

			<div className="flex w-full flex-col lg:flex-row gap-4 lg:gap-8">
				<Card
					ref={ref}
					className={cn(
						'relative w-[calc(100svw-2rem)] h-[calc(100svw-2rem)] sm:w-[540px] sm:h-[540px] flex-shrink-0 border-none rounded-none outline-1 outline-dashed outline-muted-foreground'
					)}
					style={{ backgroundColor: quoteData.bgColor }}
				>
					<div className="p-8 inset-0 absolute flex flex-col justify-center">
						{quoteData.quote && (
							<h2
								className="break-words w-full scroll-m-20 text-2xl sm:text-4xl leading-8 sm:leading-[2.75rem] font-semibold"
								style={{
									color: quoteData.textColor, // Quote font
									fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif',
								}}
							>
								“{quoteData.quote}”
							</h2>
						)}

						{/* Author */}
						{quoteData.author && (
							<p
								className="font-semibold text-right w-full scroll-m-20 mt-8 text-xl sm:text-2xl tracking-tight italic break-words"
								style={{
									color: quoteData.textColor,
								}}
							>
								- {quoteData.author.trim()}
							</p>
						)}
					</div>
				</Card>

				<div className="w-full flex flex-col gap-4">
					<div className="flex gap-4 w-full">
						<div className="w-full">
							<Label className="mb-2 block" htmlFor="bgColor">
								Background color
							</Label>

							<Input
								id="bgColor"
								name="bgColor"
								placeholder="#ffffff"
								value={quoteData.bgColor}
								onBlur={(e) => handleHexBlur(e)}
								onChange={(e) => handleHexChange(e)}
							/>
						</div>

						<div className="w-full">
							<Label className="mb-2 block" htmlFor="textColor">
								Text color
							</Label>

							<Input
								name="textColor"
								id="textColor"
								placeholder="#1b1b1b"
								value={quoteData.textColor}
								onBlur={(e) => handleHexBlur(e)}
								onChange={(e) => handleHexChange(e)}
							/>
						</div>
					</div>

					<div className="w-full">
						<Label className="text-left w-full mb-2 block" htmlFor="quote">
							Quote
						</Label>

						<Textarea
							name="quote"
							rows={5}
							maxLength={255}
							value={quoteData.quote}
							onChange={(e) =>
								setQuoteData((prev) => ({ ...prev, quote: e.target.value }))
							}
							id="quote"
							placeholder="When you arise in the morning, think of what a precious privilege it is to be alive - to breathe, to think, to enjoy, to love."
						/>
					</div>

					<div className="w-full">
						<Label className="mb-2 block" htmlFor="author">
							Author
						</Label>

						<Input
							id="author"
							name="author"
							maxLength={64}
							placeholder="Marcus Aurelius"
							value={quoteData.author}
							onChange={(e) =>
								setQuoteData((prev) => ({ ...prev, author: e.target.value }))
							}
						/>
					</div>

					<div className="w-full">
						<Label className="mb-2 block" htmlFor="quoteAppendix">
							Quote Appendix
						</Label>

						<Input
							id="quoteAppendix"
							name="quoteAppendix"
							maxLength={64}
							placeholder="Follow @lifeforcequotes for more!"
							value={quoteData.quoteAppendix}
							onChange={(e) =>
								setQuoteData((prev) => ({ ...prev, quoteAppendix: e.target.value }))
							}
						/>
					</div>

					<div className="w-full flex gap-2 flex-col xs:flex-row">
						<Button className="w-full" onClick={downloadScreenshot}>
							Download Image
						</Button>

						<Button className="w-full" onClick={handleFullQuoteCopy}>
							Copy Full Quote
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
