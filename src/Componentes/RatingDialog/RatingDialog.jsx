import { useState } from "react";
import { View } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { Rating } from 'react-native-ratings';

export default function RatingDialog({
  id,
  type,
  ratingDialogOpen,
  ratingDialogTitle,
  rating,
  ratingDialogCancelButton,
  ratingDialogCancelButtonAction,
  ratingDialogConfirmButton,
  ratingDialogConfirmButtonAction,
  ratingDialogCloseAction,
}){
  const [tempRating, setTempRating] = useState(rating);
  
  return (
        <Portal>
          <Dialog visible={ratingDialogOpen} onDismiss={ratingDialogCloseAction}>
            <Dialog.Title>{ratingDialogTitle}</Dialog.Title>
            <Dialog.Content>
                <Rating 
                  type="custom"
                    defaultRating={0}
                    ratingCount={10}
                    imageSize={25} 
                    startingValue={rating}   
                    jumpValue={0.5}                   
                    style={{ padding: 10 }}
                    onFinishRating={(newValue) =>  {
                      console.log("new Rate", newValue);
                      setTempRating(newValue)
                    }}
                  />
            </Dialog.Content>
            <Dialog.Actions>
              <Button 
              onPress={ratingDialogCancelButtonAction}>
                {ratingDialogCancelButton}
              </Button>
              <Button 
              onPress={() => ratingDialogConfirmButtonAction(tempRating, rating)}
              disabled={!rating && !tempRating}
              >
                {ratingDialogConfirmButton}
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
  );
}