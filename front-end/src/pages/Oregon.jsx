import { useState } from "react"
import OregonDropdownMenu from "../page_components/OregonParksDropdown"

function Oregon() {
    const [selection, setSelection] = useState('')

    const checkForSelection = () => {
        if (selection == ''){
            return <p className="changeState">
                Choose a different state
            </p>
        }
    }

  
    return (
        <main>
            <div className="state">
                <h1>Oregon</h1>
            </div>
             <OregonDropdownMenu 
                selection={selection} 
                setSelection={setSelection} 
            />

            <div className="selection">{checkForSelection()}</div>
            
        </main>
    )
}

export default Oregon