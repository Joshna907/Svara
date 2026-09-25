import path from "node:path";
import { RoomConfiguration } from "@livekit/protocol";
import { config } from "dotenv";
import { NextResponse } from "next/server";
import { AccessToken, type AccessTokenOptions, type VideoGrant } from "livekit-server-sdk";

export const revalidate = 0;

type ConnectionDetails = {
  serverUrl: string;
  roomName: string;
  participantName: string;
  participantToken: string;
};

function loadLocalBackendEnvironment() {
  if (!process.env.LIVEKIT_URL || !process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET) {
    config({ path: path.resolve(process.cwd(), "../.env.local") });
  }
}

export async function POST() {
  try {
    loadLocalBackendEnvironment();

    const serverUrl = process.env.LIVEKIT_URL;
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const agentName = process.env.AGENT_NAME ?? "digital-twin";

    if (!serverUrl || !apiKey || !apiSecret) {
      throw new Error("LiveKit credentials are missing. Add them to the project .env.local file.");
    }

    const suffix = crypto.randomUUID().slice(0, 8);
    const roomName = `jothsana-twin-${suffix}`;
    const participantName = "Guest";
    const participantToken = await createParticipantToken(
      { identity: `portfolio-guest-${suffix}`, name: participantName },
      roomName,
      agentName,
      apiKey,
      apiSecret,
    );

    const data: ConnectionDetails = {
      serverUrl,
      roomName,
      participantName,
      participantToken,
    };

    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create a LiveKit session.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function createParticipantToken(
  userInfo: AccessTokenOptions,
  roomName: string,
  agentName: string,
  apiKey: string,
  apiSecret: string,
) {
  const token = new AccessToken(apiKey, apiSecret, { ...userInfo, ttl: "15m" });
  const grant: VideoGrant = {
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canPublishData: true,
    canSubscribe: true,
  };
  token.addGrant(grant);
  token.roomConfig = new RoomConfiguration({ agents: [{ agentName }] });
  return token.toJwt();
}
