import { createContext, useState } from "react";
import { Alert, Dimensions, Pressable, View } from "react-native";
import SignInForm from "../components/forms/SignInForm";
import SignUpForm from "../components/forms/SignUpForm";
import FormNote from "../components/forms/FormNote";
import ListEpisode from "../components/forms/ListEpisode";
import FormAllNote from "../components/forms/FormAllNote";
import MenuArea from "../components/MenuArea";
import FormDetailBroadCast from "../components/forms/DetailBroadCast";
import FormChangePassword from "../components/forms/ChangePassword";
import FormListGate from "../components/forms/FormListGate";
import FormPractice from "../components/forms/FormPractice";
export const menuContext = createContext()

const MenuProvider = ({ children }) => {
    const [display, setDisplay] = useState(false) // displayMenu
    const [displaySignIn, setDisplaySignIn] = useState(false)
    const [displaySignUp, setDisplaySignUp] = useState(false)
    const [displayNote, setDisplayNote] = useState(false)
    const [displayAllNote, setDisplayAllNote] = useState(false)
    const [displayListEpisode, setDisplayListEpisode] = useState(false)
    const [displayDetailBroadCast, setDisplayDetailBroadCast] = useState(false)
    const [displayChangePassword, setDisplayChangePassword] = useState(false)
    const [displayListGate, setDisplayListGate] = useState(false)
    const [displayPractice, setDisplayPractice] = useState(false)

    const hidden = () => {
        setDisplaySignIn(false)
        setDisplaySignUp(false)
        setDisplayNote(false)
        setDisplayAllNote(false)
        setDisplayListEpisode(false)
        setDisplay(false)
        setDisplayDetailBroadCast(false)
        setDisplayChangePassword(false)
        setDisplayListGate(false)
        setDisplayPractice(false)
    }

    const data = {
        displaySignIn,
        displaySignUp,
        displayNote,
        displayListEpisode,
        displayAllNote,
        display,
        displayDetailBroadCast,
        displayChangePassword,
        displayListGate,
        displayPractice
    }

    const handler = {
        setDisplaySignIn,
        setDisplaySignUp,
        setDisplayNote,
        setDisplayListEpisode,
        setDisplayAllNote,
        setDisplay,
        setDisplayDetailBroadCast,
        setDisplayChangePassword,
        setDisplayListGate,
        setDisplayPractice
    }

    return (
        <menuContext.Provider value={{ menuData: data, menuHandler: handler }}>
            {children}
            {display && (
                <Pressable onPress={() => hidden()} style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, backgroundColor: '#00000053', zIndex: 1 }} />
            )}
            <MenuArea />
            <SignInForm />
            <SignUpForm />
            <FormNote />
            <ListEpisode />
            <FormAllNote />
            <FormDetailBroadCast />
            <FormChangePassword />
            <FormListGate />
            <FormPractice />
        </menuContext.Provider>
    )
}

export default MenuProvider