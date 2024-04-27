import express, { NextFunction, Request, Response } from "express";
import { config } from './config';
import session from "express-session";
import * as a from "axios"
const axios = a.default
import { APIError } from '../helpers/APIError';

const memoryStore = new session.MemoryStore();

let _accessToken = "";

export async function getAccessToken() 
{
	if (_accessToken === "")
	{
		_accessToken = await getNewToken();

		setInterval(async ()=> {
			_accessToken = await getNewToken();
		}, 240000) //Token renews every 4 minutes (expiry: 5 mins)
	}

	return _accessToken
}

async function getNewToken() 
{
    const tokenFormBody = new URLSearchParams();
    //tokenFormBody.append("grant_type", testKeycloakConfig.grantType || "");
    //tokenFormBody.append('client_id', testKeycloakConfig.clientId || "");
    //tokenFormBody.append('client_secret', testKeycloakConfig.clientSecret || "");

    const tokenResp = await axios({
        method: "post",
        url: '',
        headers: {
            'Content-Type': "application/x-www-form-urlencoded",
        },
        data: tokenFormBody,
    });		
    
    return tokenResp.data.access_token		
}