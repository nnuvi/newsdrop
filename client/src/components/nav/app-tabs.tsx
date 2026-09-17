import {
  Tabs,
  TabList,
  TabSlot,
  TabTrigger,
  type TabListProps,
  type TabTriggerSlotProps,
} from "expo-router/ui";

import {
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { ReactNode } from "react";

import { useTheme } from "@/hooks/use-theme";
import { ThemedView } from "../ui/themed-view";
import { ThemedText } from "../ui/themed-text";
import { Image } from "../ui/image";
import { Icons } from "@/constants/images";

const PILL_RADIUS = 999;

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot />

      <TabList asChild>
        <FloatingTabBar>
          <TabTrigger name="home" href="/home" asChild>
            <TabButton title="Home" source={Icons.home} />
          </TabTrigger>

          <TabTrigger name="profile" href="/profile" asChild>
            <TabButton title="Profile" source={Icons.profile} />
          </TabTrigger>
        </FloatingTabBar>
      </TabList>
    </Tabs>
  );
}

function FloatingTabBar({
  children,
  ...props
}: TabListProps & { children: ReactNode }) {
  const theme = useTheme();

  return (
    <View
      {...props}
      style={[
        styles.tabBar,
        {
          backgroundColor: theme.backgroundElement,
          shadowColor: theme.muted,
        },
      ]}
    >
      {children}
    </View>
  );
}

type TabButtonProps = TabTriggerSlotProps & {
  source: ImageSourcePropType;
  title: string;
};

function TabButton({
  children,
  isFocused,
  style,
  source,
  title,
  ...props
}: TabButtonProps) {
  const theme = useTheme();

  return (
    <Pressable {...props}>
      <ThemedView
        {...props}
        // local pill styles LAST so injected `style` can't strip borderRadius
        style={[
          styles.tabButton,
          {
            backgroundColor: isFocused
              ? theme.backgroundSelected
              : "transparent",
          },
        ]}
      >
        <Image
          source={source}
          style={{
            tintColor: isFocused ? theme.primary : theme.muted,
          }}
          size={21}
        />
        <ThemedText
          style={[
            styles.tabText,
            {
              color: isFocused ? theme.primary : theme.muted,
            },
          ]}
        >
          {title}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 24,
    alignSelf: "center",

    flexDirection: "row",
    alignItems: "center",

    padding: 5,
    borderRadius: 999,
    overflow: "hidden", 

    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,

    elevation: 8,
  },

  tabButton: {
    width: 130,
    height: 50,

    borderRadius: 999,
    overflow: "hidden", 

    alignItems: "center",
    justifyContent: "center",
  },

  tabButtonView: {
    width: "100%",
    height: "100%",

    borderRadius: 999,
    overflow: "hidden", 

    alignItems: "center",
    justifyContent: "center",
  },

  tabText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
