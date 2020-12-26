import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import {
    Jumbotron,
    Container,
    Accordion
} from 'react-bootstrap';

interface Requirements {
    code: string;
    title: string;
    minimumUOC: string;
    implementation_year: string;
    specialisations?: string[],
    coreCourses?: any;
    generalEducation?: any;
    maturityRules?: any;
    prescribedElectives?: any;
    freeElectives?: any;
    informationRules?: any;
    oneOfTheFollowings?: any;
    limitRules?: any;
}

function ResultsPage(props: any): ReactElement<any, any> {
    if (!props.requirements.isGettingRequirements && !props.requirements.requirements.code) {
        return (
            <NoSetProgram />
        )
    }
    else {
        console.log("found", props.requirements.requirements);
        return (
            <>
                {props.requirements.isGettingRequirements ?
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                    :
                    <>
                        <Results requirements={props.requirements.requirements} />
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
            <ResultsHeader requirements={resultHeaderProps} />
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
    }
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
            </Jumbotron>
        </>
    )
}

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