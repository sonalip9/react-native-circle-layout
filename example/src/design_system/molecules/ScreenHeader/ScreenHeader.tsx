import { Text } from '../../atoms/Text';
import { View } from '../../atoms/View';

export type ScreenHeaderProps = {
  title: string;
  subtitle: string;
  isDarkMode?: boolean;
};

const ScreenHeader = ({ title, subtitle, isDarkMode }: ScreenHeaderProps) => (
  <View padding="m">
    <Text variant="screenTitle" color={isDarkMode ? 'white' : 'black'}>
      {title}
    </Text>
    <Text variant="screenSubtitle" color={isDarkMode ? 'white' : 'black'}>
      {subtitle}
    </Text>
  </View>
);

export default ScreenHeader;
