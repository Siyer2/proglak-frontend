import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { Form, Col, Button } from 'react-bootstrap';
import Select, { ValueType, OptionTypeBase, ActionMeta } from 'react-select';
import AsyncSelect from 'react-select/async';

import { getProgramList, getProgram } from '../apiCalls';

interface ProgramInput {
    code: string;
    year: string;
}

function ProgramSelector() {
    //==== State ====//
    const [programInput, setProgramInput] = useState<ProgramInput | undefined>(undefined);
    const [programError, setProgramError] = useState<string | undefined>('unset');
    //==== End State ====//

    //==== Program selector helpers ====//
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

    /**
     * When a user selects a program, add it to programInput state
     * @param selectedProgram - The selected program
     * @param action - See https://react-select.com/advanced#action-meta
     */
    const handleProgramInputChange = (selectedProgram: ValueType<OptionTypeBase, false>, action: ActionMeta<OptionTypeBase>) => {
        if (selectedProgram) {
            setProgramInput({
                code: selectedProgram.code, 
                year: selectedProgram.year
            });
        }
        else {
            setProgramInput(undefined);
        }
    }

    /**
     * When a user selects a program and chooses 'Add'
     */
    async function programAdded() {
        if (programInput) {
            const code = programInput.code;
            const year = programInput.year;

            const program = await getProgram(code, year);

            if (!program) {
                setProgramError('Program not found');
            }
            else {
                console.log('successfully added', program);
                setProgramError('');
            }
        }
        else {
            setProgramError('Program not found');
        }
    }
    //==== End program selector helpers ====//

    return (
        <div className="jumbotron">
            {/* Programs */}
            <Form>
                <label>Program</label>
                <Form.Row>
                    <Col>
                        <AsyncSelect onChange={handleProgramInputChange} cacheOptions defaultOptions loadOptions={promiseOptions} placeholder={'Search for a program...'} />
                    </Col>
                    <Col xs="auto">
                        <Button onClick={() => { programAdded() }} className="mb-2">
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