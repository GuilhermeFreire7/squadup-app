import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useRef } from "react";

/**
 * Refaz a busca quando a tela volta a ter foco (ex.: voltar do detalhe para a Home, ou trocar de
 * aba). O primeiro foco é ignorado, porque a consulta já busca ao montar.
 */
export function useRefreshOnFocus(refetch: () => unknown): void {
  const isFirstFocus = useRef(true);
  useFocusEffect(
    useCallback(() => {
      if (isFirstFocus.current) {
        isFirstFocus.current = false;
        return;
      }
      refetch();
    }, [refetch])
  );
}
