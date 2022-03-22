import { BaseEditor, Descendant } from "slate"
import { ReactEditor } from "slate-react"
import ElementType from "./ElementType"

export type CustomElement = {
	type: ElementType;
	children: CustomText[]
}

type CustomText = { text: string; bold?: true, italic?: true, underline?: true }

export const EMPTY_PAGE: CustomElement[] = [{ type: ElementType.PARAGRAPH, children: [{ text: "" }] }]
export const NO_ID = "no_id"

export type Entry = {
	id: string
	title: string
	content: Descendant[]
}

export type LocalEntry = {
	title: string
	content: Descendant[]
}

declare module 'slate' {
	interface CustomTypes {
		Editor: BaseEditor & ReactEditor
		Element: CustomElement
		Text: CustomText
	}
}
