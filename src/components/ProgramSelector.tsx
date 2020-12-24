import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { Form, Col, Button } from 'react-bootstrap';
import Select, { ValueType, OptionTypeBase, ActionMeta, OptionsType } from 'react-select';
import AsyncSelect from 'react-select/async';

import { getProgramList, getProgram } from '../apiCalls';
import { Program } from '../types';

enum SpecialisationType {
    Majors = 'Majors',
    Minors = 'Minors',
    Honours = 'Honours',
    Specialisations = 'Specialisations'
}

interface ProgramInput {
    code: string;
    year: string;
}

interface SelectedSpecialisations {
    Majors: IndividualSpecialisation[]; 
    Minors: IndividualSpecialisation[]; 
    Honours: IndividualSpecialisation[]; 
    Specialisations: IndividualSpecialisation[];
}

interface IndividualSpecialisation {
    value: string;
    label: string;
}

function ProgramSelector() {
    //==== State ====//
    const [programInput, setProgramInput] = useState<ProgramInput | undefined>(undefined);
    const [programError, setProgramError] = useState<string | undefined>('unset');
    const [selectedProgram, setSelectedProgram] = useState<Program | undefined>(undefined);

    const [selectedSpecialisations, setSelectedSpecialisations] = useState<SelectedSpecialisations>({
        Majors: [],
        Minors: [],
        Honours: [],
        Specialisations: []
    });
    const [selectedSimplifiedSpecialisations, setSelectedSimplifiedSpecialisations] = useState({
        Majors: [],
        Minors: [],
        Honours: [],
        Specialisations: []
    });
    const [specialisationError, setSpecialisationError] = useState('');
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
                setSelectedProgram(program);
                setProgramError('');
            }
        }
        else {
            setProgramError('Program not found');
        }
    }
    //==== End program selector helpers ====//

    //==== Specialisation helpers ====//
    function Specialialisations() {
        return (
            <>
                {selectedProgram && selectedProgram.Item.majors && SpecificSpecialisation(SpecialisationType.Majors, selectedProgram.Item.majors)}
                {selectedProgram && selectedProgram.Item.minors && SpecificSpecialisation(SpecialisationType.Minors, selectedProgram.Item.minors)}
                {selectedProgram && selectedProgram.Item.honours && SpecificSpecialisation(SpecialisationType.Honours, selectedProgram.Item.honours)}
                {selectedProgram && selectedProgram.Item.specialisations && SpecificSpecialisation(SpecialisationType.Specialisations, selectedProgram.Item.specialisations)}
            </>
        )
    }

    function SpecificSpecialisation(specialisationType: SpecialisationType, specialisationList: string[]) {
        const options: OptionsType<{value: string;label: string;}> | undefined = 
        (specialisationList && specialisationList.length) ? specialisationList.map((spec) => {
            return {
                value: spec,
                label: spec
            }
        })
        :
        undefined;

        const placeholder = `Select ${specialisationType}`;
        return (
            <div className="form-group">
                <Form>
                    <Form.Group controlId="exampleForm.SelectCustom">
                        <Form.Label>{specialisationType}</Form.Label>
                        <Select isMulti options={options} onChange={(e) => { handleSpecialisationChange(e, specialisationType) }} value={selectedSpecialisations[specialisationType]} placeholder={placeholder} />
                    </Form.Group>
                </Form>
            </div>
        )
    }

    function handleSpecialisationChange(value: ValueType<OptionTypeBase, false>, name: string) {
        // If no value, that means all specialisations have been removed, set to an empty array
        if (!value) {
            value = [];
        }

        // Need to setSelected AND setSimplified in state because Select requires different format to props.getProgramRequirements
        const specialisationValues: string[] = value.map((spec: IndividualSpecialisation) => { return spec.value });

        setSelectedSimplifiedSpecialisations(prevState => {
            return { ...prevState, [name]: specialisationValues };
        });
        setSelectedSpecialisations(prevState => {
            return { ...prevState, [name]: value };
        });

        // Reset error message
        setSpecialisationError('');
    }
    //==== End specialisation helpers ====//
    
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
            <Specialialisations />

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