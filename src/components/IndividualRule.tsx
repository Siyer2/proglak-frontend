import { stripHtml } from '../helperFunctions';
import { Rule } from '../types';
import {
    OverlayTrigger, 
    Tooltip, 
    Card, 
    ListGroup, 
    Button
} from 'react-bootstrap';

interface IndividualRuleProps {
    rule: Rule;
    ruleName: string;
    index: number;
}

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
        </div>
    )
}

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