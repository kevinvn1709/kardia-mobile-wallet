import {StyleSheet} from 'react-native';
import {HEADER_HEIGHT} from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headline: {
    fontSize: 25,
    fontWeight: 'bold',
    paddingHorizontal: 15,
  },
  settingItemContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 15,
    alignItems: 'center',
  },
  settingTitle: {
    marginLeft: 15,
    fontSize: 18,
  },
});
