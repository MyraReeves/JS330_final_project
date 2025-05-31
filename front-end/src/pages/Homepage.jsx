import { Link } from 'react-router-dom';

function Homepage() {
    
    return (
        <main>
            <div className="states">
                <h2>Interested in visiting a location within the national park system?</h2>
                <h3>Look up basic visitor information using our park database!</h3>
                <br/>
                <h4>To begin, please choose which state you will be visiting:</h4>
                🌲 <Link to='/oregon'>Oregon</Link><br/>
                🌲 <Link to='/washington'>Washington</Link>

                <p class="tiny-footnote">* Additional states will be added to the list as we add parks to our database</p>
            </div>

           
        </main>
    )
}

export default Homepage