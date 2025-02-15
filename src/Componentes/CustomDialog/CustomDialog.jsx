import * as React from 'react';
import { View } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';

export default function CustomDialog({
  dialogOpen,
  dialogTitle,
  dialogMessage,
  dialogCancelButton,
  dialogCancelButtonAction,
  dialogConfirmButton,
  dialogConfirmButtonAction,
  dialogCloseAction,
}) {

  return (
        <Portal>
          <Dialog visible={dialogOpen} onDismiss={dialogCloseAction}>
            <Dialog.Title>{dialogTitle}</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">{dialogMessage}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={dialogCancelButtonAction}>{dialogCancelButton}</Button>
              <Button onPress={dialogConfirmButtonAction}>{dialogConfirmButton}</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
  );
};