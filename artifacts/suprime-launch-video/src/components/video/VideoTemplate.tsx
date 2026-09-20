import {
  VideoCanvas,
  type VideoAspectRatio,
  VideoPausedContext,
  useVideoPlayer,
} from '@/lib/video';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';
import { Scene6 } from './video_scenes/Scene6';

export const SCENE_DURATIONS = {
  intro: 4200,
  categories: 3800,
  discovery: 4500,
  shopping: 4200,
  curation: 4200,
  close: 5000,
};

const VIDEO_ASPECT_RATIO: VideoAspectRatio = '9:16';

const SCENE_COMPONENTS = {
  intro: Scene1,
  categories: Scene2,
  discovery: Scene3,
  shopping: Scene4,
  curation: Scene5,
  close: Scene6,
} as const;

interface VideoTemplateProps {
  durations?: Record<string, number>;
  loop?: boolean;
  paused?: boolean;
  onSceneChange?: (sceneKey: string) => void;
}

export default function VideoTemplate({
  durations = SCENE_DURATIONS,
  loop = true,
  paused = false,
  onSceneChange,
}: VideoTemplateProps = {}) {
  const { currentScene, currentSceneKey } = useVideoPlayer({
    durations,
    loop,
    paused,
  });
  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, '') as keyof typeof SCENE_COMPONENTS;
  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  return (
    <VideoPausedContext.Provider value={paused}>
      <VideoCanvas
        aspectRatio={VIDEO_ASPECT_RATIO}
        className="video-root"
        style={{ backgroundColor: 'var(--color-bg-light)' }}
      >
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute -left-[18%] top-[10%] h-[42vw] w-[42vw] rounded-full bg-[#e3b550]/30 blur-3xl float-slow" />
          <div className="absolute -right-[16%] bottom-[12%] h-[48vw] w-[48vw] rounded-full bg-[#c95745]/15 blur-3xl float-slower" />
          <div className="absolute left-[9%] top-[7%] h-[78%] w-px bg-[#252329]/10" />
          <div className="absolute right-[9%] top-[7%] h-[78%] w-px bg-[#252329]/10" />
        </div>
        <header className="pointer-events-none absolute left-[9%] right-[9%] top-[6.5%] z-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#c95745]" />
            <span className="body-font text-[2.1vw] font-extrabold tracking-[.18em] text-[#252329]">SUPRIME</span>
          </div>
          <span className="body-font text-[1.7vw] font-semibold tracking-[.18em] text-[#6c625c]">01 / 06</span>
        </header>
        <AnimatePresence mode="sync" initial={false}>
          {SceneComponent && <SceneComponent key={currentSceneKey} />}
        </AnimatePresence>
      </VideoCanvas>
    </VideoPausedContext.Provider>
  );
}
