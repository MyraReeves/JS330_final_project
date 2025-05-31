import PropTypes from "prop-types";

function WashingtonDropdownMenu(props) {
    const {selection, setSelection} = props;

    const handleSubmit = (event) => {
        event.preventDefault();
     };

    const handleSelection = (event) => {
        setSelection(event.target.value);
    }

  return (
    <div className="parks-dropdown">
        <form onSubmit={handleSubmit}>
            <label htmlFor="park-choices">Choose which park you would like to visit: </label><br/>
            <select name="washingtonParks" id="park-choices" onChange={handleSelection} value={selection}>
                <option disabled> </option>
                <option value="japaneseExclusion">Bainbridge Island Japanese American Exclusion Memorial</option>
                <option value="ebey">Ebey's Landing</option>
                <option value="vancouver">Fort Vancouver</option>
                <option value="klondike">Klondike Gold Rush</option>
                <option value="roosevelt">Lake Roosevelt</option>
                <option value="lewisClark">Lewis & Clark</option>
                <option value="manhattan">Manhattan Project</option>
                <option value="rainier">Mount Rainier</option>
                <option value="nezPierce">Nez Perce - Buffalo Eddy</option>
                <option value="cascades">North Cascades</option>
                <option value="olympc">Olympic National Park</option>
                <option value="sanJuan">San Juan Island</option>
                <option value="whitman">Whitman Mission</option>
            </select>
        </form>
    </div>
  )
}

WashingtonDropdownMenu.propTypes = {
    selection: PropTypes.string.isRequired,
    setSelection: PropTypes.func.isRequired,
}

export default WashingtonDropdownMenu
