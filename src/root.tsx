import {Composition} from 'remotion';
import {UpworkIntro} from './intro';
import {fps, totalFrames} from './timing';

export const Root = () => (
  <Composition
    id="UpworkIntro"
    component={UpworkIntro}
    width={1920}
    height={1080}
    fps={fps}
    durationInFrames={totalFrames}
  />
);
