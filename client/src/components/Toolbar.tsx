import { FiBold, FiItalic, FiUnderline } from "react-icons/fi"
import { RiNetflixLine } from "react-icons/ri"
import { GrUnorderedList } from "react-icons/gr"
import { BsCode, BsCodeSlash, BsListTask } from "react-icons/bs"
import { Editor, Element, Text, Transforms } from "slate"
import { useSlate } from "slate-react"
import Mark from "../types/Mark"
import ElementType from "../types/ElementType"

interface ToolbarProps {
	title: string,
	onTitleChange: (value: string) => void
}

function Toolbar(props: ToolbarProps) {
	const editor = useSlate()

	function toggleMark(e: any, mark: Mark) {
		e.preventDefault()

		if (isMarkActive(mark)) {
			Editor.removeMark(editor, mark)
		}
		else {
			Editor.addMark(editor, mark, true)
		}
	}

	function toggleType(e: any, type: ElementType) {
		e.preventDefault()

		const isList = type === ElementType.LIST


		const [match] = Editor.nodes(editor, {
			match: n =>
				!Editor.isEditor(n) && Element.isElement(n) && n.type === type,
		})


		if (match) {
			Transforms.setNodes(editor, {
				type: ElementType.DEFAULT
			})

			if (isList) {
				Transforms.unwrapNodes(editor, {
					match: n => !Editor.isEditor(n) && Element.isElement(n) && n.type === ElementType.LIST,
					split: true,
				})
			}
		}
		else {
			if (isList) {
				const block = { type, children: [] }

				Transforms.wrapNodes(editor, block)
			}

			Transforms.setNodes(editor, {
				type: isList ? ElementType.LIST_ITEM : type
			})
		}
	}


	function isMarkActive(mark: Mark) {
		const marks = Editor.marks(editor)

		return { ...marks }[mark]
	}

	function titleChanged(value: string) {
		props.onTitleChange(value)
	}

	return (
		<div className="toolbar -flex -align-center -just-between">
			{/* <h2 className=""> */}
			<input type="text" value={props.title} className="toolbar__title" onChange={(e) => titleChanged(e.target.value)} />
			{/* </h2> */}
			<div className="-flex">
				<button
					onPointerDown={e => toggleMark(e, Mark.BOLD)}
					className="toolbar-control"
				>
					<FiBold size="20" color={isMarkActive(Mark.BOLD) ? "#606060" : "lightgray"} />
				</button>
				<button
					onPointerDown={e => toggleMark(e, Mark.ITALIC)}
					className="toolbar-control"
				>
					<FiItalic size="20" color={isMarkActive(Mark.ITALIC) ? "#606060" : "lightgray"} />
				</button>
				<button
					onPointerDown={e => toggleMark(e, Mark.UNDERLINE)}
					className="toolbar-control"
				>
					<FiUnderline size="20" color={isMarkActive(Mark.UNDERLINE) ? "#606060" : "lightgray"} />
				</button>
				{/* </div>
			<div className="-flex"> */}
				<div style={{ width: "35px" }}></div>
				<button
					onPointerDown={e => toggleType(e, ElementType.CODE)}
					className="toolbar-control"
				>
					<BsCodeSlash size="20" />
				</button>
				<button
					onPointerDown={e => toggleType(e, ElementType.HEADING)}
					className="toolbar-control"
				>
					<RiNetflixLine size="20" />
				</button>
				<button
					onPointerDown={e => toggleType(e, ElementType.LIST)}
					className="toolbar-control"
				>
					<BsListTask size="20" />
				</button>
			</div>
		</div>
	)
}

export default Toolbar