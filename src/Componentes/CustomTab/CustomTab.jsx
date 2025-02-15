import { View, StyleSheet } from "react-native";

export default function CustomTab(props) {
  const { children, value, index, ...other } = props;

  const disp =  value !== index ? 'none' : 'flex';
  return (
    <View
      style={[styles.customTab, { display: disp }]}
    >
      {value === index && <View style={styles.customTab}>{children}</View>}
    </View>
  );
}


const styles = StyleSheet.create({
  customTab:{
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  }
})