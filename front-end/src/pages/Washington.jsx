import { useState } from "react"
import WashingtonDropdownMenu from "../page_components/WashingtonParksDropdown"

function Washington() {
    const [selection, setSelection] = useState('')

    const checkForSelection = () => {

         if (selection == ''){
            return <>
                <p className="changeState">Choose a different state</p>
            </> 
        }

        if (selection == 'spanishAccount'){
            return <div className="box-shadow"> <LibraryOfCongressAPI referenceURL = 'resource/rbc0001.2005gen17970/?st=gallery&c=417'/> </div>
        }

    }

  
    return (
        <main>
            <div className="state">
                <h1>Washington State</h1>
            </div>
            <WashingtonDropdownMenu 
                selection={selection} 
                setSelection={setSelection} 
            />

            <div className="selection">{checkForSelection()}</div>
            
        </main>
    )
}

export default Washington