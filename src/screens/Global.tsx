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

const menuItemClassName = ({ hover }: { hover: boolean }) =>
    clsx(cls.MenuItem, hover && cls.hover);

export default function GlobalScreen() {
    const mainCtx = useMainContext();
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
                    luckit v1.0
                </MenuItem>
                <MenuItem className={menuItemClassName}>
                    <GrAppsRounded />
                    All saved moments
                </MenuItem>
                <MenuItem className={menuItemClassName}>
                    <HiOutlineDownload />
                    Download this image
                </MenuItem>
            </Menu>
            <MainScreen />
        </div>
    )
}