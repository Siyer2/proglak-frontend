import { ReactElement, useState, useEffect } from 'react';
import { GiphyFetch } from '@giphy/js-fetch-api';

import { ruleIsCompleted, stripHtml } from '../helperFunctions';
import { Rule } from '../types';
import {
    OverlayTrigger, 
    Tooltip, 
    Card, 
    ListGroup, 
    Button, 
    Modal, 
    Popover, 
    Col, 
    Image
} from 'react-bootstrap';
import { getReactions } from '../apiCalls';
import ralphSad from '../images/ralph.gif';

const config = require('../config/index.json');
const giphyKey = config.GIPHY_TOKEN;

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
                        <Course key={course.code + i} course={course} index={i} tickClicked={props.tickClicked}/>
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
                                    <Course course={course} index={i} tickClicked={props.tickClicked} hideOverlay={true} />
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
    hideOverlay?: boolean;
}
/**
 * Display an individual course
 * @param props 
 */
function Course(props: CourseProps): ReactElement {
    const link = `/course/${props.course.code}/`;

    if (props.hideOverlay) {
        return (
            <ListGroup.Item key={props.index + props.course.code}>
                <a style={{ textDecoration: 'none' }} href={link} target='_blank' rel="noopener noreferrer">
                    <Button variant="primary">
                        {props.course.code} ({props.course.credit_points ? props.course.credit_points : '0'} UOC)
                    </Button>
                </a>

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
    else {
        return (
            <ListGroup.Item key={props.index + props.course.code}>
                <OverlayTrigger
                    key={props.index + props.course.code + 'coursename'}
                    placement={'top'}
                    overlay={GetRatingOverlay(props.course.code)}
                >
                    <a style={{ textDecoration: 'none' }} href={link} target='_blank' rel="noopener noreferrer">
                        <Button variant="primary">
                            {props.course.code} ({props.course.credit_points ? props.course.credit_points : '0'} UOC)
                    </Button>
                    </a>
                </OverlayTrigger>

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
}

/**
 * What is displayed when a user hovers over a course
 * @param courseCode 
 */
function GetRatingOverlay(courseCode: string): ReactElement {
    //==== State ====//
    const [reactions, setReactions] = useState<[string, number][] | null>(null);
    const [loadingReactions, setLoadingReactions] = useState(true);

    const [topGifs, setTopGifs] = useState<string[]>([]);
    //==== End State ====//

    /**
     * Set the gifs
     */
    useEffect(() => {
        async function initialiseReactionsPage() {
            const reactions = await getReactions(courseCode);
            await setGifsInState(reactions);
        }
        initialiseReactionsPage();
        // eslint-disable-next-line
    }, [])

    /**
     * Take in all the reactions and then put it in state
     * @param reactions 
     */
    async function setGifsInState(reactions: [string, number][]) {
        setReactions(reactions);
        setLoadingReactions(false);

        const topGifsPromises: Promise<string>[] = reactions.map((reaction) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const gf = new GiphyFetch(giphyKey);
                    const { data } = await gf.gif(reaction[0]);
                    const linkToGif = String(data.images.original.url);
                    resolve(linkToGif);
                } catch (ex) {
                    console.log("EXCEPTION GETTING GIF", ex);
                    reject(ex);
                }
            });
        });

        const topGifsToSet: string[] = await Promise.all(topGifsPromises);
        setTopGifs(topGifsToSet);
    }

    return (
        <Popover id="popover-basic">
            <Popover.Title style={{ textAlign: 'center' }} as="h3">Most Common Reaction to <strong>{courseCode}</strong>:</Popover.Title>
            <Popover.Content>
                {loadingReactions ?
                    <Col>
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </Col>
                    :
                    reactions && reactions.length === 0 ?
                        <Col>
                            <Image src={ralphSad} alt="No reactions yet" fluid />
                            <div style={{ textAlign: 'center' }}>
                                No reactions yet, add the first one!
                            </div>
                        </Col>
                        :
                        reactions !== null ?
                                <Col key={reactions[0][0] + reactions[0][1]}>
                                    <Card style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', border: 'none' }}>
                                        <Card.Body>
                                        {topGifs[0] ? <Image src={topGifs[0]} alt="reaction" fluid /> : null}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            :
                            <Col>
                                <div>
                                    Bug
                                </div>
                            </Col>
                }
            </Popover.Content>
            <Popover.Content style={{ textAlign: 'center' }}>
                <strong>Add your reaction</strong>
            </Popover.Content>
        </Popover>
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