import { BrowserRouter, Switch, Route } from 'react-router-dom';

import ProgramSelector from './components/ProgramSelector';
import Results from './components/Results';

const Main = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path={'/'} component={ProgramSelector}></Route>
                <Route exact path={'/results'} component={Results}></Route>
            </Switch>
        </BrowserRouter>
    )
}

export default Main;