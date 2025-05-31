import { useState } from "react"
import { Link } from 'react-router-dom';
import OregonDropdownMenu from "../page_components/OregonParksDropdown"
import oregonMap from '../images/oregon-nationalparks.gif'

function Oregon() {
    const [selection, setSelection] = useState('')

    const checkForSelection = () => {
        if (selection == ''){
            return <div className="stateMap">
                <img src={oregonMap} alt='A map of Oregon showing the location of all national park sites' className="nothing-selected"/>
            </div>
        }

        if (selection == 'crater'){
            return <div className="park-info">  </div>
        }

        if (selection == 'fossil'){
            return <div className="park-info">  </div>
        }

        if (selection == 'lewisClark'){
            return <div className="park-info">  </div>
        }

        if (selection == 'caves'){
            return <div className="park-info">  </div>
        }
    }

  
    return (
        <main>
            <div className="state">
                <h1>Oregon</h1>
             <OregonDropdownMenu 
                selection={selection} 
                setSelection={setSelection} 
            />
            </div>

            <div className="selection">{checkForSelection()}</div>
            
        </main>
    )
}

export default Oregon