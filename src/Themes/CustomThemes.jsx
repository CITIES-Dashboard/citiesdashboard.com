/* eslint-disable max-len */
import { colors } from '@mui/material';

const darkShade = 400;
const lightShade = 600;
const darkShadeColorAxis = 300;

const CustomThemes = {
  dark: {
    palette: {
      mode: 'dark',
      primary: {
        main: '#a947eb'
      },
      background: {
        paper: '#202020',
        default: '#303030',
        NYUpurpleLight: 'rgba(169, 71, 235, 0.3)'
      },
      customBackground: '#202020',
      customAlternateBackground: '#303030',
      text: {
        secondaryRGB: '#c1c1c1'
      },
      chart: {
        optionsColors: {
          monochromatic2Colors: [colors.purple[darkShade - 100], colors.purple[darkShade + 200]],
          monochromatic3Colors: [colors.purple[darkShade + 200], colors.purple[darkShade - 100], colors.grey[darkShade + 100]],
          multiColor: [colors.blue[darkShade], colors.pink[darkShade], colors.amber[darkShade], colors.teal[darkShade], colors.grey[darkShade], "#a947eb"],
          grayscale: [colors.grey[darkShade + 100], colors.grey[darkShade + 300]],
          rainbow: [colors.red[darkShade], colors.orange[darkShade], colors.amber[darkShade], colors.green[darkShade], colors.blue[darkShade], colors.indigo[darkShade], colors.blue[darkShade]],
        },
        colorAxisFirstColor: colors.grey[darkShadeColorAxis],
        axisTitle: colors.grey[darkShade - 100],
        axisText: colors.grey[darkShade],
        gridlines: colors.grey[darkShade + 200],
        annotationBoxFill: colors.blueGrey[600],
        tooltip: {
          background: colors.grey[darkShade - 200],
          text: colors.grey[darkShade + 300]
        }
      }
    }
  },
  light: {
    palette: {
      mode: 'light',
      primary: {
        main: '#57068c'
      },
      background: {
        NYUpurpleLight: 'rgba(87, 6, 140, 0.1)'
      },
      customBackground: '#f6f6f6',
      customAlternateBackground: '#ffffff',
      text: {
        secondaryRGB: '#666666'
      },
      chart: {
        optionsColors: {
          monochromatic2Colors: [colors.purple[lightShade], colors.purple[lightShade - 300]],
          monochromatic3Colors: [colors.purple[darkShade + 200], colors.purple[darkShade - 100], colors.grey[lightShade - 100]],
          multiColor: [colors.blue[lightShade], colors.pink[lightShade], colors.amber[lightShade], colors.teal[lightShade], colors.grey[lightShade], "#57068c"],
          grayscale: [colors.grey[lightShade - 100], colors.grey[lightShade + 200]],
          rainbow: [colors.red[lightShade], colors.orange[lightShade], colors.amber[lightShade], colors.green[lightShade], colors.blue[lightShade], colors.indigo[lightShade], colors.deepPurple[lightShade]],
        },
        colorAxisFirstColor: colors.common.white,
        axisTitle: colors.grey[lightShade + 100],
        axisText: colors.grey[lightShade],
        gridlines: colors.grey[lightShade - 200],
        annotationBoxFill: colors.blueGrey[800],
        tooltip: {
          background: colors.common.white,
          text: colors.grey[lightShade]
        }
      }
    }
  },
  universal: {
    palette: {
      NYUpurple: '#57068c',
      backgroundColorForNavLink: 'rgba(0, 0, 0, 0.2)',
      inactiveSensor: '#bbbbbb'
    },
    typography: {
      fontFamily: "'IBM Plex Sans', sans-serif !important"
    }
  }
};

export default CustomThemes;
