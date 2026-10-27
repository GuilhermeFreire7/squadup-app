import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { memo, useState } from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";

import { colors, type IconName } from "../theme";

interface InputProps extends Omit<TextInputProps, "className"> {
  label?: string;
  error?: string;
  leftIcon?: IconName;
}

function Input({ label, error, leftIcon, multiline, style, ...rest }: Readonly<InputProps>) {
  const [focused, setFocused] = useState(false);
  const isDisabled = rest.editable === false;

  let boxClass = "border-secondary-200 bg-white";
  if (isDisabled) boxClass = "border-secondary-200 bg-secondary-100";
  else if (error) boxClass = "border-error bg-error-50";
  else if (focused) boxClass = "border-primary-500 bg-white";

  let iconColor: string = colors.secondary[500];
  if (error) iconColor = colors.error;
  else if (focused) iconColor = colors.primary[500];

  return (
    <View className="w-full">
      {label ? <Text className="mb-1.5 text-label text-secondary-700">{label}</Text> : null}

      <View
        className={`w-full flex-row rounded-control border-[1.5px] ${boxClass} ${
          multiline ? "items-start" : "items-center"
        }`}
      >
        {leftIcon ? (
          <View className={`pl-4 ${multiline ? "pt-3.5" : ""}`}>
            <MaterialCommunityIcons name={leftIcon} size={20} color={iconColor} />
          </View>
        ) : null}
        <TextInput
          className={`flex-1 px-4 py-3 text-body ${
            isDisabled ? "text-secondary-500" : "text-secondary-900"
          } ${multiline ? "min-h-24" : ""}`}
          placeholderTextColor={colors.secondary[500]}
          multiline={multiline}
          textAlignVertical={multiline ? "top" : undefined}
          style={style}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityLabel={label}
          {...rest}
        />
      </View>

      {error ? (
        <View className="mt-1.5 flex-row items-center gap-1">
          <MaterialCommunityIcons name="alert-circle" size={14} color={colors.error} />
          <Text className="text-body-sm text-error-700 flex-1">{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

export default memo(Input);
