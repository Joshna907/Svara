"use client";

import {
  BarVisualizer,
  DisconnectButton,
  LiveKitRoom,
  RoomAudioRenderer,
  TrackToggle,
  useTranscriptions,
  useVoiceAssistant,
} from "@livekit/components-react";
import { Microphone, PhoneDisconnect, WarningCircle, Waveform } from "@phosphor-icons/react";
import { Track } from "livekit-client";
import { useEffect, useState } from "react";

export type ConnectionDetails = {
  serverUrl: string;
  roomName: string;
  participantName: string;
  participantToken: string;
};

type VoiceStageProps = {
  connection: ConnectionDetails | null;
  isStarting: boolean;
  error: string | null;
  onStart: () => void;
  onDisconnected: () => void;
};

export function VoiceStage({ connection, isStarting, error, onStart, onDisconnected }: VoiceStageProps) {
  if (!connection) {
    return (
      <div className="voice-stage voice-stage-idle">
        <div className="stage-topline">
          <span className="stage-label">Svara voice studio</span>
          <div className="connection-state"><span /> Ready</div>
        </div>
        <VoiceOrb state={isStarting ? "connecting" : error ? "error" : "idle"} />
        <div className="voice-heading">
          <h2>{isStarting ? "Preparing your room" : error ? "Something needs attention" : "Ready when you are"}</h2>
          <p>{isStarting ? "Connecting securely to LiveKit" : error || "Allow microphone access, then speak naturally."}</p>
        </div>
        <div className="voice-prompt-dock">
          <div className="dock-prompt">
            <span>Try asking</span>
            <strong>Tell me about a project you&apos;re proud of.</strong>
            <div className="dock-signal" aria-hidden="true">
              {Array.from({ length: 42 }, (_, index) => <i key={index} />)}
            </div>
          </div>
          <button className="dock-voice-button" type="button" onClick={onStart} disabled={isStarting} aria-label="Start conversation">
            {error ? <WarningCircle weight="bold" /> : <Waveform weight="bold" />}
          </button>
        </div>
      </div>
    );
  }

  return (
    <LiveKitRoom
      token={connection.participantToken}
      serverUrl={connection.serverUrl}
      connect
      audio
      video={false}
      options={{
        audioCaptureDefaults: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      }}
      onDisconnected={onDisconnected}
      onError={(roomError) => console.error("LiveKit room error", roomError)}
    >
      <ConnectedVoiceStage />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}

function ConnectedVoiceStage() {
  const { state, audioTrack } = useVoiceAssistant();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const rawTranscriptions = useTranscriptions() as Array<{
    id?: string;
    text: string;
    participantInfo?: { identity?: string; name?: string; kind?: number };
  }>;

  const labels: Record<string, { title: string; detail: string }> = {
    disconnected: { title: "Joining the room", detail: "The agent will be here in a moment." },
    connecting: { title: "Connecting", detail: "Opening a secure audio session." },
    initializing: { title: "Getting ready", detail: "Loading Svara's knowledge profile." },
    listening: { title: "I'm listening", detail: "Ask me about my work, decisions, or experience." },
    thinking: { title: "Thinking", detail: "Finding the most relevant answer." },
    speaking: { title: "Speaking", detail: "You can pause the agent with your voice." },
  };
  const current = labels[state] ?? { title: "Conversation active", detail: "Speak naturally when you are ready." };
  const transcripts = rawTranscriptions.filter((item) => item.text.trim()).slice(-4);

  useEffect(() => {
    const timer = window.setInterval(() => setElapsedSeconds((seconds) => seconds + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className={`voice-stage voice-stage-live state-${state}`}>
      <div className="stage-topline">
        <span className="stage-label">Live conversation</span>
        <div className="connection-state is-live"><span /> Connected</div>
      </div>
      <div className="live-visualizer" aria-label={`Agent is ${state}`}>
        <div className="orb-rings" aria-hidden="true"><i /><i /><i /></div>
        <BarVisualizer state={state} trackRef={audioTrack} barCount={7} />
      </div>
      <div className="voice-heading">
        <h2>{current.title}</h2>
        <p>{current.detail}</p>
      </div>

      <div className="voice-session-capsule" aria-label={`Conversation duration ${formatDuration(elapsedSeconds)}`}>
        <TrackToggle source={Track.Source.Microphone} className="capsule-mic" aria-label="Mute or unmute microphone" />
        <time dateTime={`PT${elapsedSeconds}S`}>{formatDuration(elapsedSeconds)}</time>
        <DisconnectButton className="capsule-stop" stopTracks aria-label="End conversation">
          <PhoneDisconnect weight="bold" />
        </DisconnectButton>
      </div>

      <div className="live-transcript" aria-live="polite">
        {transcripts.length === 0 ? (
          <div className="transcript-empty">Your conversation will appear here.</div>
        ) : (
          transcripts.map((item, index) => {
            const identity = item.participantInfo?.identity?.toLowerCase() || "";
            const isAgent = identity.includes("agent") || identity.includes("digital-twin");
            return (
              <div className={`transcript-line ${isAgent ? "from-agent" : "from-user"}`} key={item.id || `${item.text}-${index}`}>
                <small>{isAgent ? "Svara" : "You"}</small>
                <p>{item.text}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function VoiceOrb({ state }: { state: "idle" | "connecting" | "error" }) {
  return (
    <div className={`voice-orb voice-orb-${state}`} aria-hidden="true">
      <div className="orb-rings"><i /><i /><i /></div>
      <div className="orb-core">
        {state === "error" ? <WarningCircle weight="bold" /> : <Microphone weight="bold" />}
      </div>
    </div>
  );
}
