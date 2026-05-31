import { TouchableOpacity } from 'react-native';
import { Text, View } from '../../design_system/atoms';

import { RootScreens, type RootStackScreenProps } from '../../navigation';

const Home = ({ navigation }: RootStackScreenProps<RootScreens.HOME>) => (
  <View px="s" py="m" gap="s">
    {Object.values(RootScreens)
      .filter((screen) => screen !== RootScreens.HOME)
      .map((screen) => (
        <TouchableOpacity
          key={screen}
          onPress={() => navigation.navigate(screen)}
          style={{ backgroundColor: 'lightgray', borderRadius: 4 }}
        >
          <Text p="m">{screen}</Text>
        </TouchableOpacity>
      ))}
  </View>
);

export default Home;
