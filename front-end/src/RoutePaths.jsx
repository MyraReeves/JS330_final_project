import { Routes, Route } from 'react-router-dom';

import Homepage from './pages/Homepage';
import PageNotFound from './pages/PageNotFound';


function RoutePaths() {
    return (
        <Routes>
          <Route path='/' element={ <Homepage/> } />
          <Route path='*' element={ <PageNotFound/> } />
        </Routes>
    )
}

export default RoutePaths