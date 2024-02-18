import { Card } from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { createRef, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './components/ui/button';
import './global.css';
// @ts-ignore
import { createFileName, useScreenshot } from 'use-react-screenshot';
import { z } from 'zod';
import { cn } from './lib/utils';

const formSchema = z.object({
	quote: z.string().max(255),
	author: z.string().max(64),
	textColor: z.string(),
	bgColor: z.string(),
	quoteAppendix: z.string(),
});

type formSchemaType = z.infer<typeof formSchema>;

const defaultQuoteData: formSchemaType = {
	quote: 'When you arise in the morning, think of what a precious privilege it is to be alive - to breathe, to think, to enjoy, to love.',
	author: 'Marcus Aurelius',
	textColor: '#1B1B1B',
	bgColor: '#FAFAFA',
	quoteAppendix: 'Follow @lifeforcequotes for more!',
};

function App() {
	const [isCopied, setIsCopied] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const ref = createRef<HTMLDivElement>();

	// Reset the isCopied state after 2 seconds
	useEffect(() => {
		if (isCopied) {
			const timeout = setTimeout(() => {
				setIsCopied(false);
			}, 2000);

			return () => clearTimeout(timeout);
		}
	}, [isCopied]);

	useEffect(() => {
		if (!isLoading && ref.current) {
			const resetRefScale = (ref: any) => {
				ref.style.transform = 'none';
				ref.style.fontSize = 'inherit';
			};

			resetRefScale(ref.current);
		}
	}, [isLoading]);

	const getQuoteDataFromLocalStorage = () => {
		const data = localStorage.getItem('quoteData');

		if (data) {
			try {
				const parsedData = JSON.parse(data);

				return formSchema.parse(parsedData);
			} catch (error) {
				return defaultQuoteData;
			}
		} else {
			return defaultQuoteData;
		}
	};

	const saveQuoteDataToLocalStorage = (data: any) => {
		localStorage.setItem('quoteData', JSON.stringify(data));
	};

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: getQuoteDataFromLocalStorage(),
	});

	const textColor = form.watch('textColor');
	const bgColor = form.watch('bgColor');
	const quote = form.watch('quote');
	const author = form.watch('author');
	const quoteAppendix = form.watch('quoteAppendix');

	function onSubmit(values: z.infer<typeof formSchema>) {
		const trimmedValues = {
			quote: values.quote.replace(/[“""”]/g, '').trim(),
			author: values.author.trim(),
			textColor: values.textColor.trim(),
			bgColor: values.bgColor.trim(),
			quoteAppendix: values.quoteAppendix.trim(),
		};

		form.setValue('quote', trimmedValues.quote);
		form.setValue('author', trimmedValues.author);
		form.setValue('textColor', trimmedValues.textColor);
		form.setValue('bgColor', trimmedValues.bgColor);
		form.setValue('quoteAppendix', trimmedValues.quoteAppendix);

		downloadScreenshot();
		saveQuoteDataToLocalStorage(trimmedValues);
	}

	const [_, takeScreenShot] = useScreenshot({
		type: 'image/jpeg',
		quality: 4.0,
	});

	const download = (image: any, { name = author.trim(), extension = 'jpg' } = {}) => {
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

		form.setValue(field as 'textColor' | 'bgColor', hex.toUpperCase());
	};

	const handleHexBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		let field = e.target.name;
		let hex = e.target.value.trim(); // Trim any leading or trailing space

		// Remove dubplicate # if present.
		hex = hex.replace(/#/g, '');

		// Add # to start if one is not present.
		if (!hex.startsWith('#')) {
			hex = '#' + hex;
		}

		// Check if it's a valid hex color. If not, set it to white
		if (!/^#[0-9A-F]{3,6}$/i.test(hex)) {
			hex = '#ffffff';
		}

		form.setValue(field as 'textColor' | 'bgColor', hex.toUpperCase());
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

	const handleFullQuoteCopy = () => {
		let fullQuote = '“' + quote.replace(/[“""”]/g, '').trim() + '”' + '”';

		if (author) {
			fullQuote += '\n\n- ' + author;
		}

		if (quoteAppendix) {
			fullQuote += '\n\n' + quoteAppendix;
		}

		navigator.clipboard.writeText(fullQuote);
		setIsCopied(true);
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
					style={{ backgroundColor: bgColor }}
				>
					<div className="p-8 inset-0 absolute flex flex-col justify-center">
						{quote.replace(/[“""”]/g, '').trim() && (
							<h2
								className="break-words w-full scroll-m-20 text-2xl sm:text-4xl leading-8 sm:leading-[2.75rem] font-semibold"
								style={{
									color: textColor,
									fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif',
								}}
							>
								“{quote.replace(/[“""”]/g, '').trim()}”
							</h2>
						)}

						{/* Author */}
						{author.trim() && (
							<p
								className="font-semibold text-right w-full scroll-m-20 mt-8 text-xl sm:text-2xl tracking-tight italic break-words"
								style={{
									color: textColor,
								}}
							>
								- {author.trim()}
							</p>
						)}
					</div>
				</Card>

				<Form {...form}>
					<form
						className="w-full flex flex-col gap-4"
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<div className="flex gap-4 w-full">
							<div className="w-full">
								<FormField
									control={form.control}
									name="bgColor"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="mb-2 block">
												Background color
											</FormLabel>

											<FormControl>
												<Input
													placeholder="#ffffff"
													{...field}
													onBlur={(e) => handleHexBlur(e)}
													onChange={(e) => handleHexChange(e)}
												/>
											</FormControl>

											<FormDescription className="sr-only">
												Sets the background color for the quote.
											</FormDescription>
										</FormItem>
									)}
								/>
							</div>

							<div className="w-full">
								<FormField
									control={form.control}
									name="textColor"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="mb-2 block">Text color</FormLabel>

											<FormControl>
												<Input
													placeholder="#1b1b1b"
													{...field}
													onBlur={(e) => handleHexBlur(e)}
													onChange={(e) => handleHexChange(e)}
												/>
											</FormControl>

											<FormDescription className="sr-only">
												Sets the text color for the quote.
											</FormDescription>
										</FormItem>
									)}
								/>
							</div>
						</div>

						<div className="w-full">
							<FormField
								control={form.control}
								name="quote"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-left w-full mb-2 block">
											Quote
										</FormLabel>

										<FormControl>
											<Textarea
												placeholder="When you arise in the morning, think of what a precious privilege it is to be alive - to breathe, to think, to enjoy, to love."
												{...field}
												rows={5}
												maxLength={255}
												onBlur={(e) =>
													form.setValue('quote', e.target.value.trim())
												}
											/>
										</FormControl>

										<FormDescription className="text-right w-full">
											{quote.length} / 255
										</FormDescription>
									</FormItem>
								)}
							/>
						</div>

						<div className="w-full">
							<FormField
								control={form.control}
								name="author"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="mb-2 block">Author</FormLabel>

										<FormControl>
											<Input
												maxLength={64}
												placeholder="Marcus Aurelius"
												{...field}
												onBlur={(e) =>
													form.setValue('author', e.target.value.trim())
												}
											/>
										</FormControl>

										<FormDescription className="text-right w-full">
											{author.length} / 64
										</FormDescription>
									</FormItem>
								)}
							/>
						</div>

						<div className="w-full">
							<FormField
								control={form.control}
								name="quoteAppendix"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="mb-2 block">Quote Appendix</FormLabel>

										<FormControl>
											<Input
												placeholder="Follow @lifeforcequotes for more!"
												{...field}
												onBlur={(e) =>
													form.setValue(
														'quoteAppendix',
														e.target.value.trim()
													)
												}
											/>
										</FormControl>

										<FormDescription className="text-right w-full">
											A short text to append to the quote. This will be
											visible only when the quote is copied. (Optional)
										</FormDescription>
									</FormItem>
								)}
							/>
						</div>

						<div className="w-full flex gap-2 flex-col xs:flex-row">
							<Button type="submit" className="w-full">
								Download Image
							</Button>

							<Button type="button" className="w-full" onClick={handleFullQuoteCopy}>
								{isCopied ? 'Copied!' : 'Copy Full Quote'}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}

export default App;
