import { View, Text, StyleSheet, Image, Pressable, Dimensions } from "react-native";
import {TextInput, HelperText, Checkbox, ActivityIndicator } from 'react-native-paper';
import { useEffect, useState, useContext } from "react";
import {  ThemeContext, LanguageContext, GlobalComponentsContext } from '../../Contexts/index.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

async function getComments(id, type) {
  const comments = await AsyncStorage.getItem(`comments::${type}::${id}`);
  if (comments) {
    return JSON.parse(comments);
  } else {
    return [];
  }
}

const genUUID = () => {
  return "uid-" + Math.random().toString(36).substr(2, 18);
};

async function deleteComments(id, type, comments, commentID) {
  const cloneComments = [...comments];

  const idx = cloneComments.findIndex((c) => c.id === commentID);
  cloneComments.splice(idx, 1);

  await AsyncStorage.setItem(
    `comments::${type}::${id}`,
    JSON.stringify(cloneComments)
  );
  return cloneComments;
}

async function updateComments(id, type, comments, commentID, comment) {
  const cloneComments = [...comments];

  const idx = cloneComments.findIndex((c) => c.id === commentID);
  cloneComments[idx] = comment;

  await AsyncStorage.setItem(
    `comments::${type}::${id}`,
    JSON.stringify(cloneComments)
  );
  return cloneComments;
}

async function createComments(id, type, comments, comment) {
  const cloneComments = [...comments];

  const newComment = {
    ...comment,
    id: genUUID(),
    date: new Date(),
  };

  cloneComments.push(newComment);

  await AsyncStorage.setItem(
    `comments::${type}::${id}`,
    JSON.stringify(cloneComments)
  );
  return cloneComments;
}

