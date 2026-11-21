import type {CSSProperties, ReactNode} from 'react';
import {
  AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate,
  staticFile, useCurrentFrame, useVideoConfig, spring,
} from 'remotion';
import '@fontsource-variable/inter';
import {cue, processMove, totalFrames} from './timing';
import './style.css';

const asset = {
  friday: 'media/social/al-halimi/full/01-friday.webp',
  energy: 'media/social/al-halimi/full/02-energy.webp',
  halimiIdentity: 'media/identity/al-halimi/07.webp',
  halimiStore: 'media/identity/al-halimi/09.webp',
  ad: 'media/videos/al-halimi-ad.mp4',
  trust: 'media/social/abu-shuaib/full/01-trust.webp',
  road: 'media/social/abu-shuaib/full/02-road.webp',
  abuIdentity: 'media/identity/abu-shuaib/07.webp',
  shark: 'media/social/oshenz/full/01-shark-fingers.webp',
  geant: 'media/social/oshenz/full/04-geant-store.webp',
};

const ease = Easing.bezier(0.22, 1, 0.36, 1);
const progress = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease,
  });

function Enter({at = 0, distance = 22, children, className, style}: {
  at?: number;
  distance?: number;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entrance = spring({
    frame: frame - at, fps, durationInFrames: 14,
    config: {damping: 27, stiffness: 170, overshootClamping: true},
  });
  return (
    <div className={className} style={{
      ...style, opacity: entrance, translate: `0 ${distance * (1 - entrance)}px`,
    }}>
      {children}
    </div>
  );
}

function Beat({from, to, side = 'right', children}: {
  from: number; to: number; side?: 'left' | 'right'; children: ReactNode;
}) {
  return (
    <Sequence from={from} durationInFrames={to - from} layout="none">
      <BeatPanel side={side} duration={to - from} last={to === totalFrames}>
        {children}
      </BeatPanel>
    </Sequence>
  );
}

function BeatPanel({side, duration, last, children}: {
  side: 'left' | 'right'; duration: number; last: boolean; children: ReactNode;
}) {
  const frame = useCurrentFrame();
  const exit = last ? 0 : progress(frame, duration - 8, duration);
  return (
    <div className={`panel panel--${side}`} style={{opacity: 1 - exit, translate: `0 ${-9 * exit}px`}}>
      {children}
    </div>
  );
}

function Artwork({src, className = ''}: {src: string; className?: string}) {
  return <div className={`artwork ${className}`}><Img src={staticFile(src)} /></div>;
}

function Heading({children}: {children: ReactNode}) {
  return <div className="heading"><span className="rule" /><h1>{children}</h1></div>;
}

function Hook() {
  return (
    <>
      <div className="hook-heading">
        <Enter distance={13}><span className="rule" /><h1>Arabic Posts</h1></Enter>
        <Enter at={cue.hookVideos} distance={17}><h1 className="soft">&amp; Short Videos</h1></Enter>
      </div>
      <div className="hook-art">
        <Enter className="hook-first" at={2} distance={46}><Artwork src={asset.energy} /></Enter>
        <Enter className="hook-second" at={7} distance={55}><Artwork src={asset.shark} /></Enter>
        <div className="hook-line" />
      </div>
    </>
  );
}

function IntroName() {
  return (
    <Enter className="nameplate" distance={24}>
      <Heading>Abdullah<br />Al-Wuhaishi</Heading>
      <div className="subtitle">Social Media Designer</div>
    </Enter>
  );
}

function Social() {
  return (
    <div className="service">
      <Enter className="service-copy"><Heading>Social<br />Media Posts</Heading></Enter>
      <Enter className="social-piece" at={1} distance={38}><Artwork src={asset.friday} /></Enter>
    </div>
  );
}

function ShortAd() {
  return (
    <div className="service">
      <Enter className="service-copy"><Heading>Short<br />Ad Videos</Heading></Enter>
      <Enter className="phone" at={1} distance={38}>
        <OffthreadVideo src={staticFile(asset.ad)} startFrom={60} muted />
      </Enter>
    </div>
  );
}

function Identity() {
  return (
    <Enter className="identity">
      <Heading>Visual Identity</Heading>
      <Artwork src={asset.halimiStore} />
    </Enter>
  );
}

const steps = [
  {label: 'Business', at: cue.business},
  {label: 'Customers', at: cue.customers},
  {label: 'Message', at: cue.message},
];

function Process() {
  const frame = useCurrentFrame();
  const active = steps.reduce((index, step, i) => frame >= step.at - cue.process ? i : index, -1);
  return (
    <div className="process">
      <Enter at={3}><Heading>First, we talk.</Heading></Enter>
      <div className="steps">
        {steps.map((step, i) => (
          <Enter key={step.label} at={step.at - cue.process - 5} className="step-group">
            {i > 0 && <span className={`connector ${i <= active ? 'connector--active' : ''}`} />}
            <div className={`step ${i === active ? 'step--active' : ''}`}>
              <span className="step-dot" /> {step.label}
            </div>
          </Enter>
        ))}
      </div>
    </div>
  );
}

function Content() {
  return (
    <div className="service content">
      <Enter className="service-copy"><Heading>Then I create<br />the content.</Heading></Enter>
      <Enter className="social-piece" distance={36}><Artwork src={asset.road} /></Enter>
    </div>
  );
}

type Project = {
  name: string;
  services: string;
  first: string;
  second: string;
  identity?: string;
};

const projects: Project[] = [
  {name: 'Al-Halimi', services: 'Social Media Design · Visual Identity', first: asset.friday, second: asset.energy, identity: asset.halimiIdentity},
  {name: 'Abu Shuaib', services: 'Social Media Design · Visual Identity', first: asset.trust, second: asset.road, identity: asset.abuIdentity},
  {name: 'OSHENZ', services: 'Social Media Design', first: asset.shark, second: asset.geant},
];

function ProofIntro() {
  return <Enter className="nameplate"><Heading>Selected Work</Heading></Enter>;
}

function Portfolio({project}: {project: Project}) {
  return (
    <div className="portfolio">
      <Enter><Heading>{project.name}</Heading><div className="subtitle">{project.services}</div></Enter>
      <div className={`portfolio-art ${project.identity ? 'portfolio-art--three' : ''}`}>
        <Enter at={0} distance={25}><Artwork src={project.first} /></Enter>
        <Enter at={2} distance={31}><Artwork src={project.second} /></Enter>
        {project.identity && (
          <Enter className="portfolio-identity" at={4} distance={25}>
            <Artwork src={project.identity} />
          </Enter>
        )}
      </div>
    </div>
  );
}

function Offer() {
  return (
    <div className="offer">
      <Enter className="offer-card">
        <span className="offer-icon"><i /></span><span>One Project</span>
      </Enter>
      <Enter at={cue.monthly - cue.offer} className="offer-card offer-card--mist">
        <span className="offer-icon offer-icon--monthly"><i /></span><span>Monthly Content</span>
      </Enter>
    </div>
  );
}

function CallToAction() {
  return (
    <Enter className="cta">
      <Heading>Message Me<br />on Upwork</Heading>
    </Enter>
  );
}

function Stage() {
  const frame = useCurrentFrame();
  const move = progress(frame, processMove, cue.process + 17);
  const proof = progress(frame, cue.portfolio - 4, cue.portfolio + 17);
  const finish = progress(frame, cue.offer, cue.offer + 23);
  const x = 452 + 990 * move + 44 * proof - 60 * finish;
  const height = 1285 - 40 * move - 108 * proof + 64 * finish;
  const top = -42 + 20 * move + 67 * proof - 31 * finish;
  return (
    <>
      <AbsoluteFill className="stage" style={{
        '--light-x': `${x / 19.2}%`,
        '--wash-x': `${74 - 48 * move}%`,
      } as CSSProperties}>
        <div className="stage-grain" />
        <div className="stage-frame" />
      </AbsoluteFill>
      <OffthreadVideo
        src={staticFile('presenter_keyed.webm')}
        transparent
        muted
        style={{
          position: 'absolute', top, left: x - height * 864 / 1536 / 2,
          height, width: height * 864 / 1536,
        }}
      />
    </>
  );
}

export function UpworkIntro() {
  return (
    <AbsoluteFill className="composition">
      <Stage />
      <Beat from={0} to={cue.intro}><Hook /></Beat>
      <Beat from={cue.intro} to={cue.social}><IntroName /></Beat>
      <Beat from={cue.social} to={cue.video}><Social /></Beat>
      <Beat from={cue.video} to={cue.identity}><ShortAd /></Beat>
      <Beat from={cue.identity} to={processMove + 5}><Identity /></Beat>
      <Beat side="left" from={cue.process} to={cue.content}><Process /></Beat>
      <Beat side="left" from={cue.content} to={cue.portfolio}><Content /></Beat>
      <Beat side="left" from={cue.portfolio} to={cue.halimi}><ProofIntro /></Beat>
      <Beat side="left" from={cue.halimi} to={cue.abu}><Portfolio project={projects[0]} /></Beat>
      <Beat side="left" from={cue.abu} to={cue.oshenz}><Portfolio project={projects[1]} /></Beat>
      <Beat side="left" from={cue.oshenz} to={cue.offer}><Portfolio project={projects[2]} /></Beat>
      <Beat side="left" from={cue.offer} to={cue.cta}><Offer /></Beat>
      <Beat side="left" from={cue.cta} to={totalFrames}><CallToAction /></Beat>
      <Audio src={staticFile('presenter_cropped.mp4')} />
    </AbsoluteFill>
  );
}
