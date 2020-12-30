import React, { ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import {
    Jumbotron,
    Container
} from 'react-bootstrap';
import { Course, Requirements } from '../types'
import Rules from './Rules';
import CourseSelector from './CourseSelector';
import { getUpdatedRequirements } from '../helperFunctions';

function ResultsPage(props: any): ReactElement {
    //==== State ====//
    const [currentRequirements, setCurrentRequirements] = useState<Requirements | undefined>(undefined);
    console.log(props.requirements.requirements);
    //==== End State ====//

    /**
     * When a course is added/removed in the CourseSelector, update the requirements
     * @param completedCourses 
     * @returns the remaining requirements
     */
    function courseChanged(completedCourses: Course[]) {
        const updatedRequirements = getUpdatedRequirements(completedCourses, props.requirements.requirements);
        setCurrentRequirements(updatedRequirements);
    }

    if (!props.requirements.isGettingRequirements && !props.requirements.requirements.code) {
        return (
            <NoSetProgram />
        )
    }
    else {
        if (!props.requirements.isGettingRequirements && !currentRequirements && props.requirements.requirements && props.requirements.requirements.code) {
            const updatedRequirements = props.requirements.requirements;
            setCurrentRequirements(updatedRequirements);
        }
        
        return (
            <>
                {props.requirements.isGettingRequirements ?
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                    :
                    <>
                        <Results requirements={currentRequirements} courseChanged={courseChanged} />
                    </>
                }
            </>
        )
    }
}

function Results(props: any) {
    const requirements: Requirements = props.requirements;
    const resultHeaderProps = {
        code: requirements.code,
        title: requirements.title,
        implementation_year: requirements.implementation_year,
        minimumUOC: requirements.minimumUOC,
        ...requirements.specialisations && { specialisations: requirements.specialisations }
    }

    return (
        <div>
            <ResultsHeader requirements={resultHeaderProps} courseChanged={props.courseChanged}/>
            <Rules requirements={requirements} />
        </div>
    )
}
interface ResultsHeaderProps {
    requirements: {
        code: string;
        title: string;
        implementation_year: string;
        minimumUOC: string | number;
        specialisations?: string[] 
    };
    courseChanged: (completedCourses: Course[]) => Requirements;
}
/**
 * Display the program info, specialisations, remaining UOC and the course selector
 */
function ResultsHeader(props: ResultsHeaderProps) {
    return (
        <>
            <Jumbotron fluid>
                <Container>
                    <h1>{`${props.requirements.code}: ${props.requirements.title} (${props.requirements.implementation_year})`}</h1>
                    {props.requirements.specialisations && props.requirements.specialisations.length && <h2>Specialisations: {props.requirements.specialisations.join(', ')}</h2>}
                </Container>
                <h5>
                    You have at least {props.requirements.minimumUOC} UOC to go
                </h5>
                <CourseSelector courseChanged={props.courseChanged}/>
            </Jumbotron>
        </>
    )
}

/**
 * If no program is set
 */
function NoSetProgram() {
    return (
        <>
            <div>No program set. Please select a program to view results.</div>
            <div>If you've found a bug, hit the 🙁 &nbsp;on the top right.</div>
        </>
    )
}

const mapStateToProps = (state: any) => {
    return {
        requirements: state.requirements
    };
};

// const mapDispatchToProps = dispatch => {
//     return {
//         updateRemainingRequirements: (newRemainingRequirements) => {
//             dispatch(updateRemainingRequirements(newRemainingRequirements))
//         }
//     }
// }

export default connect(mapStateToProps, null)(ResultsPage);