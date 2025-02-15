import { Snackbar } from 'react-native-paper';
export default function CustomAlert({
  alertOpen,
  timeoutDuration,
  alertMessage,
  alertSeverity,
  closeAlert
}){

  return  <Snackbar
        visible={alertOpen}
        onDismiss={closeAlert}
        duration={timeoutDuration} 
         action={{
          label: 'X',
          onPress: closeAlert,
        }}>
          {alertMessage}
      </Snackbar>;
}


