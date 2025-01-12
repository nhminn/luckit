import cls from "./Main.module.scss"
import { useCallback, useEffect, useState } from "react";
import { SavedMomentType } from "../types/moments";
import { timeSinceOf } from "../utils/string";
import { MdOutlineImageNotSupported } from "react-icons/md";
import clsx from "clsx";
import { IoMdArrowRoundUp } from "react-icons/io";

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

function MomentItem({ moment }: { moment: SavedMomentType }) {
    return (
        <div className={cls.Main}>
            <div className={cls.Image} style={{ "--moment-img": "url(" + moment?.thumbnail_url + ")" } as React.CSSProperties}>
                {moment?.caption?.length > 0 &&
                    <div className={cls.Caption}>
                        {moment?.caption}
                    </div>
                }
            </div>
            <div className={cls.UserInfo}>
                {moment?.user.avatar && <img className={cls.Avatar} alt="" src={moment?.user.avatar} />}
                <span className={cls.Name}>
                    {moment?.user.username}
                </span>
                <TimeCount date={moment?.seconds || 0} />
            </div>
        </div>
    )
}

export default function MainScreen() {
    const [momentLoaded, setMomentLoaded] = useState<SavedMomentType[]>([]);
    const [inItem, setInItem] = useState(0);
    const [showNewItemBtn, setShowNewItemBtn] = useState(false);

    const handleNewMoment = (isNew?: boolean) => {
        chrome.storage.local.get(['moments'], (result) => {
            if (result.moments) {
                chrome.runtime.sendMessage({ clearBadge: true });
                setMomentLoaded(result.moments as SavedMomentType[]);
                isNew && setInItem(p => p > 0 ? p + 1 : 0);
            }
        });
    }

    useEffect(() => {
        handleNewMoment();
        const handler = (message: any) => {
            if (message.newMoment) {
                setShowNewItemBtn(true);
                handleNewMoment(true);
            }
        }
        chrome.runtime.onMessage.addListener(handler);

        return () => {
            chrome.runtime.onMessage.removeListener(handler);
        }
    }, []);

    const handleChangeTile = useCallback((add: boolean) => {
        setInItem(p => {
            if (add) {
                if (p + 1 >= momentLoaded.length - 1) return momentLoaded.length - 1;
                return p + 1;
            } else {
                if (p - 1 <= 0) return 0;
                return p - 1;
            }
        })
    }, [momentLoaded]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                handleChangeTile(e.key === "ArrowDown");
            }
        }

        const onWheel = (e: WheelEvent) => {
            handleChangeTile(e.deltaY > 0);
        }

        window.addEventListener("keydown", onKey);
        window.addEventListener("wheel", onWheel);

        return () => {
            window.removeEventListener("keydown", onKey);
            window.removeEventListener("wheel", onWheel);
        }
    }, [handleChangeTile]);

    return (
        <div className={cls.MainScreen}>
            <div className={cls.Moment}>
                <button onClick={() => { setInItem(0); setShowNewItemBtn(false) }} className={clsx("btn", cls.NewBtn, showNewItemBtn && cls.ShowBtn)}>
                    new moment <span><IoMdArrowRoundUp /></span>
                </button>
                {momentLoaded.length < 1 ? (
                    <div className={cls.NoMoment}>
                        <div className={cls.NoImage}>
                            <MdOutlineImageNotSupported />
                        </div>
                        <h2>no moment to show right now...</h2>
                        <p>wait a bit for us to hear your friend</p>
                    </div>
                ) : (
                    <div className={cls.LsMoment} style={{ transform: `translateY(-${inItem * (100 / momentLoaded.length)}%)` }}>
                        {momentLoaded.map((moment, index) => (
                            <MomentItem key={index} moment={moment} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}