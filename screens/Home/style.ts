import {StyleSheet} from 'react-native';
import {HEADER_HEIGHT} from '../../theme';

export const styles = StyleSheet.create({
  logo: {
    width: 26,
    height: 26,
    marginRight: 15,
  },
  headerContainer: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bodyContainer: {
    flex: 1,
  },
  kaiCardSlider: {
    // backgroundColor: '#2A343D',
    paddingBottom: 10,
  },
  kaiCardContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    height: 240,
  },
  kaiCard: {
    borderRadius: 8,
    backgroundColor: '#AD182A',
    padding: 25,
    flex: 1,
    justifyContent: 'space-between',
  },
  kaiCardText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  kaiCardBalanceText: {
    fontSize: 18,
  },
  buttonGroupContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  transactionContainer: {
    // height: 445,
    flex: 1,
    // backgroundColor: '#FFFFFF',
    // backgroundColor: '#171E28',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  kaiAmount: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'right',
  },
  dateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    color: '#b0acac',
    fontSize: 11,
    fontWeight: 'bold',
  },

  cardLogo: {
    width: 220,
    height: 40,
    opacity: 0.25,
    position: 'absolute',
    right: 2,
    bottom: -40,
    resizeMode: 'contain',
  },

  kaiLogo: {
    width: 30,
    height: 30,
  },
  tokenLogo: {
    width: 40,
    height: 40,
    borderRadius: 25,
  },
  noTXText: {
    padding: 15,
    fontSize: 16,
    fontStyle: 'italic',
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    textAlign: 'center',
    paddingVertical: 30,
    color: '#000000',
    fontWeight: 'bold',
  },
  qrScannerContainer: {
    flex: 1,
    position: 'absolute',
  },
  qrScannerHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#fff',
  },
  qrScannerFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    minWidth: '100%',
    borderRadius: 8,
    padding: 10,
  },
  scanContainer: {
    zIndex: 9999,
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  selectWalletContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  tokenListContainer: {
    flex: 1,
  },
});
