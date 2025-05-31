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

        if (selection == 'japaneseExclusion'){
            return <div className="park-info">   </div>
        }

        if (selection == 'ebey'){
            return <div className="park-info">   </div>
        }

        if (selection == 'vancouver'){
            return <div className="park-info">   </div>
        }

        if (selection == 'klondike'){
            return <div className="park-info">   </div>
        }

        if (selection == 'roosevelt'){
            return <div className="park-info">   </div>
        }

        if (selection == 'lewisClark'){
            return <div className="park-info">   </div>
        }
        
        if (selection == 'manhattan'){
            return <div className="park-info">   </div>
        }
                
        if (selection == 'rainier'){
            return <div className="park-info">   </div>
        }
                
        if (selection == 'nezPierce'){
            return <div className="park-info">   </div>
        }
                
        if (selection == 'cascades'){
            return <div className="park-info">   </div>
        }

        if (selection == 'olympic'){
            return <div className="park-info">   </div>
        }
                        
        if (selection == 'sanJuan'){
            return <div className="park-info">   </div>
        }
               
        if (selection == 'whitman'){
            return <div className="park-info">   </div>
        }
    }

  
    return (
        <main>
            <div className="state">
                <h1>Washington State</h1>
            <WashingtonDropdownMenu 
                selection={selection} 
                setSelection={setSelection} 
            />
            </div>

            <div className="selection">{checkForSelection()}</div>
            
        </main>
    )
}

export default Washington