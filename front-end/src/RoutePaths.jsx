import { Routes, Route } from 'react-router-dom';

import Homepage from './pages/Homepage';
import Washington from './pages/Washington';
import Oregon from './pages/Oregon';
import PageNotFound from './pages/PageNotFound';


function RoutePaths() {
    return (
        <Routes>
          <Route path='/' element={ <Homepage/> } />
          <Route path='/washington' element={ <Washington/> } />
          <Route path='/oregon' element={ <Oregon/> } />
          <Route path='*' element={ <PageNotFound/> } />
        </Routes>
    )
}

export default RoutePaths