export default function Comments({ id, type }){
  const { getTranslation, language } = useContext(LanguageContext);
  const {colors, theme, isPortrait, width, height} = useContext(ThemeContext);
  const { showAlert, closeAlert, showDialog, closeDialog } = useContext(
    GlobalComponentsContext
  );
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState({
    id: null,
    text: "",
    date: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
    const  load = async () => {
      try {
        setIsLoading(true);

        const data = await getComments(id, type);
        setComments(data);

        setErrorMsg(null);
      } catch (err) {
        setErrorMsg(err.message ?? err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id, type]);

   let newCommentStyle = !isPortrait() && width >= 700 ? styles.new_comment_container_landscape : styles.new_comment_container; 

   let inputStyle = !isPortrait() && width >= 700 ? styles.comment_input_container_landscape : styles.comment_input_container;

     let itemStyle = !isPortrait() && width >= 700 ? styles.comment_item_landscape : styles.comment_item; 

  return (
    <View style={styles.comments}>
    {
      !isLoading && errorMsg == null ? (
        <View style={newCommentStyle}>
          <View style={inputStyle}>
            <TextInput 
              mode="outlined"
              label={getTranslation("Common::Label::Comment")}
              value={comment.text}
              onChangeText={(t) =>
                setComment((d) => {
                  return { ...d, text: t };
                })
              }
              style={styles.comment_input}
            />
          </View>
          <Pressable 
            disabled={comment.text.trim().length === 0}
            onPress={async () => {
              try {
                if (comment.id == null) {
                  const clone = await createComments(id, type, comments, comment);
                  setComments(clone);
                  showAlert(
                    getTranslation("Comments::Label::AddSuccess"),
                    "success"
                  );
                } else {
                  const clone = await updateComments(
                    id,
                    type,
                    comments,
                    comment.id,
                    comment
                  );
                  setComments(clone);
                  showAlert(
                    getTranslation("Comments::Label::UpdateSuccess"),
                    "success"
                  );
                }
                setComment({
                  id: null,
                  text: "",
                  date: null,
                });
              } catch (err) {
                const error =
                  comment.id == null
                    ? getTranslation("Comments::Label::AddError")
                    : getTranslation("Comments::Label::UpdateError");
                showAlert(error, "error");
              }
            }}
            style={[styles.comment_button, {          
                backgroundColor: comment.text.trim().length !== 0 ? colors.primary_strong_color : colors.disabled,
                borderColor: comment.text.trim().length !== 0 ? colors.primary_strong_text_color: colors.white,
              }]}
            >
              <Text style={[styles.text, 
              {color: comment.text.trim().length !== 0 ? colors.primary_strong_text_color : colors.white }
              ]}>
                {comment.id == null
                ? getTranslation("Common::Label::Add")
                : getTranslation("Common::Label::Update")}
              </Text>
          </Pressable>
        </View>
      ): (null)
    }
    {
      isLoading ?
      ( 
        <View style={[styles.comments_loading, {borderColor: colors.primary_weak_text_color}]}>
          <ActivityIndicator animated={true} color={colors.primary_weak_text_color}/>
          <View style={[styles.text, {color: colors.primary_weak_text_color}]}>{getTranslation("Common::Label::Loading")}</View>
        </View>
      ) :  errorMsg != null ? 
      (
      <View style={[styles.comments_error, {backgroundColor: colors.error, borderColor: colors.white, shadowColor: colors.error}]}>
      <Text style={[styles.comments_error_msg, {color: colors.white}]}>{errorMsg}</Text>
    </View> 
      ): comments === null || comments.length === 0 ? 
      (
      <View style={[styles.comments_error, {backgroundColor: colors.alert, borderColor: colors.black, shadowColor: colors.alert}]}>
        <Text style={[styles.comments_error_msg, {color: colors.black}]}>{getTranslation("Common::Label::EmptyList")}</Text>
      </View> 
      ):
      (
        <View style={styles.comments_content_container}>
          <View style={styles.comments_content}>
            {
              comments.map((cmt, idx) => (
                <View key={idx} style={itemStyle}>
                  <View style={[styles.comment_card, {borderColor: colors.primary_weak_text_color}]}>
                  <View style={styles.comment_action}>
                    <Pressable onPress={() => {
                      setComment(cmt);
                    }}>
                      <Feather name="edit" size={24} color={colors.primary_weak_text_color} />
                    </Pressable>
                    <Pressable onPress={async () => {
                      try {
                        const clone = await deleteComments(
                          id,
                          type,
                          comments,
                          cmt.id
                        );
                        setComments(clone);
                        showAlert(
                          getTranslation("Comments::Label::DeleteSuccess"),
                          "success"
                        );
                      } catch (err) {
                        showAlert(
                          getTranslation("Comments::Label::DeleteError"),
                          "error"
                        );
                      }
                    }}>
                      <FontAwesome6 name="trash-can" size={24} color={colors.primary_weak_text_color} />
                    </Pressable>
                  </View>
                  <View style={styles.comment_main}>
                    <Text style={[styles.highlight, {color: colors.primary_weak_text_color}]}>
                      {cmt.text}
                    </Text>
                    <Text style={[styles.text, {color: colors.primary_weak_text_color}]}>
                      {new Date(cmt.date).toLocaleString(language)}
                    </Text>
                  </View>
                  </View>
                </View>
              ))
            }
          </View>
        </View>
      )
    }
    </View>
  );
}

const styles = StyleSheet.create({
highlight:{
  fontSize: 25,
  fontWeight: 'bolder'
},
text:{
  fontSize: 15,
  fontWeight: 'bold',
},
comments: {
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    gap: 10,
    width: '100%',
    marginVertical: 20,
  },
new_comment_container:{
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-evenly',
  gap: 20,
  marginVertical: 20,
},
new_comment_container_landscape:{
  width: '100%',
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-evenly',
  gap: 20,
  marginVertical: 20,
},
comment_input_container:{
  width: '100%',
},
comment_input_container_landscape:{
  width: '45%',
},
comment_input:{
  padding: 10,
  minHeight: 30,
  width: '100%'
},
comment_button:{
  padding: 10,
  borderWidth: 1,
  borderRadius: 10,
  width: '80%',
  maxWidth: 200,
  justifyContent: 'center',
  alignItems: 'center'
},
comments_loading:{
  flexDirection: 'row',
  alignContent: 'center',
  justifyContent: 'center',
  gap: 10,
  width: '100%',
  padding: 10,
  borderRadius: 10,
  borderWidth: 1
},
comments_error:{
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 2,
  borderRadius: 10,
  shadowOffset: 2,
  shadowOpacity: 2,
  shadowRadius: 2,
  padding: 10
},
comments_error_msg:{
  fontSize: 25,
  fontWeight: 'bold',
  textTransform: 'uppercase',
},
comments_content_container:{
  width: '100%',
  gap: 20,
  alignItems: 'center',
},
comments_content: {
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-evenly',
  alignItems: 'stretch', 
  flexWrap: 'wrap',
  gap: 20,
},
comment_item:{
  width: '90%',
},
comment_item_landscape:{
  width: '45%',  
},
comment_card: {
  width: '100%',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: 10,
  borderWidth: 2,
  borderRadius: 10,
  padding: 10,
},
comment_action:{
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-evenly',
  alignItems: 'center',
},
comment_main: {  
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 20,
}
});