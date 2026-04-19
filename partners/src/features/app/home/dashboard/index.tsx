import { Header } from "../../global/header";
import { Stats } from "../modules/stats";

const CreatorDashboard = () => {
  return (
    <div className="space-y-5">
      <Header
        header={{
          title: "Creator Dashboard",
          subtitle: "Platform statistics",
          position: "stacked",
        }}
      />

      <Stats />
    </div>
  );
};

export default CreatorDashboard;
