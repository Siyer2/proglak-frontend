import { ReactElement, useState } from 'react';

import { ruleIsCompleted, stripHtml } from '../helperFunctions';
import { Rule } from '../types';
import {
    OverlayTrigger, 
    Tooltip, 
    Card, 
    ListGroup, 
    Button, 
    Modal
} from 'react-bootstrap';

interface IndividualRuleProps {
    rule: Rule;
    ruleName: string;
    index: number;
    tickClicked: (course: { code: string, credit_points: string }) => void;
}

const courseShowLimit = 20;

/**
 * Render an individual rule
 * @param props 
 */
function IndividualRule(props: IndividualRuleProps) {
    // Don't display the rule if it's already been completed
    if (ruleIsCompleted(props.rule, props.ruleName)) {
        return (
            <></>
        )
    }

    return (
        <div key={props.ruleName + props.index}>
            <OverlayTrigger
                key={'top'}
                placement={'top'}
                overlay={
                    <Tooltip id={`tooltip-top`}>
                        {props.rule.description ? stripHtml(props.rule.description) : ''}
                    </Tooltip>
                }>
                <Card.Title>
                    {getRuleInstruction(props.rule)}
                </Card.Title>
            </OverlayTrigger>
            <Card.Body>
                <Courses rule={props.rule} tickClicked={props.tickClicked} />
            </Card.Body>
        </div>
    )
}

interface CoursesProps {
    rule: Rule;
    tickClicked: (course: { code: string, credit_points: string }) => void;
}
/**
 * Display the courses
 * @param props 
 */
function Courses(props: CoursesProps) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    if (props.rule.courses && props.rule.courses.length <= courseShowLimit) {
        return (
            <ListGroup variant="flush">
                {props.rule.courses && props.rule.courses.map((course, i) => {
                    return (
                        <Course course={course} index={i} tickClicked={props.tickClicked}/>
                    )
                })}
            </ListGroup>
        )
    }
    else if (props.rule.courses) {
        return (
            <>
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <Button variant="primary" onClick={handleShow}>View {props.rule.courses.length} Courses</Button>
                    </ListGroup.Item>
                </ListGroup>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Showing {props.rule.courses.length} courses</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ListGroup variant="flush">
                            {props.rule.courses && props.rule.courses.map((course, i) => {
                                return (
                                    <Course course={course} index={i} tickClicked={props.tickClicked} />
                                )
                            })}
                        </ListGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
    else {
        return null;
    }
}

interface CourseProps {
    course: { code: string, credit_points: string };
    index: number;
    tickClicked: (course: { code: string, credit_points: string }) => void;
}
/**
 * Display an individual course
 * @param props 
 */
function Course(props: CourseProps): ReactElement {
    const link = `https://www.handbook.unsw.edu.au/undergraduate/courses/2021/${props.course.code}/`;
    return (
        <ListGroup.Item key={props.index + props.course.code}>
            {/* <a style={{ textDecoration: 'none' }} href={link} target='_blank' rel="noopener noreferrer"> */}
                {/* <Button variant="primary"> */}
                    {props.course.code} ({props.course.credit_points ? props.course.credit_points : '0'} UOC)
                {/* </Button> */}
            {/* </a> */}
            <OverlayTrigger
                key={props.index + props.course.code}
                placement={'top'}
                overlay={
                    <Tooltip id={props.index + props.course.code}>
                        Mark course as completed
                    </Tooltip>
                }
            >
                <Button className="mb-2" variant={'success'} style={{ float: 'right' }} onClick={() => { props.tickClicked(props.course) }}>
                    ✔️
                </Button>
            </OverlayTrigger>
        </ListGroup.Item>
    )
}

/**
 * Based off the rule, return what the instruction header should be
 * @param rule 
 */
function getRuleInstruction(rule: Rule): string {
    if (rule.credit_points && rule.credit_points_max && rule.credit_points === rule.credit_points_max) {
        return `Finish ${rule.credit_points} UOC of the following courses:`;
    }
    else if (rule.credit_points && rule.credit_points_max) {
        return `Finish between ${rule.credit_points} and ${rule.credit_points_max} UOC of the following courses:`;
    }
    else if (rule.credit_points) {
        return `Finish ${rule.credit_points} UOC of the following courses:`;
    }
    else if (rule.credit_points_max) {
        return `Finish up to ${rule.credit_points_max} UOC of the following courses:`;
    }
    else if (rule.description) {
        return stripHtml(rule.description);
    }
    else {
        console.log("unfound", rule);
    }

    return 'null';
}

export default IndividualRule;