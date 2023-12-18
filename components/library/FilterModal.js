import { Modal, View, Text, Button, TextInput } from 'react-native';

const FilterModal = ({ visible, onClose, onApply }) => {
 return (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
        <Text>Make</Text>
        <TextInput
          // Add your make filter here
        />
        <Text>Model</Text>
        <TextInput
          // Add your model filter here
        />
        <Text>Year</Text>
        <TextInput
          // Add your year filter here
        />
        <Button title="Apply" onPress={onApply} />
        <Button title="Close" onPress={onClose} />
      </View>
    </View>
  </Modal>
 );
};

export default FilterModal;
