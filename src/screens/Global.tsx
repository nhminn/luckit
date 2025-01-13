import MainScreen from "./Main";
import cls from "./Global.module.scss";
import { PiDotsThreeOutlineVerticalLight } from "react-icons/pi";
import { Menu, MenuButton, MenuItem, SubMenu } from "@szhsin/react-menu";
import clsx from "clsx";
import { useMainContext } from "../MainContext";
import { IoMdHeartEmpty } from "react-icons/io";
import { HiLogout, HiOutlineDownload } from "react-icons/hi";
import { GrAppsRounded } from "react-icons/gr";
import { AiOutlineClear } from "react-icons/ai";
import { VERSION } from "../const";
import { MdRefresh } from "react-icons/md";
import { useState } from "react";
import { SavedMomentType } from "../types/moments";

const menuItemClassName = ({ hover }: { hover: boolean }) =>
    clsx(cls.MenuItem, hover && cls.hover);

const RefreshMenuItem = () => {
    const [disabledRefresh, setDisabledRefresh] = useState(false);

    return (
        <MenuItem disabled={disabledRefresh} onClick={() => {
            if (disabledRefresh) return;
            setDisabledRefresh(true);
            chrome.runtime.sendMessage({ fetchLatestMoment: true }, () => {
                setTimeout(() => {
                    setDisabledRefresh(false);
                }, 5e3);
            });
        }} className={menuItemClassName}>
            <MdRefresh />
            {disabledRefresh ? "Refreshing..." : "Refresh"}
        </MenuItem>
    )
}

export default function GlobalScreen() {
    const mainCtx = useMainContext();
    const [inItem, setInItem] = useState(0);

    return (
        <div className={cls.Global}>
            <Menu menuClassName={cls.Menu} menuButton={<MenuButton className={cls.MenuBtn}>
                <PiDotsThreeOutlineVerticalLight />
            </MenuButton>} transition>
                <SubMenu label={
                    <>
                        <img className={cls.Avatar} src={mainCtx?.userData?.photoUrl} alt={mainCtx?.userData?.displayName} />
                        <span className={cls.Name}>{mainCtx?.userData?.displayName ? mainCtx?.userData?.displayName : mainCtx?.userData?.email}</span>
                    </>
                } menuClassName={cls.Menu} className={cls.AccountMenu}>
                    <MenuItem className={menuItemClassName}>
                        <AiOutlineClear />
                        Clear all saved moments
                    </MenuItem>
                    <MenuItem onClick={() => {
                        chrome.runtime.sendMessage({ actionLogout: true });
                        mainCtx.setLoggedIn(false);
                    }} className={menuItemClassName}>
                        <HiLogout />
                        Logout
                    </MenuItem>
                </SubMenu>
                <MenuItem href="https://github.com/michioxd/luckit" target="_blank" className={menuItemClassName}>
                    <IoMdHeartEmpty />
                    luckit v{VERSION}
                </MenuItem>
                <RefreshMenuItem />
                <MenuItem className={menuItemClassName}>
                    <GrAppsRounded />
                    All saved moments
                </MenuItem>
                <MenuItem onClick={() => {
                    chrome.storage.local.get(['moments'], (result) => {
                        if (result.moments) {
                            const moments = result.moments as SavedMomentType[];
                            const moment = moments[inItem];
                            if (!moment) return;
                            chrome.downloads.download({
                                url: moment.thumbnail_url,
                                filename: moment.md5 + ".webp",
                                saveAs: true
                            });
                        }
                    });
                }} className={menuItemClassName}>
                    <HiOutlineDownload />
                    Download this image
                </MenuItem>
            </Menu>
            <MainScreen
                inItem={inItem}
                setInItem={setInItem}
            />
        </div>
    )
}