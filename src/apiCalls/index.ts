import axios, { AxiosRequestConfig } from 'axios';
import { Course, Program, ReturnedCourse } from '../types';

const domain = process.env.REACT_APP_DEPLOYMENT === 'production' ? 'https://04mipups4j.execute-api.ap-southeast-2.amazonaws.com' : 'http://localhost:3000';

interface ReturnedProgram {
    item: Program
}

/**
 * Takes in a query and returns max 40 programs that match
 * @param query 
 * @returns a promise of an array of returned programs
 */
export function getProgramList(query: string): Promise<ReturnedProgram[]> {
    return new Promise(async (resolve, reject) => {
        try {
            var config: AxiosRequestConfig = {
                method: 'post',
                url: `${domain}/program/autocomplete`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { query }
            };

            axios(config)
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(function (error) {
                    console.log("AXIOS ERROR GETTING PROGRAM LIST", error);
                    reject(error);
                });
        } catch (ex) {
            console.log("EXCEPTION GETTING PROGRAM LIST", ex);
            reject(ex);
        }
    });
}

/**
 * Get an individual program
 * @param code 
 * @param year 
 */
export function getProgram(code: string, year: string): Promise<Program | undefined> {
    return new Promise(async (resolve, reject) => {
        try {

            var config: AxiosRequestConfig = {
                method: 'post',
                url: `${domain}/program/get`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    code: code,
                    implementation_year: year
                }
            };

            axios(config)
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(function (error) {
                    console.log("AXIOS ERROR GETTING PROGRAM", error);
                    reject(error);
                });
        } catch (ex) {
            console.log("EXCEPTION GETTING PROGRAM", ex);
            reject(ex);
        }
    });
}

/**
 * Return the requirements to be completed
 * @param code 
 * @param implementation_year 
 * @param specialisations 
 */
export function getRequirements(code: string, implementation_year: string, specialisations: {
    Majors: string[];
    Minors: string[];
    Honours: string[];
    Specialisations: string[];
}[]) {
    return new Promise(async (resolve, reject) => {
        try {
            var postData = {
                code, implementation_year, specialisations
            }

            var config: AxiosRequestConfig = {
                method: 'post',
                url: `${domain}/program/requirements`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: postData
            };

            axios(config)
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(function (error) {
                    console.log("AXIOS ERROR GETTING REQUIREMENTS", error);
                    reject(error);
                });
        } catch (ex) {
            console.log("EXCEPTION GETTING REQUIREMENTS", ex);
            reject(ex);
        }
    });
}

/**
 * Takes in a query and returns courses that match the query
 * @param query 
 */
export function getCourseList(query: string): Promise<ReturnedCourse[]> {
    return new Promise(async (resolve, reject) => {
        try {
            var config: AxiosRequestConfig = {
                method: 'post',
                url: `${domain}/course/autocomplete`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { query }
            };

            axios(config)
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(function (error) {
                    console.log("AXIOS ERROR GETTING COURSE LIST", error);
                    reject(error);
                });
        } catch (ex) {
            console.log("EXCEPTION GETTING COURSE LIST", ex);
            reject(ex);
        }
    });
}

export function getCourse(course_code: string): Promise<{Item: Course}> {
    return new Promise(async (resolve, reject) => {
        try {
            var config: AxiosRequestConfig = {
                method: 'post',
                url: `${domain}/course/get`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    course_code: course_code
                }
            };

            axios(config)
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(function (error) {
                    console.log("AXIOS ERROR GETTING COURSE", error);
                    reject(error);
                });
        } catch (ex) {
            console.log("EXCEPTION GETTING COURSE", ex);
            reject(ex);
        }
    });
}

export function getReactions(course_code: string): Promise<[string, number][]> {
    return new Promise(async (resolve, reject) => {
        try {
            var config: AxiosRequestConfig = {
                method: 'post',
                url: `${domain}/ratings/get`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    course_code: course_code
                }
            };

            axios(config)
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(function (error) {
                    console.log("AXIOS ERROR GETTING COURSE", error);
                    reject(error);
                });
        } catch (ex) {
            console.log("EXCEPTION GETTING REACTIONS", ex);
            reject(ex);
        }
    });
}