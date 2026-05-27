import { Pressable, Text, View } from 'react-native';

import { RootScreens, type RootStackScreenProps } from '../../navigation';

import { styles } from './styles';

const Home = ({ navigation }: RootStackScreenProps<RootScreens.HOME>) => (
  <View>
    {Object.values(RootScreens)
      .filter((screen) => screen !== RootScreens.HOME)
      .map((screen) => (
        <Pressable key={screen} onPress={() => navigation.navigate(screen)}>
          <Text style={styles.item}>{screen}</Text>
        </Pressable>
      ))}
  </View>
);

export default Home;
