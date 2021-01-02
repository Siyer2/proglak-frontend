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
import { getCourse } from '../apiCalls';
import { trackEvent } from '../track';

function ResultsPage(props: any): ReactElement {
    //==== State ====//
    const [currentRequirements, setCurrentRequirements] = useState<Requirements | undefined>(undefined);
    const [completedCourses, setCompletedCourses] = useState<Course[]>([]);
    //==== End State ====//

    /**
     * When the tick is clicked, find the course and add it to the completed courses state
     * @param course 
     */
    async function tickClicked(course: { code: string, credit_points: string }) {
        // Get the course
        const fullCourseDetails = await getCourse(course.code);
        const courseToAdd: Course = {
            course_code: fullCourseDetails.Item.course_code,
            implementation_year: fullCourseDetails.Item.implementation_year,
            link: fullCourseDetails.Item.link,
            name: fullCourseDetails.Item.name,
            credit_points: fullCourseDetails.Item.credit_points
        }

        // Add it to completedCourses
        const newCompletedCourses = completedCourses.concat([courseToAdd]);
        setCompletedCourses(newCompletedCourses);
        courseChanged(newCompletedCourses);

        trackEvent('Tick Clicked');
    }

    /**
     * When a course is added/removed in the CourseSelector, update the requirements
     * @param completedCourses 
     * @returns the remaining requirements
     */
    function courseChanged(completedCourses: Course[]) {
        const updatedRequirements = getUpdatedRequirements(completedCourses, props.requirements.requirements);
        setCurrentRequirements(updatedRequirements);

        setCompletedCourses(completedCourses);
    }

    if ((!props.requirements.isGettingRequirements && !props.requirements.requirements.code)) {
        return (
            <NoSetProgram />
        )
    }
    else {
        if (!props.requirements.isGettingRequirements && !currentRequirements && props.requirements.requirements && props.requirements.requirements.code) {
            const updatedRequirements = props.requirements.requirements;
            setCurrentRequirements(updatedRequirements);
        }
        
        if (props.requirements.isGettingRequirements || !currentRequirements) {
            return (
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            )
        }
        else {
            return (
                <>
                    <Results requirements={currentRequirements} courseChanged={courseChanged} completedCourses={completedCourses} tickClicked={tickClicked} />
                </>
            )
        }
    }
}

interface ResultsProps {
    courseChanged: (completedCourses: Course[]) => void;
    requirements: Requirements;
    tickClicked: (course: { code: string, credit_points: string }) => void;
    completedCourses: Course[];
}

function Results(props: ResultsProps) {
    const requirements: Requirements = props.requirements;
    const resultHeaderProps = {
        code: requirements.code,
        title: requirements.title,
        implementation_year: requirements.implementation_year,
        minimumUOC: requirements.minimumUOC,
        ...requirements.specialisations && { specialisations: requirements.specialisations }, 
    }

    return (
        <div>
            <ResultsHeader requirements={resultHeaderProps} courseChanged={props.courseChanged} completedCourses={props.completedCourses} />
            <Rules requirements={requirements} tickClicked={props.tickClicked} />
        </div>
    )
}
interface ResultsHeaderProps {
    requirements: {
        code: string;
        title: string;
        implementation_year: string;
        minimumUOC: string | number;
        specialisations?: string[]; 
    };
    courseChanged: (completedCourses: Course[]) => void;
    completedCourses: Course[];
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
                <CourseSelector courseChanged={props.courseChanged} completedCourses={props.completedCourses} />
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