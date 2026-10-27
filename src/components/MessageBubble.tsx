import React, { memo } from "react";
import { Text, View } from "react-native";

import { shadows } from "../theme";
import type { Message } from "../types";
import { formatMessageTime } from "../utils/date";
import Avatar from "./Avatar";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

function MessageBubble({ message, isOwn }: Readonly<MessageBubbleProps>) {
  if (message.type === "system") {
    return (
      <View className="items-center my-2" accessibilityRole="text">
        <View className="bg-secondary-200/70 rounded-full px-4 py-1.5">
          <Text className="text-xs font-medium text-secondary-500 text-center">{message.text}</Text>
        </View>
      </View>
    );
  }

  if (isOwn) {
    return (
      <View className="flex-row justify-end px-4 mb-2.5">
        <View className="max-w-[75%]">
          <View className="bg-primary-500 rounded-3xl rounded-br-md px-4 py-2.5">
            <Text className="text-white text-sm leading-5">{message.text}</Text>
          </View>
          <Text className="text-xs text-secondary-500 mt-1 text-right">
            {formatMessageTime(message.createdAt)}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-row items-end px-4 mb-2.5 gap-2">
      <Avatar name={message.senderName} photoUrl={message.senderPhotoUrl} size="xs" />
      <View className="max-w-[75%]">
        <Text className="text-xs font-medium text-secondary-500 mb-1 ml-1">
          {message.senderName}
        </Text>
        <View
          className="bg-white rounded-3xl rounded-bl-md px-4 py-2.5 border border-secondary-100"
          style={shadows.card}
        >
          <Text className="text-secondary-900 text-sm leading-5">{message.text}</Text>
        </View>
        <Text className="text-xs text-secondary-500 mt-1 ml-1">
          {formatMessageTime(message.createdAt)}
        </Text>
      </View>
    </View>
  );
}

export default memo(MessageBubble);
