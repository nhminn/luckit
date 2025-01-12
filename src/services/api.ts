import { LoginPayloadType, LoginResponseType, RefreshTokenPayloadType } from "../types/auth"

type ResponseError<T> = {
    error: T
}

type GenericError = {
    code: number,
    message: string,
    errors: {
        message: string,
        domain: string,
        reason: string
    }[]
}

export async function fetchFirebase<Request, ResponseOk, ResponseNotOk>({
    endpoint, method, body, token
}: {
    endpoint: string,
    method: string,
    body?: Request,
    token?: string
}) {

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept-Language', 'en-US');
    headers.append('User-Agent', 'FirebaseAuth.iOS/10.23.1 com.locket.Locket/1.82.0 iPhone/18.0 hw/iPhone12_1');
    headers.append('X-Ios-Bundle-Identifier', 'com.locket.Locket');
    headers.append('X-Client-Version', 'iOS/FirebaseSDK/10.23.1/FirebaseCore-iOS');
    headers.append('X-Firebase-GMPID', '1:641029076083:ios:cc8eb46290d69b234fa606');
    headers.append('X-Firebase-Client', 'H4sIAAAAAAAAAKtWykhNLCpJSk0sKVayio7VUSpLLSrOzM9TslIyUqoFAFyivEQfAAAA');
    headers.append('X-Firebase-AppCheck', 'eyJraWQiOiJNbjVDS1EiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxOjY0MTAyOTA3NjA4Mzppb3M6Y2M4ZWI0NjI5MGQ2OWIyMzRmYTYwNiIsImF1ZCI6WyJwcm9qZWN0c1wvNjQxMDI5MDc2MDgzIiwicHJvamVjdHNcL2xvY2tldC00MjUyYSJdLCJwcm92aWRlciI6ImRldmljZV9jaGVja19kZXZpY2VfaWRlbnRpZmljYXRpb24iLCJpc3MiOiJodHRwczpcL1wvZmlyZWJhc2VhcHBjaGVjay5nb29nbGVhcGlzLmNvbVwvNjQxMDI5MDc2MDgzIiwiZXhwIjoxNzIyMTY3ODk4LCJpYXQiOjE3MjIxNjQyOTgsImp0aSI6ImlHUGlsT1dDZGg4Mll3UTJXRC1neEpXeWY5TU9RRFhHcU5OR3AzTjFmRGcifQ.lqTOJfdoYLpZwYeeXtRliCdkVT7HMd7_Lj-d44BNTGuxSYPIa9yVAR4upu3vbZSh9mVHYS8kJGYtMqjP-L6YXsk_qsV_gzKC2IhVAV6KbPDRHdevMfBC6fRiOSVn7vt749GVFdZqAuDCXhCILsaMhvgDBgZoDilgAPtpNwyjz-VtRB7OdOUbuKTCqdoSOX0SJWVUMyuI8nH0-unY--YRctunK8JHZDxBaM_ahVggYPWBCpzxq9Yeq8VSPhadG_tGNaADStYPaeeUkZ7DajwWqH5ze6ESpuFNgAigwPxCM735_ZiPeD7zHYwppQA9uqTWszK9v9OvWtFCsgCEe22O8awbNbuEBTKJpDQ8xvZe8iEYyhfUPncER3S-b1CmuXR7tFCdTgQe5j7NGWjFvN_CnL7D2nudLwxWlpqwASCHvHyi8HBaJ5GpgriTLXAAinY48RukRDBi9HwEzpRecELX05KTD2lTOfQCjKyGpfG2VUHP5Xm36YbA3iqTDoDXWMvV');

    if (token) {
        headers.append('Authorization', `Bearer ${token}`);
    }

    return new Promise<ResponseOk>((res, rej) => {
        (async () => {
            try {
                const response = await fetch(`${endpoint}?key=AIzaSyCQngaaXQIfJaH0aS2l7REgIjD7nL431So`, {
                    method,
                    headers,
                    body: JSON.stringify(body)
                });

                if (response.status !== 200) {
                    rej(await response.json() as ResponseError<ResponseNotOk>);
                    return;
                }

                res(await response.json() as ResponseOk);
            } catch (error) {
                rej(error);
            }
        })();
    });
}

export const API = {
    login: (email: string, password: string) => fetchFirebase<LoginPayloadType, LoginResponseType, GenericError>({
        endpoint: "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword",
        method: "POST",
        body: {
            email,
            password,
            returnSecureToken: true,
            clientType: "CLIENT_TYPE_IOS"
        }
    }),
    refreshToken: (refreshToken: string) => fetchFirebase<RefreshTokenPayloadType, LoginResponseType, GenericError>({
        endpoint: "https://securetoken.googleapis.com/v1/token",
        method: "POST",
        body: {
            grantType: "refresh_token",
            refreshToken: refreshToken
        }
    }),
}