import { use, useEffect } from 'react';

import { AppContext } from '../../../AppContext';
import { Text } from '../../atoms/Text';
import { View } from '../../atoms/View';

export type PopUpProps = {
  message: string;
};

const PopUp = ({ message }: PopUpProps) => {
  const { closePopUp } = use(AppContext);

  useEffect(() => {
    const id = setTimeout(() => {
      closePopUp();
    }, 1000 * 5);

    return () => {
      clearTimeout(id);
    };
  }, [closePopUp, message]);

  return (
    <View
      backgroundColor="grey"
      bottom={0}
      justifyContent="center"
      left={0}
      margin="l"
      minHeight={48}
      paddingStart="m"
      position="absolute"
      right={0}
      style={{ borderRadius: 5, elevation: 3, paddingVertical: 12 }}
    >
      <Text color="white">{message}</Text>
    </View>
  );
};

export default PopUp;
