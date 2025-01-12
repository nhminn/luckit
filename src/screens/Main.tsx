import cls from "./Main.module.scss"
import Logo from "./../assets/logo.svg"
import { PiChatCircleDuotone } from "react-icons/pi"

export default function MainScreen() {
    return (
        <div className={cls.MainScreen}>
            <div className={cls.Moment}>
                <div className={cls.Main}>
                    <div className={cls.Image}>
                        <div className={cls.Caption}>
                            wtf lmao lmao
                        </div>
                    </div>
                    <div className={cls.UserInfo}>
                        <img className={cls.Avatar} alt="" src={Logo} />
                        <span className={cls.Name}>
                            helloworld
                        </span>
                        <span className={cls.Time}>
                            1h ago
                        </span>
                        <div className={cls.ChatBtn}>
                            <PiChatCircleDuotone />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}