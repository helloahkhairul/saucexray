import { StyleSheet, Text } from 'react-native';

import { colors } from '@/constants/colors';
import { type } from '@/constants/theme';

export function Footer({ style }: { style?: object }) {
  return (
    <Text style={[styles.text, style]}>
      Built by AH Khairul · Made for <Text style={styles.brand}>AppSauce.</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    ...type.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
  brand: {
    color: colors.coral,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
});
