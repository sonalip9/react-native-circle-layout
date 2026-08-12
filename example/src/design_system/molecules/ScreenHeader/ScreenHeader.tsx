import { Text } from '../../atoms/Text';
import { View } from '../../atoms/View';

export type ScreenHeaderProps = {
  title: string;
  subtitle: string;
};

const ScreenHeader = ({ title, subtitle }: ScreenHeaderProps) => (
  <View padding="m">
    <Text variant="screenTitle">{title}</Text>
    <Text variant="screenSubtitle">{subtitle}</Text>
  </View>
);

export default ScreenHeader;
