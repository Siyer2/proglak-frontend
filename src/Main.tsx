import { Switch, Route } from 'react-router-dom';

import ProgramSelector from './components/ProgramSelector';
import ResultsPage from './components/ResultsPage';
import CourseRating from './components/CourseRating';

const Main = () => {
    return (
        <Switch>
            <Route exact path={'/'} component={ProgramSelector}></Route>
            <Route exact path={'/results'} component={ResultsPage}></Route>
            <Route path={'/course/:code'} component={CourseRating}></Route>
        </Switch>
    )
}

export default Main;