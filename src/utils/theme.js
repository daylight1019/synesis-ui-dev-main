import { createMuiTheme, responsiveFontSizes } from "@material-ui/core";
import * as locale from '@material-ui/core/locale';



// colors
const primary = "#6E56F8";
const secondary = "#11243E";
const black = "#303030";
const darkBlack = "#0c1319";
const background = "#fff";
const warningLight = "rgba(255, 246, 32, .3)";
const warningMain = "rgba(255, 246, 32, .5)";
const warningDark = "rgba(255, 246, 32, .7)";

// border
const borderWidth = 1;
const borderColor = "#2e6da4";

// breakpoints
const xl = 1920;
const lg = 1280;
const md = 960;
const sm = 600;
const xs = 0;

// spacing
const spacing = 8;

const theme = createMuiTheme({
    layout: {
        contentWidth: 1140,
        footerWidth: 1400
    },
    palette: {
        primary: { main: primary, footer: '#055da6' },
        secondary: { main: secondary },
        common: {
            black,
            darkBlack
        },
        warning: {
            light: warningLight,
            main: warningMain,
            dark: warningDark
        },
        tonalOffset: 0.2,
        background: {
            default: background,
            gray: '#f1f1f170'
        },
        spacing
    },
    breakpoints: {
        values: {
            xl,
            lg,
            md,
            sm,
            xs
        }
    },
    border: {
        borderColor: borderColor,
        borderWidth: borderWidth
    },
    overrides: {

    },
    typography: {
        useNextVariants: true,
        allVariants: {
            color: 'white'
        }
    }
}, locale['EN']);

export default responsiveFontSizes(theme);
