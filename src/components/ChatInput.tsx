import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { memo, useState } from "react";
import { Pressable, TextInput, View } from "react-native";

import { colors, shadows } from "../theme";

interface ChatInputProps {
  onSend: (text: string) => void;
}

function ChatInput({ onSend }: Readonly<ChatInputProps>) {
  const [text, setText] = useState("");

  const canSend = text.trim().length > 0;

  function handleSend() {
    if (!canSend) return;
    onSend(text);
    setText("");
  }

  return (
    <View
      className="flex-row items-end bg-white px-4 py-3 gap-2.5 border-t border-secondary-200"
      style={shadows.overlay}
    >
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Mensagem..."
        placeholderTextColor={colors.secondary[500]}
        multiline
        maxLength={500}
        onSubmitEditing={handleSend}
        className="flex-1 bg-secondary-100 rounded-3xl px-4 py-2.5 text-sm text-secondary-900 max-h-28"
        style={{ minHeight: 44 }}
        accessibilityLabel="Campo de mensagem"
      />
      <Pressable
        onPress={handleSend}
        disabled={!canSend}
        accessibilityLabel="Enviar mensagem"
        accessibilityRole="button"
        className={`w-11 h-11 rounded-full items-center justify-center ${
          canSend ? "bg-primary-500" : "bg-secondary-100"
        }`}
        style={({ pressed }) => (pressed && canSend ? { transform: [{ scale: 0.92 }] } : undefined)}
      >
        <MaterialCommunityIcons
          name="send"
          size={18}
          color={canSend ? colors.white : colors.secondary[400]}
        />
      </Pressable>
    </View>
  );
}

export default memo(ChatInput);
