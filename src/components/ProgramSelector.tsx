import React from 'react';
import { Link } from 'react-router-dom';

import { Form, Col, Button } from 'react-bootstrap';
import Select, { ValueType, OptionTypeBase, ActionMeta } from 'react-select';
import AsyncSelect from 'react-select/async';

import { getProgramList } from '../apiCalls';

function ProgramSelector() {
    // Program selector helpers
    const promiseOptions = (inputValue: string) => {
        return new Promise(async resolve => {
            const programs = await getProgramList(inputValue);
            
            const formattedPrograms = programs.map((program) => {
                return {
                    year: program.item.Item.implementation_year,
                    code: program.item.Item.code,
                    label: `${program.item.Item.code}: ${program.item.Item.title} (${program.item.Item.implementation_year})`
                }
            });
            resolve(formattedPrograms);
        });
    }

    return (
        <div className="jumbotron">
            {/* Programs */}
            <Form>
                <label>Program</label>
                <Form.Row>
                    <Col>
                        <AsyncSelect cacheOptions defaultOptions loadOptions={promiseOptions} placeholder={'Search for a program...'} />
                    </Col>
                    <Col xs="auto">
                        {/* <Button onClick={() => { programAdded() }} className="mb-2"> */}
                        <Button className="mb-2">
                            Add
                        </Button>
                    </Col>
                </Form.Row>
            </Form>

            {/* Specialisations */}


            {/* Go */}
            {/* <Link to={{ pathname: "/results", initialRequirements: selectedProgram }}>
                <button onClick={() => { goClicked() }} type="submit" disabled={isGoDisabled} className="btn btn-primary">
                    Go
                </button>
            </Link> */}
        </div>
    )
}

export default ProgramSelector;