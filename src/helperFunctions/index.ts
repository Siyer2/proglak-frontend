import _ from 'lodash';

import { Course, Requirements, Rule } from "../types";
import store from '../index';

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
    const state = store.getState();

    let updatedRequirements: RequirementsWithIndexSignature = _.cloneDeep(state.requirements.requirements);
    let uocCompleted = 0;
    
    if (!Array.isArray(completedCourses)) {
        return initialRequirements;
    }
    else {
        // Loop through each completedCourse
        completedCourses.forEach((completedCourse) => {
            let completedUOCFromCourse = 0;
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
                                completedUOCFromCourse = Number(removedCourse[0].credit_points);

                                // Reduce the credit_points of the rule
                                if (rule.credit_points) {
                                    rule.credit_points = String(Number(rule.credit_points) - completedUOCFromCourse); 
                                }

                                // Reduce the credit_points_max of the rule
                                if (rule.credit_points_max) {
                                    rule.credit_points_max = String(Number(rule.credit_points_max) - completedUOCFromCourse); 
                                }

                                // Add the completed course to it's own member variable
                                if (rule.completed_courses) {
                                    rule.completed_courses.push(removedCourse[0]);
                                }
                                else {
                                    rule.completed_courses = [removedCourse[0]];
                                }
                            }
                        }
                    });
                }
            });
            uocCompleted += Number(completedUOCFromCourse);
        });

        updatedRequirements.minimumUOC = Number(updatedRequirements.minimumUOC) - uocCompleted;
        return updatedRequirements;
    }
}

export function ruleIsCompleted(rule: Rule, ruleName: string): boolean {
    let isCompleted = false;
    if (ruleName === "One of the Following") {
        if (rule.completed_courses && rule.completed_courses.length) {
            isCompleted = true;
        }
    }
    else if (Array.isArray(rule.completed_courses) &&
        (Number(rule.credit_points) === 0 || Number(rule.credit_points_max) === 0
        || (rule.courses && rule.courses.length === 0))
    ) {
        isCompleted = true;
    }
    
    return isCompleted;
}