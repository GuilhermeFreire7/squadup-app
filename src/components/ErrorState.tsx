import React, { memo } from "react";

import Button from "./Button";
import EmptyState from "./EmptyState";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry: () => void;
}

/** Falha ao carregar dados do servidor, com ação de tentar de novo. */
function ErrorState({
  title = "Não foi possível carregar",
  description = "Verifique sua conexão e tente de novo.",
  onRetry,
}: Readonly<ErrorStateProps>) {
  return (
    <EmptyState
      icon="cloud-alert-outline"
      title={title}
      description={description}
      action={<Button label="Tentar de novo" icon="refresh" onPress={onRetry} />}
    />
  );
}

export default memo(ErrorState);
