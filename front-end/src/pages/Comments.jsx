// Currently, this file fetches ALL comments created by all users, irregardless of which park was visited.  In the future when I have more time, I would like my app to only fetch comments (via a button press might be easiest) related to the one single park that the user requested from the dropdown menu.

import React, { useEffect, useState } from 'react';

function Comments() {
    const [backendData, setBackendData] = useState( [{}] );
    const [hasError, setHasError] = useState(false);
    const [loading, setLoading] = useState(true);


    useEffect( () => {
        fetch('http://localhost:5000/')
        .then( response => response.json() )
        .then( data => {setBackendData(data)} )

        .catch( error => {
            console.log('%cThe following error occured when attempting to fetch data: \n', 'color: red; font-weight: bold; font-size: larger', error);
            setHasError(true);
        })

        .finally( () => {
            setLoading(false)
        })
    }, []);


    // Conditionals to handle API processing:
    if (hasError) {
        return <div><p className="error">⛔ An error occurred while fetching the information.  Sorry!</p></div>;
    }
    if (loading) {
        return <div><p className="loading">Loading...</p></div>
    }
    if (backendData === null) {
        return <div className="loading">The database could not find any park comments.</div>;
    }

    return (
        <div>

        </div>
    )
}

export default Comments