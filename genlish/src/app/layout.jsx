import { Inter } from "next/font/google";
import "./globals.css";
import GlobalProvider from "@/context/GlobalContext";
import AuthProvider from "@/context/AuthContext";
import NotifyProvider from "@/context/NotifyContext";
import PracticeProvider from "@/context/PracticeContext";
import StudyProvider from "@/context/StudyContext";
import FormProvider from "@/context/FormContext";
import PayloadProvider from "@/context/PayloadContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GenLish",
  description: "Learn by GenLish",
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
        />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          rel="stylesheet"
        />
        <meta name="google-site-verification" content="qPr_3m_jtgVoFmOL2IRmvbU2OdtNkvMzWNbAkpMcueU" />
      </head>
      <body className='font-nunitosans'>
        <PayloadProvider>
          <PracticeProvider>
            <NotifyProvider>
              <AuthProvider>
                <StudyProvider>
                  <GlobalProvider>
                    <FormProvider>
                      {children}
                    </FormProvider>
                  </GlobalProvider>
                </StudyProvider>
              </AuthProvider>
            </NotifyProvider>
          </PracticeProvider>
        </PayloadProvider>
      </body>
    </html>
  );
}
