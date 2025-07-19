import React, { ReactNode, useEffect, useState, useRef, useCallback } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  KeyboardAvoidingViewProps,
  NativeEventSubscription,
  findNodeHandle,
  TextInput,
  KeyboardEvent,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  ScrollViewProps,
  ViewStyle,
} from 'react-native';

interface KeyboardAvoiderProps extends Omit<KeyboardAvoidingViewProps, 'children'> {
  children: ReactNode;
  dismissKeyboardOnTap?: boolean;
  scrollEnabled?: boolean;
  extraScrollHeight?: number;
  headerHeight?: number;
  scrollViewProps?: ScrollViewProps;
  contentContainerStyle?: ViewStyle;
}

const KeyboardAvoider: React.FC<KeyboardAvoiderProps> = ({
  children,
  dismissKeyboardOnTap = true,
  scrollEnabled = true,
  extraScrollHeight = 20,
  headerHeight = 0,
  scrollViewProps,
  contentContainerStyle,
  ...keyboardAvoidingViewProps
}) => {
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
  const [isKeyboardVisible, setKeyboardVisible] = useState<boolean>(false);
  
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Memoize keyboard vertical offset calculation
  const keyboardVerticalOffset = React.useMemo(() => {
    return Platform.OS === 'ios' ? headerHeight : headerHeight || 0;
  }, [headerHeight]);

  useEffect(() => {
    let keyboardDidShowListener: NativeEventSubscription;
    let keyboardDidHideListener: NativeEventSubscription;

    const keyboardShowEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const keyboardHideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    keyboardDidShowListener = Keyboard.addListener(
      keyboardShowEvent,
      (event: KeyboardEvent) => {
        setKeyboardVisible(true);
        setKeyboardHeight(event.endCoordinates.height);
      }
    );

    keyboardDidHideListener = Keyboard.addListener(
      keyboardHideEvent,
      () => {
        setKeyboardVisible(false);
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Memoize input focus handler
  const handleInputFocus = useCallback((event: NativeSyntheticEvent<TextInputFocusEventData>) => {
    if (!scrollViewRef.current || Platform.OS !== 'android') return;

    const reactTag = findNodeHandle(event.target as any);
    if (!reactTag) return;

    // Type-safe scroll to keyboard method
    const scrollView = scrollViewRef.current as any;
    if (scrollView.scrollResponderScrollNativeHandleToKeyboard) {
      scrollView.scrollResponderScrollNativeHandleToKeyboard(
        reactTag,
        extraScrollHeight,
        true
      );
    }
  }, [extraScrollHeight]);

  const dismissKeyboard = useCallback(() => {
    if (dismissKeyboardOnTap) {
      Keyboard.dismiss();
    }
  }, [dismissKeyboardOnTap]);

  // Optimized function to add focus handlers to children
  const addFocusHandlers = useCallback((child: React.ReactNode): React.ReactNode => {
    if (!React.isValidElement(child)) return child;

    // Check if it's a TextInput component
    if (child.type === TextInput) {
      const originalOnFocus = (child.props as any).onFocus;
      
      return React.cloneElement(child as React.ReactElement<any>, {
        onFocus: (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
          handleInputFocus(e);
          originalOnFocus?.(e);
        }
      });
    }

    
    if (child.props && (child.props as any).children) {
      const childProps = child.props as { children?: React.ReactNode };
      return React.cloneElement(
        child,
        { ...child.props },
        React.Children.map(childProps.children, addFocusHandlers)
      );
    }

    return child;
  }, [handleInputFocus]);

  // Memoize enhanced children to prevent unnecessary re-renders
  const enhancedChildren = React.useMemo(() => {
    return Platform.OS === 'android' 
      ? React.Children.map(children, addFocusHandlers)
      : children;
  }, [children, addFocusHandlers]);

  // Memoize bottom padding view
  const bottomPaddingView = React.useMemo(() => {
    return isKeyboardVisible ? (
      <View style={{ height: extraScrollHeight }} />
    ) : null;
  }, [isKeyboardVisible, extraScrollHeight]);

  const scrollContent = React.useMemo(() => (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
      {...scrollViewProps}
    >
      {enhancedChildren}
      {bottomPaddingView}
    </ScrollView>
  ), [enhancedChildren, contentContainerStyle, scrollViewProps, bottomPaddingView]);

  const staticContent = React.useMemo(() => (
    <View style={[styles.container, contentContainerStyle]}>
      {enhancedChildren}
    </View>
  ), [enhancedChildren, contentContainerStyle]);

  const keyboardAvoidingContent = React.useMemo(() => (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
      keyboardVerticalOffset={keyboardVerticalOffset}
      {...keyboardAvoidingViewProps}
    >
      {scrollEnabled ? scrollContent : staticContent}
    </KeyboardAvoidingView>
  ), [
    keyboardVerticalOffset,
    keyboardAvoidingViewProps,
    scrollEnabled,
    scrollContent,
    staticContent
  ]);

  return dismissKeyboardOnTap ? (
    <TouchableWithoutFeedback onPress={dismissKeyboard} accessible={false}>
      {keyboardAvoidingContent}
    </TouchableWithoutFeedback>
  ) : (
    keyboardAvoidingContent
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});

export default KeyboardAvoider;