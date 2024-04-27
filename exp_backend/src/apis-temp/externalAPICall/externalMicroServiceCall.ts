import { OK } from 'http-status';
import fetch, { HeadersInit, RequestInit } from 'node-fetch';

import { getAccessToken } from '../../config/accessToken';


export async function getAPIData<T>(
    url: string,
    options: RequestInit
): Promise<T> {
    const response = await fetch(url, options);
    if (response.status == OK) return response.json() as Promise<T>;
    const errorObject = JSON.parse(await response.text());
    throw { statusCode: response.status, ...(errorObject ?? {}) };
}

export const getBusinessNames = async (
    businessKeys: string[]
): Promise<any> => {
    if (!businessKeys?.length) {
        return {};
    }
    const accessToken = await getAccessToken();

    const options: RequestInit = {
        body: JSON.stringify({
            businesses: businessKeys,
        }),
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    };

    const response: any = await getAPIData('businessNameUrl', options);

    return response?.data;
};


export const getBusinessDetails = async (businessKey: string) => {
    const businessDetailURL = `${'customerMgmtAPI'}/${businessKey}`;

    const token = await getAccessToken();

    const options: RequestInit = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    };

    const res: any = await getAPIData(businessDetailURL, options);

    return res?.data;
};

