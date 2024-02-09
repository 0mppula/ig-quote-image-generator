import { Button } from './components/ui/button';
import './global.css';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createRef, useState } from 'react';
// @ts-ignore
import { useScreenshot, createFileName } from 'use-react-screenshot';
import { cn } from './lib/utils';

function App() {
	const [quoteData, setQuoteData] = useState({
		quote: '',
		author: '',
		textColor: '#1B1B1B',
		bgColor: '#FFFFFF',
	});

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

	const downloadScreenshot = () => takeScreenShot(ref.current).then(download);

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

	return (
		<div className="container flex flex-col gap-4 items-center justify-center min-h-svh w-[604px] lg:w-[1000px] xl:w-[1160px]">
			<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center mb-0 lg:mb-4">
				Generate Quote
			</h1>

			<div className="flex w-full flex-col lg:flex-row gap-4 lg:gap-8">
				<Card
					ref={ref}
					className={cn(
						'relative w-[540px] h-[540px] flex-shrink-0 border-none rounded-none outline-1 outline-dashed outline-muted-foreground'
					)}
					style={{
						backgroundColor: quoteData.bgColor,
						fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif',
					}}
				>
					<div className="p-8 inset-0 absolute flex flex-col justify-center">
						{quoteData.quote && (
							<h2
								className="break-words w-full scroll-m-20 text-4xl font-semibold"
								style={{
									color: quoteData.textColor,
								}}
							>
								“{quoteData.quote}”
							</h2>
						)}

						{/* Author */}
						{quoteData.author && (
							<p
								className="font-semibold text-right w-full scroll-m-20 mt-8 text-2xl tracking-tight italic"
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
							placeholder="Marcus Aurelius"
							value={quoteData.author}
							onChange={(e) =>
								setQuoteData((prev) => ({ ...prev, author: e.target.value }))
							}
						/>
					</div>

					<Button className="w-full" onClick={downloadScreenshot}>
						Download Image
					</Button>
				</div>
			</div>
		</div>
	);
}

export default App;
