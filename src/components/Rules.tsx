import { Accordion, Card } from 'react-bootstrap';

import { Requirements, Rule } from '../types';
import IndividualRule from './IndividualRule';

interface RulesProps {
    requirements: Requirements;
}

/**
 * Display all rules
 * @param props 
 */
function Rules(props: RulesProps) {
    return (
        <Accordion defaultActiveKey="0">
            {props.requirements.coreCourses && props.requirements.coreCourses.length ? <RuleTypeContainer ruleName="Core Courses" requirements={props.requirements.coreCourses} eventKey={"0"} /> : null}
            {props.requirements.prescribedElectives && props.requirements.prescribedElectives.length ? <RuleTypeContainer ruleName="Prescribed Electives" requirements={props.requirements.prescribedElectives} eventKey={"1"} /> : null}
            {props.requirements.oneOfTheFollowings && props.requirements.oneOfTheFollowings.length ? <RuleTypeContainer ruleName="One of the Following" requirements={props.requirements.oneOfTheFollowings} eventKey={"2"} /> : null}
            {props.requirements.generalEducation && props.requirements.generalEducation.length ? <RuleTypeContainer ruleName="General Education" requirements={props.requirements.generalEducation} eventKey={"3"} /> : null}
            {props.requirements.limitRules && props.requirements.limitRules.length ? <RuleTypeContainer ruleName="Limits" requirements={props.requirements.limitRules} eventKey={"4"} /> : null}
            {props.requirements.freeElectives && props.requirements.freeElectives.length ? <RuleTypeContainer ruleName="Free Electives" requirements={props.requirements.freeElectives} eventKey={"5"} /> : null}
            {props.requirements.maturityRules && props.requirements.maturityRules.length ? <RuleTypeContainer ruleName="Order of Courses" requirements={props.requirements.maturityRules} eventKey={"6"} /> : null}
            {props.requirements.informationRules && props.requirements.informationRules.length ? <RuleTypeContainer ruleName="Other Important Info" requirements={props.requirements.informationRules} eventKey={"7"} /> : null}
        </Accordion>
    )
}

/**
 * Handle each rule type (e.g. coreCourses)
 */
function RuleTypeContainer(props: {ruleName: string, requirements: Rule[], eventKey: string}) {
    // Map through each rule and render it
    const displayRules = props.requirements.map((requirement: Rule, i: number) => {
        return (
            <IndividualRule key={i + props.ruleName} rule={requirement} ruleName={props.ruleName} index={i} />
        )
    });

    console.log("reqs", props.requirements);
    return (
        <Card>
            <Accordion.Toggle as={Card.Header} eventKey={props.eventKey}>
                <h3>
                    {props.ruleName}
                </h3>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={props.eventKey}>
                <Card.Body>
                    {displayRules}
                </Card.Body>
            </Accordion.Collapse>
        </Card>
    )
}

export default Rules;