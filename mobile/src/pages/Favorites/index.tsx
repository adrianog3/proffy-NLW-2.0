import React from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import PageHeader from "../../components/PagesHeader";
import TeacherItem from "../../components/TeacherItem";

import styles from "./styles";

function Favorites() {
  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <PageHeader title="Meus proffys favoritos" />

        <ScrollView
          style={styles.teacherList}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 24,
          }}
        >
          <TeacherItem />
          <TeacherItem />
          <TeacherItem />
          <TeacherItem />
          <TeacherItem />
        </ScrollView>
      </View>
    </View>
  );
}

export default Favorites;
