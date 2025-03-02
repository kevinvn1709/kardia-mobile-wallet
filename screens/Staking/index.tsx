/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {languageAtom} from '../../atoms/language';
import {selectedWalletAtom, walletsAtom} from '../../atoms/wallets';
import numeral from 'numeral';
import List from '../../components/List';
import {getCurrentStaking, mapValidatorRole} from '../../services/staking';
import {ThemeContext} from '../../ThemeContext';
import {getLanguageString} from '../../utils/lang';
import {styles} from './style';
import StakingItem from './StakingItem';
import AlertModal from '../../components/AlertModal';
import {useNavigation} from '@react-navigation/native';
import {weiToKAI} from '../../services/transaction/amount';
import Button from '../../components/Button';
import {statusBarColorAtom} from '../../atoms/statusBar';
import {getSelectedWallet, getWallets} from '../../utils/local';
import UndelegateModal from './UndelegateModal';

const StakingScreen = () => {
  const theme = useContext(ThemeContext);
  const language = useRecoilValue(languageAtom);
  const selectedWallet = useRecoilValue(selectedWalletAtom);
  const wallets = useRecoilValue(walletsAtom);
  const navigation = useNavigation();

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [loading, setLoading] = useState(true);

  const [currentStaking, setCurrentStaking] = useState<Staking[]>([]);
  const [undelegatingIndex, setUndelegatingIndex] = useState(-1);
  // const [focusingItem, setFocusingItem] = useState(-1);
  const setStatusBarColor = useSetRecoilState(statusBarColorAtom);

  const getStakingData = async () => {
    const localWallets = await getWallets();
    const localSelectedWallet = await getSelectedWallet();
    if (
      !localWallets[localSelectedWallet] ||
      !localWallets[localSelectedWallet].address
    ) {
      return;
    }
    try {
      const _staking = await getCurrentStaking(
        localWallets[localSelectedWallet].address,
      );
      setCurrentStaking(_staking);
      if (loading === true) {
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      if (loading === true) {
        setLoading(false);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      getStakingData();
      setStatusBarColor(theme.primaryColor);
      return () => {
        setStatusBarColor(theme.backgroundColor);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  useEffect(() => {
    if (message !== '' || undelegatingIndex >= 0) {
      setStatusBarColor(theme.backgroundColor);
    } else {
      setStatusBarColor(theme.primaryColor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [undelegatingIndex, message]);

  useEffect(() => {
    getStakingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, selectedWallet, wallets]);

  const parseStakingItemForList = (item: Staking) => {
    return {
      label: item.validatorContractAddr,
      value: item.validatorContractAddr,
      name: item.name,
      stakedAmount: item.stakedAmount,
      claimableRewards: item.claimableRewards,
      withdrawableAmount: item.withdrawableAmount,
      unbondedAmount: item.unbondedAmount,
      role: mapValidatorRole(item.validatorRole),
    };
  };

  const getTotalSaving = () => {
    return currentStaking.reduce((total, item) => {
      return total + Number(weiToKAI(item.claimableRewards));
    }, 0);
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <View style={{flex: 1}}>
        <View
          style={{
            backgroundColor: theme.primaryColor,
            borderRadius: 8,
            padding: 12,
            paddingTop: 50,
          }}>
          <Text
            style={[
              styles.sectionTitle,
              {color: theme.textColor, textAlign: 'center'},
            ]}>
            {getLanguageString(language, 'TOTAL_EARNING')}
          </Text>
          <Text style={[styles.totalSaving, {color: theme.textColor}]}>
            {numeral(getTotalSaving()).format('0,0.00')}{' '}
            <Text style={{fontSize: 14}}>KAI</Text>
          </Text>
          <View style={styles.headerButtonGroup}>
            <Button
              title={getLanguageString(language, 'INVEST')}
              iconName="plus"
              type="outline"
              textStyle={{color: '#FFFFFF'}}
              onPress={() => navigation.navigate('ValidatorList')}
            />
          </View>
        </View>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: theme.textColor,
              paddingHorizontal: 14,
              paddingVertical: 20,
            },
          ]}>
          {getLanguageString(language, 'YOUR_INVESTMENTS')}
        </Text>
        <List
          loading={loading}
          loadingColor={theme.primaryColor}
          items={currentStaking.map(parseStakingItemForList)}
          listStyle={{paddingHorizontal: 15}}
          ListEmptyComponent={
            <Text style={[styles.noStakingText, {color: theme.textColor}]}>
              {getLanguageString(language, 'NO_STAKING_ITEM')}
            </Text>
          }
          render={(item, index) => {
            return (
              <StakingItem
                item={item}
                // onFocus={() => setFocusingItem(index)}
                // onUnfocus={() => setFocusingItem(-1)}
                showModal={(
                  _message: string,
                  _messageType: string,
                  cb: () => void,
                ) => {
                  setMessage(_message);
                  setMessageType(_messageType);
                  cb();
                }}
                triggerUndelegate={() => setUndelegatingIndex(index)}
              />
            );
          }}
          ItemSeprator={() => <View style={{height: 6}} />}
        />
      </View>
      {message !== '' && (
        <AlertModal
          type={messageType as any}
          message={message}
          onClose={() => {
            setMessage('');
            if (messageType === 'success') {
              getStakingData();
            }
          }}
          visible={true}
        />
      )}
      <UndelegateModal
        item={
          undelegatingIndex >= 0
            ? currentStaking.map(parseStakingItemForList)[undelegatingIndex]
            : {}
        }
        showModal={(_message: string, _messageType: string) => {
          setUndelegatingIndex(-1);
          setMessage(_message);
          setMessageType(_messageType);
        }}
        visible={undelegatingIndex >= 0}
        onClose={() => setUndelegatingIndex(-1)}
      />
    </View>
  );
};

export default StakingScreen;
