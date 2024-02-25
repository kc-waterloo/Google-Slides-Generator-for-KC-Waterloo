/**
 * create-long-quote-slides/index.ts
 *
 * Created by Min-Kyu Lee on 23-02-2024
 * Copyright © 2024 Min-Kyu Lee. All rights reserved.
 */

import { Nullable } from "../../shared/nullable/nullable";
import { generateDiscordPost_ } from "./generate-discord-post";
import { slideNumberToIndex_ } from "../../shared/slide-number/slide-number-to-index";
import { processLongQuoteSlideItem_ } from "./process-long-quote-slide-item";
import { LongQuoteItem } from "./long-quote-item";
import { insertionSlideNumberDefault_, longQuoteSlideItemsDefault_, templateLongQuoteSlideNumberDefault_, templateTitleSlideNumberDefault_ } from "./defaults";
import { slideNumberToId_ } from "../../shared/slide-number/slide-number-to-id";
import { SlideNumber } from "../../shared/slide-number/slide-number";
import { SlideId } from "../../shared/slide-id/slide-id";


/**
 * 
 * @param {Object} parameters - parameters for the function
 * @param {LongQuoteItem[]} parameters.longQuoteItems
 * @param {Nullable<SlideNumber>} parameters.templateTitleSlideNumber
 * @param {Nullable<SlideNumber>} parameters.templateContentSlideNumber
 * @param {SlideNumber} parameters.insertionSlideNumber
 * @param {string} parameters.longQuoteItems[].title
 * @param {string} parameters.longQuoteItems[].subtitle
 * @param {string} parameters.longQuoteItems[].quote
 */
export const createLongQuotesSlides = ({
	longQuoteItems = longQuoteSlideItemsDefault_,
	templateTitleSlideNumber = templateTitleSlideNumberDefault_,
	templateContentSlideNumber = templateLongQuoteSlideNumberDefault_,
	insertionSlideNumber = insertionSlideNumberDefault_,
}: {
	longQuoteItems: LongQuoteItem[],
	templateTitleSlideNumber: Nullable<SlideNumber>,
	templateContentSlideNumber: Nullable<SlideNumber>,
	insertionSlideNumber: SlideNumber,
} = {
	longQuoteItems: longQuoteSlideItemsDefault_,
	templateTitleSlideNumber: templateTitleSlideNumberDefault_,
	templateContentSlideNumber: templateLongQuoteSlideNumberDefault_,
	insertionSlideNumber: insertionSlideNumberDefault_,	
}): void => {
	console.log(
		generateDiscordPost_({longQuoteItems: longQuoteItems})
	);

	internalCreateLongQuoteSlides_({
		longQuoteItems: longQuoteItems,
		templateTitleSlideNumber: templateTitleSlideNumber,
		templateContentSlideNumber: templateContentSlideNumber,
		insertionSlideNumber: insertionSlideNumber,
	});
};

const internalCreateLongQuoteSlides_ = ({
	longQuoteItems: longQuoteItems,
	templateTitleSlideNumber,
	templateContentSlideNumber,
	insertionSlideNumber,
}: {
	longQuoteItems: LongQuoteItem[],
	templateTitleSlideNumber: Nullable<SlideNumber>,
	templateContentSlideNumber: Nullable<SlideNumber>,
	insertionSlideNumber: SlideNumber,
}): void => {
	const presentation: GoogleAppsScript.Slides.Presentation = SlidesApp.getActivePresentation();

	const templateTitleSlideId: Nullable<SlideId> = slideNumberToId_({
		presentation: presentation,
		slideNumber: templateTitleSlideNumber,
		pageElementKeys: ["section-title-text-box", "section-subtitle-text-box"],
	});
	const templateContentSlideId: Nullable<SlideId> = slideNumberToId_({
		presentation: presentation,
		slideNumber: templateContentSlideNumber,
		pageElementKeys: ["quote-text-box", "addendum-text-box"],
	});

	let currentInsertionIndex: SlideNumber = slideNumberToIndex_(insertionSlideNumber);

	if (templateContentSlideId === null || templateTitleSlideId === null) {
		console.error("At least one of the original lyrics slides could not be found.");
		return;
	}

	longQuoteItems.forEach((lyricsSlidesItem: LongQuoteItem): void => {
		currentInsertionIndex = processLongQuoteSlideItem_({
			presentation: presentation,
			templateTitleSlideId: templateTitleSlideId,
			templateLongQuoteSlideId: templateContentSlideId,
			longQuoteSlidesItem: lyricsSlidesItem,
			baseInsertionIndex: currentInsertionIndex,
		}) ?? currentInsertionIndex; 
	});
};
