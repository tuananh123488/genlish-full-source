
import { useFonts } from "expo-font";

import MenuProvider from "./src/contexts/MenuContext";
import UtilsProvider from "./src/contexts/UtilsContext";
import UserProvider from "./src/contexts/UserContext";
import AuthProvider from "./src/contexts/AuthContext";
import ScreenProvider from "./src/contexts/ScreenContext";
import { useEffect, useRef, useState } from "react";
import Index from "./src/screens";
import PayLoadProvider from "./src/contexts/PayloadContext";
import Navbar from "./src/components/Navbar";
import LearnProvider from "./src/contexts/LearnContext";
import PracticeProvider from "./src/contexts/PracticeContext";

export default function App() {
  const [reload, setReload] = useState(false)
  let [fontsLoaded] = useFonts({
    'Nunito-R': require('./assets/fonts/Nunito-Regular.ttf'),
    'Nunito-B': require('./assets/fonts/Nunito-Bold.ttf'),
    'Nunito-S': require('./assets/fonts/Nunito-SemiBold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      setReload(!reload)
    }
  }, [fontsLoaded])

  // icons
  //https://oblador.github.io/react-native-vector-icons

  return (
    <UserProvider>
      <LearnProvider>
        <PracticeProvider>
          <UtilsProvider>
            <PayLoadProvider>
              <ScreenProvider>
                <MenuProvider>
                  <AuthProvider>
                    <Navbar />
                    <Index />
                  </AuthProvider>
                </MenuProvider>
              </ScreenProvider>
            </PayLoadProvider>
          </UtilsProvider>
        </PracticeProvider>
      </LearnProvider>
    </UserProvider>
  );
}
