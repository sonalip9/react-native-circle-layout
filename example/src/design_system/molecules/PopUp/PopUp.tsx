import * as React from 'react';
import { Text, View, type StyleProp, type TextStyle } from 'react-native';

import { AppContext } from '../../../AppContext';

import { styles } from './styles';

export type PopUpProps = {
  message: string;
  textStyle?: StyleProp<TextStyle>;
};

const PopUp = ({ message, textStyle }: PopUpProps) => {
  const { closePopUp } = React.use(AppContext);

  React.useEffect(() => {
    const id = setTimeout(() => {
      closePopUp();
    }, 1000 * 5);

    return () => {
      clearTimeout(id);
    };
  }, [closePopUp]);

  return (
    <View style={styles.container}>
      <Text style={[styles.message, textStyle]}>{message}</Text>
    </View>
  );
};

export default PopUp;
