import { Router, createRouter, createWebHashHistory } from "vue-router";
import HomeView from "@/views/home-view.vue";
import CampaignView from "@/views/campaign-view.vue";
import SkirmishView from "@/views/skirmish-view.vue";
import DifficultActivityView from "@/views/difficult-activity-view.vue";
import { useApiStore } from "@/stores/api-store";
import { registerShortcuts } from "@/util/register-shortcuts";
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

function registerBeforeAll(router: Router, action: () => Promise<void>) {
  let run = false;
  router.beforeEach(async () => {
    if (run) {
      return;
    }
    await action();
    run = true;
  });
}

registerBeforeAll(router, async () => {
  const apiStore = useApiStore();
  await apiStore.loadRequiredData();
});

registerBeforeAll(router, async () => {
  try {
    await registerShortcuts();
  } finally {
  }
});

export default router;
