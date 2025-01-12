export interface GetAccountInfoResponseType {
    kind: "identitytoolkit#GetAccountInfoResponse";
    users: User[];
}

export interface User {
    localId: string;
    email: string;
    displayName: string;
    photoUrl: string;
    passwordHash: string;
    emailVerified: boolean;
    passwordUpdatedAt: number;
    providerUserInfo: ProviderUserInfo[];
    validSince: string;
    disabled: boolean;
    lastLoginAt: string;
    createdAt: string;
    customAuth: boolean;
    lastRefreshAt: Date;
}

export interface ProviderUserInfo {
    providerId: string;
    displayName: string;
    photoUrl: string;
    federatedId: string;
    email: string;
    rawId: string;
}

export interface UserInfoType {
    uid: string;
    first_name: string;
    last_name: string;
    badge: null;
    profile_picture_url: string;
    temp: boolean;
    username: string;
}
