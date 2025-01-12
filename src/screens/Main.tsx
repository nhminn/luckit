import cls from "./Main.module.scss"
import { PiChatCircleDuotone } from "react-icons/pi"
import { useEffect, useState } from "react";
import { SavedMomentType } from "../types/moments";
import { timeSinceOf } from "../utils/string";
import { MdOutlineImageNotSupported } from "react-icons/md";

function TimeCount({ date }: { date: number }) {
    const [time, setTime] = useState(timeSinceOf(date));

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(timeSinceOf(date));
        }, 1000);

        return () => {
            clearInterval(interval);
        }
    }, [date]);

    return <span className={cls.Time}>
        {time}
    </span>
}

export default function MainScreen() {
    const [momentLoaded, setMomentLoaded] = useState<SavedMomentType | null>(null);

    const handleNewMoment = () => {
        chrome.storage.local.get(['moment'], (result) => {
            if (result.moment) {
                setMomentLoaded(result.moment as SavedMomentType);
            }
        });
    }

    useEffect(() => {
        handleNewMoment();
        const handler = (message: any) => {
            if (message.newMoment) {
                handleNewMoment();
            }
        }
        chrome.runtime.onMessage.addListener(handler);

        return () => {
            chrome.runtime.onMessage.removeListener(handler);
        }
    }, []);

    return (
        <div className={cls.MainScreen}>
            <div className={cls.Moment}>
                {!momentLoaded ? (
                    <div className={cls.NoMoment}>
                        <div className={cls.NoImage}>
                            <MdOutlineImageNotSupported />
                        </div>
                        <h2>no moment to show right now...</h2>
                        <p>wait a bit for us to hear your friend</p>
                    </div>
                ) : (
                    <div className={cls.Main}>
                        <div className={cls.Image} style={{ "--moment-img": "url(" + momentLoaded?.thumbnail_url + ")" } as React.CSSProperties}>
                            {momentLoaded?.caption?.length > 0 &&
                                <div className={cls.Caption}>
                                    {momentLoaded?.caption}
                                </div>
                            }
                        </div>
                        <div className={cls.UserInfo}>
                            {momentLoaded?.user.avatar && <img className={cls.Avatar} alt="" src={momentLoaded?.user.avatar} />}
                            <span className={cls.Name}>
                                {momentLoaded?.user.username}
                            </span>
                            <TimeCount date={momentLoaded?.seconds || 0} />
                            <div className={cls.ChatBtn}>
                                <PiChatCircleDuotone />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}