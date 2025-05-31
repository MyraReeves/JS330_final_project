import { Link } from 'react-router-dom';

function Homepage() {
    
    return (
        <main>
            <div className="states">
                <h2>Interested in visiting a location within the national park system?</h2>
                <h3>Look up basic visitor information using our park database!</h3>
                <br/>
                <h4>To begin, please choose which state you will be visiting:<br/>
                🌲 <Link to='/oregon'>Oregon</Link><br/>
                🌲 <Link to='/washington'>Washington</Link>
                </h4>

                <p class="tiny-footnote">* Additional states will be added to the list as we add parks to our database</p>
            </div>

            <div className = "accounts">
                <h2>Want to keep track of which parks you've visited? <br/>
                Or share your experiences and insights with others?</h2>
                <h3>Sign up for an account!</h3>
            </div>

           
        </main>
    )
}

export default Homepage