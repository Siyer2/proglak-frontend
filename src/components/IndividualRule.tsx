import { useState } from 'react';

import { stripHtml } from '../helperFunctions';
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
}

const courseShowLimit = 20;

/**
 * Render an individual rule
 * @param props 
 */
function IndividualRule(props: IndividualRuleProps) {
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
                <Courses rule={props.rule} />
            </Card.Body>
        </div>
    )
}

/**
 * Display the courses
 * @param props 
 */
function Courses(props: {rule: Rule}) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    if (props.rule.courses && props.rule.courses.length <= courseShowLimit) {
        return (
            <ListGroup variant="flush">
                {props.rule.courses && props.rule.courses.map((course, i) => {
                    return (
                        <ListGroup.Item key={i + course.code}>
                            {course.code} ({course.credit_points ? course.credit_points : '0'} UOC)
                        </ListGroup.Item>
                    )
                })}
            </ListGroup>
        )
    }
    else if (props.rule.courses) {
        return (
            <>
                <ListGroup variant="flush">
                    <Button variant="primary" onClick={handleShow}>View {props.rule.courses.length} Courses</Button>

                    {/* {props.rule.courses && props.rule.courses.map((course, i) => {
                        return (
                            <ListGroup.Item key={i + course.code}>
                                {course.code} ({course.credit_points ? course.credit_points : '0'} UOC)
                            </ListGroup.Item>
                        )
                    })} */}
                </ListGroup>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Showing {props.rule.courses.length} courses</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ListGroup variant="flush">
                            {props.rule.courses && props.rule.courses.map((course, i) => {
                                return (<ListGroup.Item key={i + course.code}>{course.code} ({course.credit_points ? course.credit_points : '0'} UOC)</ListGroup.Item>)
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