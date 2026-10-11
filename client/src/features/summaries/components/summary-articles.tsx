import { useState } from "react";
import { Linking, Pressable, StyleSheet, View } from "react-native";

import { Image } from "@/components/ui/image";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import { Spacing } from "@/constants/theme";
import { Icons } from "@/constants/images";
import logger from "@/lib/logger";

type Article = {
  id: string;
  title: string;
  url?: string | null;
  image_url?: string | null;
  source: string;
};

type SummaryArticlesProps = {
  articles: Article[];
};

export function SummaryArticles({ articles }: SummaryArticlesProps) {
  const [expanded, setExpanded] = useState(false);

  if (articles.length === 0) return null;

  const openArticle = async (url?: string | null) => {
    if (!url) return;

    try {
      const parsedUrl = new URL(url);

      if (!["http:", "https:"].includes(parsedUrl.protocol)) return;

      await Linking.openURL(parsedUrl.toString());
    } catch (error) {
      logger.error("Failed to open article URL", error);
    }
  };

  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={() => setExpanded((previous) => !previous)}
        style={styles.header}
      >
        <View style={styles.headerText}>
          <ThemedText type="smallBold">Articles ({articles.length})</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {expanded ? "Hide articles" : "Show articles"}
          </ThemedText>
        </View>

        <Image
          source={expanded ? Icons.up : Icons.down}
          size={20}
          tintColor="textSecondary"
        />
      </Pressable>

      {expanded && (
        <View style={styles.articleList}>
          {articles.map((article) => (
            <View key={article.id} style={styles.article}>
              {article.image_url ? (
                <Image
                  source={{ uri: article.image_url }}
                  style={styles.articleImage}
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Image
                    source={Icons.placeholder}
                    size={28}
                    tintColor="textSecondary"
                  />
                </View>
              )}

              <View style={styles.articleContent}>
                {/* <ThemedText type="smallBold">
                  {article.title}
                </ThemedText> */}
                <Pressable
                  onPress={() => openArticle(article.url)}
                  disabled={!article.url}
                  accessibilityRole="link"
                >
                  <ThemedText type="smallBold">{article.title}</ThemedText>
                </Pressable>

                <ThemedText type="small" themeColor="textSecondary">
                  {article.source}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.three,
    borderRadius: 12,
    gap: Spacing.two,
    width: "100%",
  },
  header: {
    width: "100%",
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  headerText: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.one,
  },
  articleList: {
    width: "100%",
    gap: Spacing.two,
  },
  article: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "center",
    gap: Spacing.three,
    paddingVertical: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#80808040",
  },
  articleImage: {
    width: 88,
    height: 72,
    flexShrink: 0,
    borderRadius: 8,
  },
  imagePlaceholder: {
    width: 88,
    height: 72,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#80808020",
    borderRadius: 8,
  },
  articleContent: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.one,
  },
});
