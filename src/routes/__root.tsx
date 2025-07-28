import { createRootRoute, Outlet } from "@tanstack/react-router";
import PublicLayout from "../layouts/PublicLayout";

export const Route = createRootRoute({
   component: () => (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  ),
});
