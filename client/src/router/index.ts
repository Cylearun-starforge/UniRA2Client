import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "@/views/home-view.vue";
import CampaignView from "@/views/campaign-view.vue";
import SkirmishView from "@/views/skirmish-view.vue";
import DifficultActivityView from "@/views/difficult-activity-view.vue";
import { useApiStore } from "@/stores/api-store";
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/campaign",
      name: "campaign",
      component: CampaignView,
    },
    {
      path: "/skirmish",
      name: "skirmish",
      component: SkirmishView,
    },
    {
      path: "/difficult-activity",
      name: "difficultActivity",
      component: DifficultActivityView,
    },
  ],
});

router.beforeEach(async () => {
  const apiStore = useApiStore();
  await apiStore.tryLoadMaps();
});

export default router;
