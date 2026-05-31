import { createTheme } from '@shopify/restyle';

export const palette = {
  alert: '#FF0058',
  black: '#0B0B0B',
  disabled: '#E5E5E5',
  grey: '#9E9E9E',
  greenDark: '#0A906E',
  greenLight: '#56DCBA',
  greenPrimary: '#0ECD9D',
  purpleDark: '#3F22AB',
  purpleLight: '#8C6FF7',
  purplePrimary: '#5A31F4',
  white: '#F0F2F3',
  transparent: 'transparent',
};

const buttonVariants = {
  defaults: {
    backgroundColor: 'purpleDark',
    padding: 'm',
    borderRadius: 'm',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  },
  text: {
    backgroundColor: 'transparent',
    color: 'purpleDark',
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'purpleDark',
    color: 'purpleDark',
  },
  contained: {},
};

const theme = createTheme({
  breakpoints: {},
  colors: palette,
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  borderRadii: {
    s: 4,
    m: 8,
    l: 16,
    xl: 24,
  },
  textVariants: {
    defaults: {
      color: 'black',
      fontSize: 16,
    },
  },
  buttonVariants,
});

export type Theme = typeof theme;
export default theme;
