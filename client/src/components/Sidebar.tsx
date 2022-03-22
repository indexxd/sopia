import { useState } from "react"
import { BiSearch, BiTrash } from "react-icons/bi"
import { CgMathPlus } from "react-icons/cg"
import { CustomElement, Entry } from "../types/CustomTypes"
import ElementType from "../types/ElementType"

type SidebarProps = {
	onEntryChange: (value: Entry | null) => void,
	entries: Entry[]
}

function Sidebar(props: SidebarProps) {
	const [isSearchFocused, setSearchFocused] = useState<boolean>(false)

	function addNew() {
		props.onEntryChange(null)
	}

	function changeEntry(entry: Entry) {
		props.onEntryChange(entry)
	}

	return (
		<div className="sidebar">
			<div className="-relative mt-20">
				<input type="text"
					className="search"
					onFocus={() => setSearchFocused(true)}
					onBlur={() => setSearchFocused(false)}
				/>
				<BiSearch className="search__icon" />
				{isSearchFocused &&
					<div className="results"></div>
				}
			</div>
			<div>
				<div className="sidebar__heading mt-40 ml-8">Entries</div>
				{props.entries.map(a => (
					<div
						className="sidebar__item -flex -just-between -align-center"
						onClick={() => changeEntry(a)}
						key={a.id}
					>
						<span>{a.title}</span>
						{/* <button className="btn">
							<BiTrash />
						</button> */}
					</div>
				))
				}
			</div>
			<div className="-flex -center">
				<button className="btn" onClick={addNew}>
					<CgMathPlus size={20} />
				</button>
			</div>
		</div>
	)
}

export default Sidebar