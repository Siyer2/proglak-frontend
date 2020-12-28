import AsyncSelect from 'react-select/async';
import { ValueType, OptionTypeBase, ActionMeta } from 'react-select';
import { Form, Col, Button } from 'react-bootstrap';
import { getCourseList } from '../apiCalls';
import { useState } from 'react';
import { ReturnedCourse } from '../types';

function CourseSelector() {
    //==== State ====//
    const [courseInput, setCourseInput] = useState<{course: ReturnedCourse, label: string} | null>(null);
    const [completedCourses, setCompletedCourses] = useState<ReturnedCourse[]>([]);
    //==== End state ====//
    console.log("courseInput", courseInput);

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
     * Handle when Add is clicked
     * Append it to state as completedCourses
     * Reset the courseInput
     * Make changes to the results
     */
    function courseAdded() {
        if (courseInput) {
            // Add to completedCourses
            const newCompletedCourses = completedCourses.concat([courseInput.course]);
            setCompletedCourses(newCompletedCourses);
            
            // Clear courseInput
            setCourseInput(null);
        }
    }

    const listOfCompletedCourses = completedCourses.length && completedCourses.map((completedCourse, i) => {
        const link = `https://www.handbook.unsw.edu.au${completedCourse.item.Item.link}`;
        return (
            <a style={{ textDecoration: 'none' }} href={link} target='_blank' rel="noopener noreferrer" key={completedCourse.item.Item.course_code + i}>
                <Button variant="secondary" block>
                    {completedCourse.item.Item.course_code}: {completedCourse.item.Item.name}
                </Button>
            </a>
        )
    });

    return (
        <Form style={{ padding: '10px' }}>
            <Form.Row>
                <Col>
                    {/* <AsyncSelect onChange={handleCourseInputChange} cacheOptions defaultOptions={getDefaultOptions()} loadOptions={promiseOptions} placeholder={"Add courses you've completed..."} value={courseInput} /> */}
                    <AsyncSelect onChange={handleCourseInputChange} defaultOptions loadOptions={promiseOptions} placeholder={"Add courses you've completed..."} value={courseInput} />
                    {/* {courseError &&
                        <Form.Text className="text-muted">
                            {courseError}
                        </Form.Text>
                    } */}
                </Col>
                <Col xs="auto">
                    <Button onClick={() => { courseAdded() }} className="mb-2">
                        Add
                    </Button>
                </Col>
            </Form.Row>
                {completedCourses.length ?
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