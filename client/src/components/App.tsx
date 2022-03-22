import React, { KeyboardEvent, useCallback, useRef, useState } from 'react';
import { BaseEditor, createEditor, Descendant, Editor, Element, Transforms } from 'slate';
import { Editable, ReactEditor, RenderElementProps, RenderLeafProps, Slate, withReact } from 'slate-react';
import '../css/style.scss';
import ElementType from '../types/ElementType';
import { CustomElement, EMPTY_PAGE, Entry, NO_ID } from "../types/CustomTypes"
import Sidebar from './Sidebar';
import Toolbar from './Toolbar';
import http, { Endpoint } from '../service/http';
import { useEffect } from 'react';
import { debounce } from "lodash"
import entryService from '../service/entryService';
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

function renderLeaf(props: RenderLeafProps) {
	let { children } = props

	if (props.leaf.bold) {
		children = (
			<strong>{children}</strong>
		)
	}

	if (props.leaf.underline) {
		children = (
			<u>{children}</u>
		)
	}

	if (props.leaf.italic) {
		children = (
			<i>{children}</i>
		)
	}


	return <span {...props.attributes}>{children}</span>
}

function renderElement(props: RenderElementProps) {
	const codeString = '(num) => num + 1'
	// 	<div {...props.attributes}>
	// 		{props.children}
	// // </div>
	{/* {codeString} */ }
	const CodeElement = (props: RenderElementProps) =>
		<pre {...props.attributes}>
			<code className="language-javascript">{props.children}</code>
		</pre>

	const HeadingElement = (props: RenderElementProps) =>
		<h1 {...props.attributes}>
			{props.children}
		</h1>

	const DefaultElement = (props: RenderElementProps) =>
		<div {...props.attributes}>
			{props.children}
		</div>

	const ListElement = (props: RenderElementProps) =>
		<ul {...props.attributes}>
			{props.children}
		</ul>

	const ListItemElement = (props: RenderElementProps) =>
		<li {...props.attributes}>
			{props.children}
		</li>

	const map = {
		[ElementType.CODE]: CodeElement,
		[ElementType.PARAGRAPH]: DefaultElement,
		[ElementType.HEADING]: HeadingElement,
		[ElementType.LIST]: ListElement,
		[ElementType.LIST_ITEM]: ListItemElement,
	}

	return map[props.element.type](props)
}

function App() {
	const editorRef = useRef<Editor>()
	if (!editorRef.current) editorRef.current = withReact(createEditor())
	const editor = editorRef.current

	const [currentEntryId, setCurrentEntryId] = useState<string | null>(null)
	const [entries, setEntries] = useState<Entry[]>([])
	const [lastKey, setLastKey] = useState<string>()

	const handleEditorChange = useCallback(debounce(saveEntry, 3000, { leading: false, trailing: true }), [])

	useEffect(() => {
		entryService
			.fetchEntries().then(a => {
				setEntries(a)
				setCurrentEntryId(a[0].id)
			})
	}, [])

	async function entryChanged(value: Entry | null) {
		let newValues: Entry[]
		let id

		if (!value) {
			const entry = await entryService.saveEntry({
				content: EMPTY_PAGE,
				title: "novy tute",
			})

			newValues = [...entries, entry]
			id = entry.id
		}
		else {
			newValues = entries.map((a) => {
				return a.id === value.id ? value : a
			})

			id = value.id
		}

		setEntries(newValues)
		setCurrentEntryId(id)
	}

	function getCurrentEntry() {
		return entries.find((a) => a.id === currentEntryId) || entries[0]
	}

	function updateCurrentEntry(content: Descendant[]) {
		const entry = {
			...getCurrentEntry(),
			content: content
		}

		setEntries(
			entries.map((a) => {
				return a.id === currentEntryId ? entry : a
			})
		)
	}

	function updateCurrentEntryTitle(value: string) {
		const entry = {
			...getCurrentEntry(),
			title: value
		}

		setEntries(
			entries.map((a) => {
				return a.id === currentEntryId ? entry : a
			})
		)
	}

	function keyDownHandler(e: KeyboardEvent) {
		if (lastKey === "Enter" && e.key === "Enter") {
			const [match] = Editor.nodes(editor, {
				match: n =>
					!Editor.isEditor(n) && Element.isElement(n) && n.type === ElementType.LIST,
			})

			if (match) {
				e.preventDefault()

				Transforms.unwrapNodes(editor, {
					match: n => !Editor.isEditor(n) && Element.isElement(n) && n.type === ElementType.LIST,
					split: true,
				})

				Transforms.setNodes(editor, {
					type: ElementType.PARAGRAPH
				})
			}

			console.log(match)
		}

		if (e.key === "&") {
			e.preventDefault()
			editor.insertText("and")
		}
		else if (e.key === "$") {
			e.preventDefault()


			Transforms.setNodes(
				editor,
				{ type: ElementType.CODE },
				{ match: n => Editor.isBlock(editor, n) }
			)
		}
		else if (e.key === "B") {
			e.preventDefault()
			// Transforms.setNodes(editor, { bold: true })
			Editor.addMark(editor, "bold", true)
		}

		setLastKey(e.key)
	}


	function saveEntry(entry: Entry, value: Descendant[]) {
		entryService.saveEntry({
			...entry,
			content: value
		})
	}

	return (
		<div className="-flex">
			<Sidebar onEntryChange={entryChanged} entries={entries} />
			<div className="editor">
				<div className="">
					{getCurrentEntry() &&
						<Slate
							editor={editor}
							value={getCurrentEntry().content}
							onChange={newValue => { updateCurrentEntry(newValue); handleEditorChange(getCurrentEntry(), newValue) }}
						>
							<Toolbar title={getCurrentEntry().title} onTitleChange={updateCurrentEntryTitle} />
							<Editable
								spellCheck={false}
								autoFocus
								renderLeaf={renderLeaf}
								className="initial-node"
								renderElement={renderElement}
								onKeyDown={keyDownHandler}
							/>
						</Slate>
					}
				</div>
			</div>
		</div>
	);
}

export default App;