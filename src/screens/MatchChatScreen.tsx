import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback } from "react";
import { ActivityIndicator, FlatList, KeyboardAvoidingView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ChatInput from "../components/ChatInput";
import EmptyState from "../components/EmptyState";
import Header from "../components/Header";
import MessageBubble from "../components/MessageBubble";
import { useAuth } from "../contexts/AuthContext";
import { useKeyboardVisible } from "../hooks/useKeyboardVisible";
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

  const insets = useSafeAreaInsets();
  const isKeyboardVisible = useKeyboardVisible();
  const { user } = useAuth();
  const { match } = useMatchDetail(matchId);
  // Polling só com o chat visível: ao abrir outra tela por cima, para de buscar.
  const isFocused = useIsFocused();
  const { messages, isFetchingMore, hasMore, loadMore, sendMessage } = useMessages(matchId, {
    poll: isFocused,
  });

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
      // Edge-to-edge (Android, SDK 54): a janela não redimensiona mais com o teclado, então sem
      // `behavior` a tela fica por baixo dele. "padding" nos dois sistemas, como pede o guia da Expo.
      behavior="padding"
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
        // Sem transform manual no rodapé e no vazio: o próprio FlatList já aplica neles a mesma
        // inversão da lista, e o jeito de inverter muda por plataforma (Android gira 180° com
        // `scale: -1`, iOS usa `scaleY: -1`). Um `scaleY: -1` extra deixava o texto espelhado
        // no Android.
        ListFooterComponent={
          isFetchingMore ? (
            <View className="py-3">
              <ActivityIndicator color={colors.primary[500]} />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View className="flex-1" testID="chat-empty">
            <EmptyState
              icon="chat-outline"
              title="Nenhuma mensagem ainda."
              description="Seja o primeiro a escrever!"
            />
          </View>
        }
      />

      {/* Input. Edge-to-edge: sem esse espaço, a barra de navegação do Android fica por cima do
          campo. Com o teclado aberto, ele já cobre essa área. */}
      <View
        className="bg-white"
        testID="chat-input-container"
        style={{ paddingBottom: isKeyboardVisible ? 0 : insets.bottom }}
      >
        <ChatInput onSend={handleSend} />
      </View>
    </KeyboardAvoidingView>
  );
}
