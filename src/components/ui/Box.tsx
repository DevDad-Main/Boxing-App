/**
 * Box — a flexible View wrapper that accepts style props.
 * The foundation of layout in the design system.
 */
import { View, ViewProps, StyleProp, ViewStyle } from 'react-native';
import { colors } from '@/lib/theme';

export interface BoxProps extends ViewProps {
  bg?: keyof typeof colors | string;
  flex?: number;
  p?: number;
  px?: number;
  py?: number;
  m?: number;
  mx?: number;
  my?: number;
  style?: StyleProp<ViewStyle>;
}

export function Box({ children, bg, flex, p, px, py, m, mx, my, style, ...rest }: BoxProps) {
  const rawStyles: Record<string, unknown> = {};

  if (flex !== undefined) {
    rawStyles.flex = flex;
  }

  if (bg !== undefined) {
    rawStyles.backgroundColor = typeof bg === 'string' ? bg : colors[bg];
  }

  if (p !== undefined) {
    rawStyles.padding = p;
  }
  if (px !== undefined) {
    rawStyles.paddingHorizontal = px;
  }
  if (py !== undefined) {
    rawStyles.paddingVertical = py;
  }

  if (m !== undefined) {
    rawStyles.margin = m;
  }
  if (mx !== undefined) {
    rawStyles.marginHorizontal = mx;
  }
  if (my !== undefined) {
    rawStyles.marginVertical = my;
  }

  return <View {...rest} style={[rawStyles as StyleProp<ViewStyle>, style]} />;
}
