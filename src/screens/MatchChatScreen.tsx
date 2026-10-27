import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback } from "react";
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, View } from "react-native";

import ChatInput from "../components/ChatInput";
import EmptyState from "../components/EmptyState";
import Header from "../components/Header";
import MessageBubble from "../components/MessageBubble";
import { useAuth } from "../contexts/AuthContext";
import { useMatchDetail } from "../hooks/useMatchDetail";
import { useMessages } from "../hooks/useMessages";
import type { AppRootStackParamList } from "../navigation/types";
import { colors } from "../theme";
import type { Message } from "../types";

type Nav = NativeStackNavigationProp<AppRootStackParamList>;
type Route = RouteProp<AppRootStackParamList, "MatchChat">;

export default function MatchChatScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { matchId } = route.params;

  const { user } = useAuth();
  const { match } = useMatchDetail(matchId);
  const { messages, isFetchingMore, hasMore, loadMore, sendMessage } = useMessages(matchId);

  const handleSend = useCallback(
    (text: string) => {
      sendMessage(text);
    },
    [sendMessage]
  );

  const renderItem = useCallback(
    ({ item }: { item: Message }) => (
      <MessageBubble message={item} isOwn={item.senderId === user?.id} />
    ),
    [user?.id]
  );

  const keyExtractor = useCallback((item: Message) => item.id, []);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-secondary-50"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
      <Header
        title={match ? match.title : "Chat da partida"}
        subtitle={
          match
            ? `${match.participants.filter((p) => p.status === "confirmed").length} participantes`
            : ""
        }
        onBack={() => navigation.goBack()}
      />

      {/* Messages list */}
      <FlatList
        data={messages}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        inverted
        contentContainerStyle={{ paddingVertical: 12 }}
        showsVerticalScrollIndicator={false}
        onEndReached={hasMore ? loadMore : undefined}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          isFetchingMore ? (
            <View className="py-3" style={{ transform: [{ scaleY: -1 }] }}>
              <ActivityIndicator color={colors.primary[500]} />
            </View>
          ) : null
        }
        ListEmptyComponent={
          // Lista invertida: o vazio é desvirado para ficar de pé
          <View className="flex-1" style={{ transform: [{ scaleY: -1 }] }}>
            <EmptyState
              icon="chat-outline"
              title="Nenhuma mensagem ainda."
              description="Seja o primeiro a escrever!"
            />
          </View>
        }
      />

      {/* Input */}
      <ChatInput onSend={handleSend} />
    </KeyboardAvoidingView>
  );
}
