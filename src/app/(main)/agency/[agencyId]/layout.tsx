import {
  getNotificationAndUser,
  verifyAndAcceptInvitation,
} from "@/lib/queries";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import UnauthorizedPage from "../unauthorized/page";
import Sidebar from "@/components/sidebar";
import BlurPage from "@/components/global/blur-page";
import Infobar from "@/components/global/infobar";
import { Role } from "@prisma/client";

type Props = {
  children: React.ReactNode;
  params: { agencyId: string };
};

const Layout = async ({ children, params }: Props) => {
  const agencyId = await verifyAndAcceptInvitation();
  const user = await currentUser();
  if (!user) {
    return redirect("/");
  }
  if (!agencyId) {
    return redirect("/agency");
  }
  if (
    user.privateMetadata.role !== "AGENCY_OWNER" &&
    user.privateMetadata.role !== "AGENCY_ADMIN"
  ) {
    return <UnauthorizedPage />;
  }

  let allNotif: any = [];
  const notifications = await getNotificationAndUser(agencyId);
  if (notifications) {
    allNotif = notifications;
  }

  return (
    <div className="h-screen overflow-hidden">
      <Sidebar id={params.agencyId} type="agency" />
      <div className="md:pl-[300px]">
        <Infobar
          notifications={allNotif}
          role={user.privateMetadata?.role as Role}
        />
        <div className="relative">
          <BlurPage>{children}</BlurPage>
        </div>
      </div>
    </div>
  );
};

export default Layout;
