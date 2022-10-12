import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  alignCenter: { alignItems: 'center' },
  centerComponent: {
    backgroundColor: 'pink',
    borderRadius: 20,
    height: 25,
    width: 25,
  },
  circleLayoutComponent: {
    backgroundColor: 'black',
    borderRadius: 10,
    height: 10,
    width: 10,
  },
  circleLayoutContainer: { flex: 1, width: '100%' },
  container: {
    alignItems: 'center',
    flex: 1,
    minHeight: '100%',
    padding: 24,
  },
  flex: { flex: 1 },
  footer: { marginBottom: 24 },
  slider: {
    height: 40,
    width: '50%',
  },
  sliderContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 8,
    width: '100%',
  },
  sliderLabel: { flex: 1, textAlign: 'right' },
  sliderValue: { flex: 1 },
});
