import { useState } from "react";
import LuckitLogo from "../components/Logo";
import cls from "./Login.module.scss";
import clsx from "clsx";
import { validateEmail } from "../utils/string";
export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className={cls.Login}>
            <div className={cls.Intro}>
                <div className={cls.Logo}>
                    <LuckitLogo />
                </div>
                <div className={cls.Title}>
                    <h1>welcome to luckit</h1>
                    <p>
                        login to your Locket account to continue.
                    </p>
                </div>
            </div>
            <div className={cls.Form}>
                <input
                    className={cls.Input}
                    type="text"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className={cls.Input}
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    disabled={!email || !password || !validateEmail(email)}
                    className={clsx(cls.Button, "btn")}>
                    login
                </button>
            </div>
            <p className={cls.forkMe}>
                made with luv by <a target="_blank" href="https://github.com/michioxd">michioxd</a> - <a target="_blank" href="https://github.com/michioxd/luckit">fork me on github</a>
            </p>
        </div>
    )
}