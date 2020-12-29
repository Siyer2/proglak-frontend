import _ from 'lodash';

import { Course, Requirements, Rule } from "../types";

/**
 * Convert HTML to a readable string
 * @param html 
 */
export function stripHtml(html: string): string {
    let tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}

interface RequirementsWithIndexSignature extends Requirements {
    [other: string]: any;
}
/**
 * Remove the completed courses from the initial requirements
 * @param completedCourses 
 * @param initialRequirements 
 * @returns the updated requirements
 */
export function getUpdatedRequirements(completedCourses: Course[], initialRequirements: Requirements): Requirements {
    let updatedRequirements: RequirementsWithIndexSignature = Object.assign({}, initialRequirements);
    let uocCompleted = 0;
    
    if (!Array.isArray(completedCourses)) {
        return initialRequirements;
    }
    else {
        // Loop through each completedCourse
        completedCourses.forEach((completedCourse) => {
            // Loop through each rule name (e.g. core courses)
            const ruleNames = Object.keys(updatedRequirements);
            ruleNames.forEach((ruleName) => {
                // Loop through each individual rule within the rule name
                if (Array.isArray(updatedRequirements[ruleName])) {
                    updatedRequirements[ruleName].forEach((rule: Rule) => {
                        // See if courses exists within the individual rule
                        if (rule.courses) {
                            // Try to find the completedCourse's code        
                            const removedCourse = _.remove(rule.courses, function(course) {
                                return course.code === completedCourse.course_code
                            });

                            // Reduce the program's minimum UOC by removedCourse[0].creditPoints
                            if (removedCourse[0]) {
                                uocCompleted = Number(removedCourse[0].credit_points);

                                // Reduce the credit_points of the rule
                                if (rule.credit_points) {
                                    rule.credit_points = String(Number(rule.credit_points) - uocCompleted); 
                                }

                                // Reduce the credit_points_max of the rule
                                if (rule.credit_points_max) {
                                    rule.credit_points_max = String(Number(rule.credit_points_max) - uocCompleted); 
                                }
                            }
                        }
                    });
                }
            });
        });

        updatedRequirements.minimumUOC = Number(updatedRequirements.minimumUOC) - uocCompleted;
        console.log("updated", updatedRequirements);
        
        return updatedRequirements;
    }
}