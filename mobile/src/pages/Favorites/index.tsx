import React from "react";
import { View } from "react-native";

import PageHeader from "../../components/PagesHeader";

import styles from "./styles";

function Favorites() {
  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <PageHeader title="Meus proffys favoritos" />
      </View>
    </View>
  );
}

export default Favorites;
