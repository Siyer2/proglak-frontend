import _ from 'lodash';

import AsyncSelect from 'react-select/async';
import { ValueType, OptionTypeBase, ActionMeta } from 'react-select';
import { Form, Col, Button } from 'react-bootstrap';
import { getCourseList } from '../apiCalls';
import { useState } from 'react';
import { Course, ReturnedCourse } from '../types';

interface CourseSelectorProps {
    courseChanged: (completedCourses: Course[]) => void;
    completedCourses: Course[];
}

function CourseSelector(props: CourseSelectorProps) {
    //==== State ====//
    const [courseInput, setCourseInput] = useState<{course: ReturnedCourse, label: string} | null>(null);
    //==== End state ====//

    const promiseOptions = (inputValue: string) => {
        return new Promise(async resolve => {
            const courses = await getCourseList(inputValue);
            const formattedCourses = courses.map((course) => {
                return {
                    course,
                    label: `${course.item.Item.course_code}: ${course.item.Item.name}`
                }
            });

            resolve(formattedCourses);
        });
    }

    /**
     * Handle when a new course is selected (before add is clicked)
     * Add it to state as courseInput
     * @param selectedCourse 
     * @param action 
     */
    const handleCourseInputChange = (selectedCourse: ValueType<OptionTypeBase, false>, action: ActionMeta<OptionTypeBase>) => {
        if (selectedCourse) {
            const newCourseInput: { course: ReturnedCourse, label: string } = {
                course: selectedCourse.course, 
                label: selectedCourse.label
            };
    
            setCourseInput(newCourseInput);
        }
    }

    /**
     * Handle when a course is added or removed
     * @param actionType whether the action is to add or remove a course
     * @param courseCodeToRemove 
     */
    function courseChanged(actionType: 'added' | 'removed', courseCodeToRemove?: string) {
        let newCompletedCourses: Course[] = [];
        if (actionType === "added") {
            if (courseInput) {
                // Add to completedCourses
                const courseToAdd: Course = {
                    course_code: courseInput.course.item.Item.course_code,
                    implementation_year: courseInput.course.item.Item.implementation_year,
                    link: courseInput.course.item.Item.link,
                    name: courseInput.course.item.Item.name,
                    credit_points: courseInput.course.item.Item.credit_points
                }
                newCompletedCourses = props.completedCourses.concat([courseToAdd]);

                // Clear courseInput
                setCourseInput(null);
            }
        }
        else {
            // Remove the course from completedCourses
            newCompletedCourses = _.remove(props.completedCourses, function(course) {
                return course.course_code !== courseCodeToRemove;
            });
        }

        props.courseChanged(newCompletedCourses);
    }

    const listOfCompletedCourses = props.completedCourses.length && props.completedCourses.map((completedCourse, i) => {
        const link = `https://www.handbook.unsw.edu.au${completedCourse.link}`;
        return (
            <Form.Row key={completedCourse.course_code + i}>
                <Col>
                    <a style={{ textDecoration: 'none' }} href={link} target='_blank' rel="noopener noreferrer">
                        <Button variant="secondary" block>
                                {completedCourse.course_code}: {completedCourse.name}
                        </Button>
                    </a>
                </Col>
                <Col xs="auto">
                    <Button className="mb-2" onClick={() => { courseChanged('removed', completedCourse.course_code) }}>
                        X
                    </Button>
                </Col>
            </Form.Row>
        )
    });

    return (
        <Form style={{ padding: '10px' }}>
            <Form.Row>
                <Col>
                    <AsyncSelect onChange={handleCourseInputChange} loadOptions={promiseOptions} placeholder={"Add courses you've completed..."} value={courseInput} />
                </Col>
                <Col xs="auto">
                    <Button onClick={() => { courseChanged('added') }} className="mb-2">
                        Add
                    </Button>
                </Col>
            </Form.Row>
                {props.completedCourses.length ?
                    <>
                        Completed Courses:
                        {listOfCompletedCourses}
                    </>
                    : <></>
                }
        </Form>
    )
}

export default CourseSelector;