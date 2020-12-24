import axios, { AxiosRequestConfig } from 'axios';
import { Program } from '../types';

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