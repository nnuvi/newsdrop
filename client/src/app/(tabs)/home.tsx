
import LogoText from "@/assets/images/logo-text-light.svg";
import { Screen } from "@/components/core/screen";
import TopicHeader from "@/features/topics/components/topic-header";
import TopicList from "@/features/topics/components/topic-list";

export default function Home() {
  return (
    <Screen>
      <LogoText width={160} height={40} />
      <TopicHeader />
      <TopicList />
    </Screen>
  );
}
