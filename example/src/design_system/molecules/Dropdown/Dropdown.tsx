import { useState } from 'react';
import {
  color,
  createRestyleComponent,
  spacing,
  type ColorProps,
} from '@shopify/restyle';
import { TouchableOpacity, type ViewStyle } from 'react-native';

import { palette, type Theme } from '../../style';
import { Text } from '../../atoms/Text';
import { View, type ViewProps } from '../../atoms/View';
import { resolveStyles } from '../../../utils/resolveStyles';

export type DropdownOption = {
  label: string;
  value: string;
};

type SingleSelectProps = {
  variant: 'single';
  value: string | null;
  onValueChange: (value: string) => void;
};

type MultipleSelectProps = {
  variant: 'multiple';
  value: string[];
  onValueChange: (values: string[]) => void;
  maintainSelectionOrder?: boolean;
};

type DropdownOwnProps = (SingleSelectProps | MultipleSelectProps) & {
  options: DropdownOption[];
  placeholder?: string;
  isDisabled?: boolean;
  label?: string;
};

type DropdownComponentProps = Omit<ViewProps, 'style'> &
  DropdownOwnProps & { style?: (ViewStyle & { color?: string })[] };

const DropdownComponent = ({
  options,
  placeholder = 'Select...',
  isDisabled = false,
  style,
  label,
  ...variantProps
}: DropdownComponentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerStyle = resolveStyles(style);

  const handleSelect = (optionValue: string) => {
    if (variantProps.variant === 'single') {
      variantProps.onValueChange(optionValue);
      setIsOpen(false);
    } else {
      const current = variantProps.value;
      const exists = current.includes(optionValue);
      let next: string[];
      if (exists) {
        next = current.filter((v) => v !== optionValue);
      } else if (variantProps.maintainSelectionOrder) {
        next = [...current, optionValue];
      } else {
        const merged = [...current, optionValue];
        next = options
          .filter((o) => merged.includes(o.value))
          .map((o) => o.value);
      }
      variantProps.onValueChange(next);
    }
  };

  const isSelected = (optionValue: string): boolean => {
    if (variantProps.variant === 'single') {
      return variantProps.value === optionValue;
    }
    return variantProps.value.includes(optionValue);
  };

  const displayLabel = (): string => {
    if (variantProps.variant === 'single') {
      if (!variantProps.value) return placeholder;
      return (
        options.find((o) => o.value === variantProps.value)?.label ??
        placeholder
      );
    }
    if (variantProps.value.length === 0) return placeholder;
    return variantProps.value
      .map((v) => options.find((o) => o.value === v)?.label ?? v)
      .join(', ');
  };

  return (
    <View style={containerStyle} width="100%">
      <TouchableOpacity
        onPress={() => !isDisabled && setIsOpen((prev) => !prev)}
        activeOpacity={isDisabled ? 1 : 0.7}
        style={{ flexDirection: 'row', width: '100%', gap: 8 }}
      >
        <View
          flex={1}
          flexGrow={1}
          flexDirection="row"
          justifyContent="flex-end"
        >
          <Text flexWrap={1} textAlign="right">
            {label}
          </Text>
        </View>
        <View
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          padding="m"
          backgroundColor={isDisabled ? 'disabled' : 'white'}
          flex={2}
          style={{ borderWidth: 1, borderColor: palette.grey, borderRadius: 8 }}
        >
          <Text
            color={isDisabled ? 'grey' : 'black'}
            style={{ flex: 1 }}
            numberOfLines={1}
          >
            {displayLabel()}
          </Text>
          <Text color="grey">{isOpen ? '▲' : '▼'}</Text>
        </View>
      </TouchableOpacity>

      {isOpen && (
        <View
          backgroundColor="white"
          style={{
            borderWidth: 1,
            borderColor: palette.grey,
            borderRadius: 8,
            marginTop: 4,
          }}
        >
          {options.map((option) => {
            const selected = isSelected(option.value);
            const showOrder =
              variantProps.variant === 'multiple' &&
              variantProps.maintainSelectionOrder &&
              selected;
            const selectionIndex = showOrder
              ? variantProps.value.indexOf(option.value) + 1
              : null;
            return (
              <TouchableOpacity
                key={option.value}
                onPress={() => handleSelect(option.value)}
              >
                <View
                  padding="m"
                  backgroundColor={selected ? 'purpleDark' : 'white'}
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Text color={selected ? 'white' : 'black'}>
                    {option.label}
                  </Text>
                  {selectionIndex !== null && (
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        backgroundColor: palette.purpleLight,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text color="white" style={{ fontSize: 11 }}>
                        {String(selectionIndex)}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};

export type DropdownProps = ViewProps & ColorProps<Theme> & DropdownOwnProps;

const Dropdown = createRestyleComponent<DropdownProps, Theme>(
  [spacing, color],
  DropdownComponent
);

export default Dropdown;
