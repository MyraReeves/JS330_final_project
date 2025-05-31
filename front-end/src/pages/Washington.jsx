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
            return <div className="box-shadow"> <LibraryOfCongressAPI referenceURL = 'resource/rbc0001.2005gen17970/?st=gallery&c=417'/> </div>
        }

        if (selection == 'ebey'){
            return <div className="box-shadow"> <LibraryOfCongressAPI referenceURL = 'resource/rbc0001.2005gen17970/?st=gallery&c=417'/> </div>
        }

        if (selection == 'vancouver'){
            return <div className="box-shadow"> <LibraryOfCongressAPI referenceURL = 'resource/rbc0001.2005gen17970/?st=gallery&c=417'/> </div>
        }

        if (selection == 'klondike'){
            return <div className="box-shadow"> <LibraryOfCongressAPI referenceURL = 'resource/rbc0001.2005gen17970/?st=gallery&c=417'/> </div>
        }

        if (selection == 'roosevelt'){
            return <div className="box-shadow"> <LibraryOfCongressAPI referenceURL = 'resource/rbc0001.2005gen17970/?st=gallery&c=417'/> </div>
        }

        if (selection == 'lewisClark'){
            return <div className="box-shadow"> <LibraryOfCongressAPI referenceURL = 'resource/rbc0001.2005gen17970/?st=gallery&c=417'/> </div>
        }
        
        if (selection == 'manhattan'){
            return <div className="box-shadow"> <LibraryOfCongressAPI referenceURL = 'resource/rbc0001.2005gen17970/?st=gallery&c=417'/> </div>
        }
                
        if (selection == 'rainier'){
            return <div className="box-shadow"> <LibraryOfCongressAPI referenceURL = 'resource/rbc0001.2005gen17970/?st=gallery&c=417'/> </div>
        }
                
        if (selection == 'nezPierce'){
            return <div className="box-shadow"> <LibraryOfCongressAPI referenceURL = 'resource/rbc0001.2005gen17970/?st=gallery&c=417'/> </div>
        }
                
        if (selection == 'cascades'){
            return <div className="box-shadow"> <LibraryOfCongressAPI referenceURL = 'resource/rbc0001.2005gen17970/?st=gallery&c=417'/> </div>
        }

        if (selection == 'olympic'){
            return <div className="box-shadow"> <LibraryOfCongressAPI referenceURL = 'resource/rbc0001.2005gen17970/?st=gallery&c=417'/> </div>
        }
                        
        if (selection == 'sanJuan'){
            return <div className="box-shadow"> <LibraryOfCongressAPI referenceURL = 'resource/rbc0001.2005gen17970/?st=gallery&c=417'/> </div>
        }
               
        if (selection == 'whitman'){
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