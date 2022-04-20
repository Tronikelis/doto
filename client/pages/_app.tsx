import Progress from "@badrap/bar-of-progress";
import createCache from "@emotion/cache";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { dequal } from "dequal";
import { NextSeo } from "next-seo";
import { AppProps } from "next/app";
import Head from "next/head";
import Router from "next/router";
import { SnackbarProvider } from "notistack";
import { SWRConfig } from "swr";

import Footer from "@components/Footer";
import NavBar from "@components/NavBar";

import snack, { SnackbarUtilsConfigurator } from "@hooks/useSnack";

import parseError from "@utils/parseError";

import "../styles.css";

axios.defaults.baseURL = "/api/v1";

axios.interceptors.response.use(
    x => x,
    error => {
        // don't show auth notifications
        if (error.response.status === 401) return Promise.reject();
        // only snack on 400 and >= 500
        if (error.response.status === 400 || error.response.status >= 500) {
            snack.error(parseError(error));
        }

        return Promise.reject(error);
    }
);

const fetcher = (url: string) => axios.get(url).then(x => x.data);

const theme = createTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1800,
        },
    },
    palette: {
        mode: "dark",
        primary: {
            main: "#88c0d0",
        },
        secondary: {
            main: "#5e81ac",
        },
        background: {
            default: "#242933",
            paper: "#2e3440",
        },
        warning: {
            main: "#d08770",
        },
        success: {
            main: "#a3be8c",
        },
        error: {
            main: "#bf616a",
        },
        divider: "#4c566a",
        text: {
            primary: "#eceff4",
            secondary: "#d8dee9",
        },
    },
    shape: {
        borderRadius: 10,
    },
    typography: {
        fontFamily: [
            "Inter",
            "Roboto",
            "-apple-system",
            "system-ui",
            "BlinkMacSystemFont",
            "Segoe UI",
            "Helvetica Neue",
            "Arial",
            "sans-serif",
        ].join(","),
    },
});

const clientSideEmotionCache = createCache({ key: "css", prepend: true });

const progress = new Progress({
    size: 3,
    color: "#81a1c1",
    delay: 40,
});

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);

interface MyAppProps extends AppProps {
    emotionCache?: EmotionCache;
}

const App = (props: MyAppProps) => {
    const { Component, pageProps } = props;

    return (
        <SWRConfig
            value={{
                fetcher,
                compare: dequal,
                shouldRetryOnError: false,
            }}
        >
            <CssBaseline />
            <NavBar />
            <Component {...pageProps} />
            <Footer />

            <SnackbarUtilsConfigurator />
        </SWRConfig>
    );
};

export default function MyApp(props: MyAppProps) {
    const { emotionCache = clientSideEmotionCache } = props;

    return (
        <CacheProvider value={emotionCache}>
            <Head>
                <meta name="viewport" content="initial-scale=1, width=device-width" />
            </Head>

            <NextSeo titleTemplate="%s | Sokutei" defaultTitle="Sokutei" />

            <ThemeProvider theme={theme}>
                <SnackbarProvider
                    maxSnack={2}
                    preventDuplicate
                    classes={{
                        variantWarning: "snack-warning",
                        variantError: "snack-error",
                        variantInfo: "snack-info",
                        variantSuccess: "snack-success",
                    }}
                >
                    <App {...props} />
                </SnackbarProvider>
            </ThemeProvider>
        </CacheProvider>
    );
}
