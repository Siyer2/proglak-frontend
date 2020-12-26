interface Course {
    course_code: string;
    implementation_year: string;
    link: string;
    name: string;
    credit_points: string;
}

interface Program {
    Item: {
        code: string;
        implementation_year: string;
        minimumUOC: string;
        title: any;
        coreCourses?: any;
        generalEducation?: any;
        faculty?: any;
        maturityRules?: any;
        prescribedElectives?: any;
        freeElectives?: any;
        informationRules?: any;
        oneOfTheFollowings?: any;
        limitRules?: any;
        majors?: any;
        minors?: any;
        specialisations?: any;
        honours?: any;
        studyLevel?: any;
    }
}

interface Specialisation {
    specialisation_code: string;
    implementation_year: string;
    title: any;
    prescribedElectives?: any;
    coreCourses?: any;
    generalEducation?: any;
    oneOfTheFollowings?: any;
    maturityRules?: any;
    [other: string]: any;
}

interface Requirements {
    code: string;
    title: string;
    minimumUOC: string;
    implementation_year: string;
    specialisations?: string[],
    coreCourses?: any;
    generalEducation?: any;
    maturityRules?: any;
    prescribedElectives?: any;
    freeElectives?: any;
    informationRules?: any;
    oneOfTheFollowings?: any;
    limitRules?: any;
}

export type {
    Course,
    Program,
    Specialisation, 
    Requirements
}