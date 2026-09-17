import { NextResponse } from "next/server";
import { getAuthedUser } from "@/lib/supabase/get-user";
import { exportMyData } from "@/app/actions/account";
import { todayISO } from "@/lib/utils";

export async function GET() {
  const user = await getAuthedUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const data = await exportMyData();

  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="selene-data-${todayISO()}.json"`,
    },
  });
}
