interface CustomTextInputProps {
  onChangeText?: (newText: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  value?: string;
  iconName?: string;
  onIconPress?: () => void;
  headline?: string;
  style?: Record<string, any>;
  numberOfLines?: number;
  multiline?: boolean;
  editable?: boolean;
  placeholder?: string;
  block?: boolean;
  icons?: () => any;
  keyboardType?: string;
  message?: string | (() => any);
  autoCapitalize?: 'characters' | 'words' | 'sentences' | 'none';
}
