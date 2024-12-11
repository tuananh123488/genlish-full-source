'use client'
import AllNote from "@/components/forms/AllNote";
import Note from "@/components/forms/Note";
import ThemAi from "@/components/forms/ThemAi";
import ThemKhoaHoc from "@/components/forms/ThemKhoaHoc";
import Notification from "@/components/notification";
import Wrapper from "@/components/wrapper";
import { api, TypeHTTP } from "@/utils/api";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";
export const formContext = createContext()

const FormProvider = ({ children }) => {

    const wrapperRef = useRef();
    const [visibleNote, setVisibleNote] = useState(false)
    const [visibleAllNote, setVisibleAllNote] = useState(false)
    const [visibleThemKhoaHoc, setVisibleThemKhoaHoc] = useState(false)
    const [visibleThemAi, setVisibleThemAi] = useState(false)

    const showWrapper = () => {
        wrapperRef.current.style.display = "block";
        document.querySelector("body").style.overflow =
            "hidden";
        setTimeout(() => {
            wrapperRef.current.style.opacity = 1;
        }, 100);
    };

    const hiddenWrapper = () => {
        wrapperRef.current.style.opacity = 0;
        document.querySelector("body").style.overflow = "auto";
        setTimeout(() => {
            wrapperRef.current.style.display = "none";
        }, 500);
    };

    const showNote = () => {
        setVisibleNote(true)
        showWrapper()
    }

    const hiddenNote = () => {
        setVisibleNote(false)
        hiddenWrapper()
    }

    const showAllNote = () => {
        setVisibleAllNote(true)
        showWrapper()
    }

    const hiddenAllNote = () => {
        setVisibleAllNote(false)
        hiddenWrapper()
    }

    const showThemKhoaHoc = () => {
        setVisibleThemKhoaHoc(true)
        showWrapper()
    }

    const hiddenThemKhoaHoc = () => {
        setVisibleThemKhoaHoc(false)
        hiddenWrapper()
    }
    const showThemAi = () => {
        setVisibleThemAi(true)
        showWrapper()
    }

    const hiddenThemAi = () => {
        setVisibleThemAi(false)
        hiddenWrapper()
    }

    const hidden = () => {
        hiddenWrapper();
        hiddenNote()
        hiddenAllNote()
        hiddenThemKhoaHoc()
        hiddenThemAi()
    };

    const data = {

    }

    const handler = {
        showNote,
        hiddenNote,
        showAllNote,
        hiddenAllNote,
        showThemKhoaHoc,
        showThemAi
    }

    return (
        <formContext.Provider value={{ formData: data, formHandler: handler }}>
            {children}
            <Wrapper wrapperRef={wrapperRef} onClick={hidden} />
            <Note visible={visibleNote} hidden={hiddenNote} />
            <AllNote visible={visibleAllNote} hidden={hiddenAllNote} />
            <ThemKhoaHoc visible={visibleThemKhoaHoc} hidden={hiddenThemKhoaHoc} />
            <ThemAi visible={visibleThemAi} hidden={hiddenThemAi} />
        </formContext.Provider >
    )
}

export default FormProvider
