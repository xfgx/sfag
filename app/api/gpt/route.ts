import { OpenAiChatCompletionReq } from "@/pkg/openai";
import { checkAuth } from "../check-auth";
import { NextRequest, NextResponse } from "next/server";
import { UserVisitInc } from "@/model/user";
import {
  AZURE_API_HOST,
  AZURE_API_VERSION,
  AZURE_DEPLOYMENT_ID,
  OPENAI_API_HOST,
  OPENAI_API_KEY,
  OPENAI_API_TYPE,
  OPENAI_ORGANIZATION,
} from "@/lib/env-var";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<Response> {
  const userId = await checkAuth();
  if (userId < 1) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await UserVisitInc(userId);
  const payload: OpenAiChatCompletionReq = await req.json();

  let url = `${OPENAI_API_HOST}/v1/chat/completions`;
  if (OPENAI_API_TYPE === "azure") {
    let modelID = AZURE_DEPLOYMENT_ID;
    if (payload.model) {
      // remove modelID's '.' to ''
      modelID = payload.model.replace(/\./g, "");
    }
    url = `${AZURE_API_HOST}/openai/deployments/${modelID}/chat/completions?api-version=${AZURE_API_VERSION}`;
  }
  try {
    return await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "api-key": `${OPENAI_API_KEY}`,
        "OpenAI-Organization": OPENAI_ORGANIZATION,
      },
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch (err) {
    const e = err as Error;
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
