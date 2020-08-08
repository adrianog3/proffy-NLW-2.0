import React, { useState } from "react";
import { View, Image, Text, Linking } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-community/async-storage";

import heartOutlineIcon from "../../assets/images/icons/heart-outline.png";
import disfavorIcon from "../../assets/images/icons/disfavor.png";
import whatsappIcon from "../../assets/images/icons/whatsapp.png";
import api from "../../services/api";

import styles from "./styles";

export interface Teacher {
  id: number;
  avatar: string;
  biography: string;
  cost: number;
  name: string;
  subject: string;
  whatsapp: string;
}

interface TeacherItemProps {
  teacher: Teacher;
  favored: boolean;
}

const TeacherItem: React.FC<TeacherItemProps> = ({ teacher, favored }) => {
  const [isFavorite, setIsFavorite] = useState(favored);

  async function handleLinkToWhatsapp() {
    api.post("connections", {
      user_id: teacher.id,
    });

    try {
      await Linking.openURL(`whatsapp://send?phone=${teacher.whatsapp}`);
    } catch (err) {
      console.log("Fatal error: " + err);
    }
  }

  async function handleToggleFavorite() {
    const favorites = await AsyncStorage.getItem("favorites");

    let favoritesArray = [];

    if (favorites) {
      favoritesArray = JSON.parse(favorites);
    }

    if (isFavorite) {
      const favoriteIndex = favoritesArray.findIndex((teacherItem: Teacher) => {
        return teacherItem.id === teacher.id;
      });

      favoritesArray.splice(favoriteIndex, 1);

      setIsFavorite(false);
    } else {
      favoritesArray.push(teacher);

      setIsFavorite(true);
    }

    await AsyncStorage.setItem("favorites", JSON.stringify(favoritesArray));
  }

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <Image style={styles.avatar} source={{ uri: teacher.avatar }} />

        <View style={styles.profileInfo}>
          <Text style={styles.name}>{teacher.name}</Text>
          <Text style={styles.subject}>{teacher.subject}</Text>
        </View>
      </View>
      <Text style={styles.biography}>{teacher.biography}</Text>

      <View style={styles.footer}>
        <Text style={styles.price}>
          Preço/Hora {"   "}
          <Text style={styles.priceValue}>R$ {teacher.cost}</Text>
        </Text>

        <View style={styles.buttonsContainer}>
          <RectButton
            style={[styles.favoriteButton, isFavorite ? styles.isFavorite : {}]}
            onPress={handleToggleFavorite}
          >
            {isFavorite ? (
              <Image source={disfavorIcon} />
            ) : (
              <Image source={heartOutlineIcon} />
            )}
          </RectButton>

          <RectButton
            style={styles.contactButton}
            onPress={handleLinkToWhatsapp}
          >
            <Image source={whatsappIcon} />
            <Text style={styles.contactButtonText}>Entrar em contato</Text>
          </RectButton>
        </View>
      </View>
    </View>
  );
};

export default TeacherItem;
