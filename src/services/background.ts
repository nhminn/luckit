import { SavedMomentType } from "../types/moments";
import { API } from "./api";
import { md5 } from 'js-md5';

async function FetchLatestMoment() {
    let token = "", refreshToken = "";

    if (await new Promise((ok) => {
        chrome.storage.local.get(['token', 'refreshToken'], (result) => {
            if (result.token && result.refreshToken) {
                token = result.token;
                refreshToken = result.refreshToken;
                ok(true);
                return;
            }

            ok(false);
        })
    }) === false) {
        return;
    }

    try {
        await API.getAccountInfo(token);
    } catch (e: any) {
        if (e?.error?.message === "Unauthenticated") {
            try {
                const newToken = await API.refreshToken(refreshToken);

                if (!newToken.access_token) {
                    chrome.storage.local.remove(['token', 'refreshToken', 'user'], () => {
                        chrome.runtime.sendMessage({ logout: true });
                        console.log("token expired, please login again");
                    });
                    return;
                }

                token = newToken.access_token;
                refreshToken = newToken.refresh_token;

                chrome.storage.local.set({
                    token,
                    refreshToken
                });
            } catch (e: any) {
                console.error("Cannot refresh token", e);
                return;
            }
        }
    }

    const moment = await API.fetchLatestMoment(token);

    if (!moment.data[0]) {
        console.log("Cannot get latest moment");
        return;
    }

    const lastMD5 = await new Promise<string>((res) => {
        chrome.storage.local.get(['lastMD5'], (result) => {
            res(result.lastMD5 || "");
        });
    });

    const currentMD5 = md5(JSON.stringify(moment.data[0]));
    const thisMoment = moment.data[0];

    if (lastMD5 === currentMD5) {
        console.log("no new moment");
        return;
    }

    const thisUser = await API.fetchUser(thisMoment.user, token);

    if (!thisUser?.data?.uid) {
        console.log("cannot get user info");
        return;
    }

    await new Promise((res) => {
        fetch(thisMoment.thumbnail_url, {
            mode: 'no-cors'
        })
            .then(response => response.blob())
            .then(blob => {
                const reader = new FileReader();
                reader.onloadend = function () {
                    const base64String = reader.result;
                    chrome.storage.local.set({ ['moment_img']: base64String }, () => {
                        res(true);
                    });
                };
                reader.readAsDataURL(blob);
            })
            .catch(error => {
                console.error('Failed to fetch and save image:', error);
                res(false);
            });
    })

    chrome.storage.local.set({
        lastMD5: currentMD5,
        moment: {
            user: {
                username: thisUser.data.first_name + " " + thisUser.data.last_name,
                avatar: thisUser.data.profile_picture_url,
                uid: thisUser.data.uid
            },
            md5: thisMoment.md5,
            thumbnail_url: thisMoment.thumbnail_url,
            seconds: thisMoment.date._seconds * 1000,
            caption: thisMoment.caption
        } as SavedMomentType
    }, () => chrome.runtime.sendMessage({ newMoment: true }));
}

chrome.runtime.onMessage.addListener((message) => {
    if (message.fetchLatestMoment) {
        FetchLatestMoment();
    }
});

const loop = async () => {
    try { await FetchLatestMoment(); } catch (e) { }
    setTimeout(loop, 25e3);
};

(async () => loop())();