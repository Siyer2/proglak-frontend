import { Switch, Route } from 'react-router-dom';

import ProgramSelector from './components/ProgramSelector';
import Results from './components/Results';

const Main = () => {
    return (
        <Switch>
            <Route exact path={'/'} component={ProgramSelector}></Route>
            <Route exact path={'/results'} component={Results}></Route>
        </Switch>
    )
}

export default Main;