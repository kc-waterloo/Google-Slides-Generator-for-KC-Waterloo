/**
 * create-verse-slides/index.ts
 *
 * Created by Min-Kyu Lee on 25-02-2024
 * Copyright © 2024 Min-Kyu Lee. All rights reserved.
 */


import { Nullable } from "../../shared/nullable/nullable";
import { SlideNumber } from "../../shared/slide-number/slide-number";
import { createShortQuotesSlides } from "../create-short-quotes-slides";
import { VerseApiResponse } from "./verse-api-response";
import { VerseItemInput } from "./verse-item-inputs";
import { VerseItem } from "./verse-item";
import { verseItemToShortQuoteItems_ } from "./verse-item-to-short-quote-items";
import { verseItemToRequests_ } from "./verse-item-to-requests";
import { insertionSlideNumberDefault_, templateSlideNumberDefault_, verseItemsDefault_ } from "./defaults";

/**
 * 
 * @param {Object} parameters
 * @param {VerseItemInput[]} parameters.verseItemInputs
 * @param {Nullable<SlideNumber>} parameters.templateSlideNumber
 * @param {SlideNumber} parameters.insertionSlideNumber
 * @param {string} parameters.verseItemInputs[].book
 * @param {number} parameters.verseItemInputs[].chapter
 * @param {number} parameters.verseItemInputs[].startingVerse
 * @param {number | undefined} parameters.verseItemInputs[].endingVerse
 * @param {string} parameters.verseItemInputs[].version
 */
export const createVerseSlides = ({
	verseItemInputs = verseItemsDefault_,
	templateSlideNumber = templateSlideNumberDefault_,
	insertionSlideNumber = insertionSlideNumberDefault_,
}: {
	verseItemInputs: VerseItemInput[],
    templateSlideNumber: Nullable<SlideNumber>,
    insertionSlideNumber: SlideNumber,
} = {
	verseItemInputs: verseItemsDefault_,
	templateSlideNumber: templateSlideNumberDefault_,
	insertionSlideNumber: insertionSlideNumberDefault_,
}): void => {
	const verseItems = verseItemInputs.map((verseItemInput: VerseItemInput): VerseItem => {
		return {
			input: verseItemInput,
			responses: UrlFetchApp.fetchAll(verseItemToRequests_(verseItemInput)).map(
				(response) => {
					return JSON.parse(response.getContentText()) as VerseApiResponse;
				}
			),
		};
	});

	createShortQuotesSlides({
		shortQuoteItems: verseItems.flatMap((verseItem) => {
			return verseItemToShortQuoteItems_(verseItem);
		}),
		templateSlideNumber: templateSlideNumber,
		insertionSlideNumber: insertionSlideNumber,
	});
};


