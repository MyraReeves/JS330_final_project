import PropTypes from "prop-types";

function OregonDropdownMenu(props) {
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
            <select name="oregonParks" id="park-choices" onChange={handleSelection} value={selection}>
                <option disabled> </option>
                <option value="crater">Crater Lake</option>
                <option value="fossil">John Day Fossil Beds</option>
                <option value="lewisClark">Lewis & Clark</option>
                <option value="caves">Oregon Caves</option>
            </select>
        </form>
    </div>
  )
}

OregonDropdownMenu.propTypes = {
    selection: PropTypes.string.isRequired,
    setSelection: PropTypes.func.isRequired,
}

export default OregonDropdownMenu
