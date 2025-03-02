/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, Image, Text, TouchableOpacity, View} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {useRecoilState, useRecoilValue} from 'recoil';
import LinearGradient from 'react-native-linear-gradient';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/FontAwesome';
import {selectedWalletAtom, walletsAtom} from '../../atoms/wallets';
import Button from '../../components/Button';
import {parseKaiBalance} from '../../utils/number';
import {copyToClipboard, truncate} from '../../utils/string';
import {styles} from './style';
import {
  getSelectedWallet,
  getWallets,
  saveSelectedWallet,
  saveWallets,
} from '../../utils/local';
import {useNavigation} from '@react-navigation/native';
import {tokenInfoAtom} from '../../atoms/token';
import {languageAtom} from '../../atoms/language';
import {getLanguageString} from '../../utils/lang';
import AlertModal from '../../components/AlertModal';
import IconButton from '../../components/IconButton';
import NewTxModal from '../common/NewTxModal';
import numeral from 'numeral';
import {weiToKAI} from '../../services/transaction/amount';

const {width: viewportWidth} = Dimensions.get('window');

const CardSliderSection = ({
  importWallet,
  showQRModal,
}: {
  importWallet: () => void;
  showQRModal: () => void;
}) => {
  const navigation = useNavigation();
  const [showNewTxModal, setShowNewTxModal] = useState(false);
  const carouselRef = useRef<Carousel<Wallet>>(null);
  const [wallets, setWallets] = useRecoilState(walletsAtom);
  const [tokenInfo] = useRecoilState(tokenInfoAtom);
  const [selectedWallet, setSelectedWallet] = useRecoilState(
    selectedWalletAtom,
  );
  const [removeIndex, setRemoveIndex] = useState(-1);
  const language = useRecoilValue(languageAtom);

  function send() {
    setShowNewTxModal(true);
  }

  function showCredential() {
    navigation.navigate('Setting', {
      screen: 'MnemonicPhraseSetting',
      initial: false,
      params: {
        from: 'Home',
      },
    });
  }
  const renderWalletItem = ({item: wallet}: any) => {
    return (
      <View style={styles.kaiCardContainer}>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          colors={['#623555', '#e62c2c']}
          style={styles.kaiCard}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{paddingRight: 8, flex: 10}}>
              <Text style={styles.kaiCardText}>
                {getLanguageString(language, 'ADDRESS')}:
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.kaiCardText}>
                  {truncate(
                    wallet.address,
                    viewportWidth >= 432 ? 14 : 8,
                    viewportWidth >= 432 ? 14 : 10,
                  )}
                </Text>
                <IconButton
                  color={'#FFFFFF'}
                  name="copy"
                  size={16}
                  onPress={() => copyToClipboard(wallet.address)}
                />
              </View>
            </View>
            <Menu>
              <MenuTrigger
                customStyles={{
                  triggerOuterWrapper: {
                    width: 27,
                    height: 27,
                    alignItems: 'flex-end',
                  },
                  TriggerTouchableComponent: TouchableOpacity,
                  triggerWrapper: {
                    width: 27,
                    height: 27,
                    alignItems: 'flex-end',
                  },
                }}>
                <Icon name="cog" color="#FFFFFF" size={27} />
              </MenuTrigger>
              <MenuOptions
                customStyles={{
                  optionWrapper: {
                    padding: 12,
                  },
                }}>
                <MenuOption onSelect={showCredential}>
                  <Text>{getLanguageString(language, 'SHOW_SECRET_TEXT')}</Text>
                </MenuOption>
                <MenuOption onSelect={() => setRemoveIndex(selectedWallet)}>
                  <Text>{getLanguageString(language, 'REMOVE_WALLET')}</Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>
          <View>
            <Text style={{fontSize: 30, color: 'white'}}>
              $
              {numeral(
                tokenInfo.price *
                  (Number(weiToKAI(wallet.balance)) + wallet.staked),
              ).format('0,0.00a')}
            </Text>
            <Image
              style={styles.cardLogo}
              source={require('../../assets/kar1.png')}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={[styles.kaiCardText, styles.kaiCardBalanceText]}>
              {getLanguageString(language, 'BALANCE')}:{' '}
              {parseKaiBalance(wallet.balance)} KAI
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={[styles.kaiCardText, styles.kaiCardBalanceText]}>
              {getLanguageString(language, 'STAKED_AMOUNT')}:{' '}
              {numeral(wallet.staked).format('0,0.00a')} KAI
            </Text>
          </View>
        </LinearGradient>
      </View>
    );
  };

  useEffect(() => {
    saveSelectedWallet(selectedWallet);
    if (carouselRef.current) {
      if (removeIndex >= 0) {
        carouselRef.current.triggerRenderingHack();
        setRemoveIndex(-1);
      } else if (carouselRef.current.currentIndex !== selectedWallet) {
        // react-native-snap-carousel issue. TODO: wait for issue resolved and update
        setTimeout(() => {
          if (carouselRef.current) {
            carouselRef.current.snapToItem(selectedWallet);
          }
        }, 300);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWallet]);

  const removeWallet = async () => {
    // setShouldFetchBalance(false);
    const localWallets = await getWallets();
    const localSelectedWallet = await getSelectedWallet();
    const newWallets: Wallet[] = JSON.parse(JSON.stringify(localWallets));
    newWallets.splice(removeIndex, 1);
    await saveWallets(newWallets);
    setWallets(newWallets);
    if (newWallets.length === 0) {
      await saveSelectedWallet(0);
      setSelectedWallet(0);
    } else if (localSelectedWallet > newWallets.length - 1) {
      await saveSelectedWallet(newWallets.length - 1);
      setSelectedWallet(newWallets.length - 1);
    } else {
      await saveSelectedWallet(selectedWallet);
      setRemoveIndex(-1);
    }
    // RNRestart.Restart();
  };

  return (
    <View style={styles.kaiCardSlider}>
      <NewTxModal
        visible={showNewTxModal}
        onClose={() => setShowNewTxModal(false)}
      />
      <Carousel
        ref={carouselRef}
        data={wallets}
        enableSnap={true}
        renderItem={renderWalletItem}
        sliderWidth={viewportWidth}
        itemWidth={viewportWidth}
        onSnapToItem={setSelectedWallet}
      />
      <Pagination
        dotsLength={wallets.length}
        activeDotIndex={selectedWallet}
        containerStyle={{
          paddingVertical: 0,
          height: 20,
          justifyContent: 'center',
        }}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 8,
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />

      <View style={styles.buttonGroupContainer}>
        <Button
          title={getLanguageString(language, 'SEND')}
          type="outline"
          onPress={send}
          iconName="paper-plane"
          size="small"
          textStyle={{color: '#FFFFFF'}}
          style={{marginRight: 5}}
        />

        <Button
          onPress={showQRModal}
          title={getLanguageString(language, 'RECEIVE')}
          size="small"
          type="outline"
          iconName="download"
          style={{marginLeft: 5, marginRight: 5}}
          textStyle={{color: '#FFFFFF'}}
        />

        <Button
          title={getLanguageString(language, 'IMPORT')}
          onPress={importWallet}
          type="outline"
          iconName="plus"
          size="small"
          style={{marginLeft: 5}}
          textStyle={{color: '#FFFFFF'}}
        />
      </View>
      <AlertModal
        visible={removeIndex >= 0}
        type="confirm"
        iconSize={90}
        onClose={() => setRemoveIndex(-1)}
        cancelText={getLanguageString(language, 'GO_BACK')}
        okText={getLanguageString(language, 'CONFIRM')}
        onOK={removeWallet}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 22,
            fontWeight: 'bold',
            marginBottom: 20,
          }}>
          {getLanguageString(language, 'ARE_YOU_SURE')}
        </Text>
        <Text style={{fontStyle: 'italic', textAlign: 'center'}}>
          {getLanguageString(language, 'RESTART_APP_DESCRIPTION')}
        </Text>
      </AlertModal>
    </View>
  );
};

export default CardSliderSection;
