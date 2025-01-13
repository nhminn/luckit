import { useCallback, useEffect, useState } from "react";
import cls from "./SavedSection.module.scss";
import { SavedMomentType } from "../types/moments";

export default function SavedMoment({ setInItem }: { setInItem: (i: number) => void }) {
    const [allMoments, setAllMoments] = useState<SavedMomentType[]>([]);

    const handleNewMoment = useCallback(() => {
        chrome.storage.local.get(['moments'], (result) => {
            if (result.moments) {
                setAllMoments(result.moments as SavedMomentType[]);
            }
        });
    }, []);

    useEffect(() => {
        handleNewMoment();
        const handler = (message: any) => {
            if (message.newMoment) {
                handleNewMoment();
                return;
            }
        }

        chrome.runtime.onMessage.addListener(handler);

        return () => {
            chrome.runtime.onMessage.removeListener(handler);
        }
    }, [handleNewMoment]);

    return (
        <div className={cls.SavedMoment}>
            {allMoments.map((moment, i) => (
                <div key={i}
                    className={cls.Moment}
                    onClick={() => setInItem(i)}
                    style={{ backgroundImage: `url(${moment.thumbnail_url})` }}
                ></div>
            ))}
        </div>
    )
}