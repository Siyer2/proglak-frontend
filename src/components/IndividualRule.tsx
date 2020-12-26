import { Rule } from '../types';

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
    console.log("IR", props);

    return (
        <div>
            hello
        </div>
    )
}

export default IndividualRule;