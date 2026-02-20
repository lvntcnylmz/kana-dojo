'use client';
import clsx from 'clsx';
import usePreferencesStore from '@/features/Preferences/store/usePreferencesStore';
import { buttonBorderStyles } from '@/shared/lib/styles';
import { CURSOR_TRAIL_EFFECTS, CLICK_EFFECTS } from '../data/effectsData';
import CollapsibleSection from './CollapsibleSection';
import { MousePointer2, Zap } from 'lucide-react';

const CLICK_EFFECT_MANUAL_ORDER = [
  'none',
  'firework',
  'sakura',
  'torii',
  'festival',
  'wave',
  'dango',
  'lantern',
  'fan',
  'fish',
  'sparkle',
  'lotus',
  'maple',
  'tea',
  'blossom',
  'wind',
  'star',
  'bamboo',
  'butterfly',
  'snowflake',
  'fuji',
  'rice',
  'sushi',
  'ramen',
  'castle',
  'carp',
  'kitsune',
  'chopsticks',
] as const;

const clickEffectById = new Map(CLICK_EFFECTS.map(effect => [effect.id, effect]));
const ORDERED_CLICK_EFFECTS = CLICK_EFFECT_MANUAL_ORDER.map(
  id => clickEffectById.get(id)!,
);

const EMOJI_RAIN_POSITIONS = [
  { top: '-18%', left: '6%', size: 'text-xl', opacity: 'opacity-75' },
  { top: '-18%', left: '38%', size: 'text-xl', opacity: 'opacity-75' },
  { top: '-18%', left: '70%', size: 'text-xl', opacity: 'opacity-75' },
  { top: '6%', left: '-10%', size: 'text-xl', opacity: 'opacity-75' },
  { top: '6%', left: '22%', size: 'text-xl', opacity: 'opacity-75' },
  { top: '6%', left: '54%', size: 'text-xl', opacity: 'opacity-75' },
  { top: '6%', left: '86%', size: 'text-xl', opacity: 'opacity-75' },
  { top: '30%', left: '6%', size: 'text-xl', opacity: 'opacity-75' },
  { top: '30%', left: '38%', size: 'text-xl', opacity: 'opacity-75' },
  { top: '30%', left: '70%', size: 'text-xl', opacity: 'opacity-75' },
  { top: '54%', left: '-10%', size: 'text-xl', opacity: 'opacity-75' },
  { top: '54%', left: '22%', size: 'text-xl', opacity: 'opacity-75' },
  { top: '54%', left: '54%', size: 'text-xl', opacity: 'opacity-75' },
  { top: '54%', left: '86%', size: 'text-xl', opacity: 'opacity-75' },
  { top: '78%', left: '6%', size: 'text-xl', opacity: 'opacity-75' },
  { top: '78%', left: '38%', size: 'text-xl', opacity: 'opacity-75' },
  { top: '78%', left: '70%', size: 'text-xl', opacity: 'opacity-75' },
  { top: '102%', left: '-10%', size: 'text-xl', opacity: 'opacity-75' },
  { top: '102%', left: '22%', size: 'text-xl', opacity: 'opacity-75' },
  { top: '102%', left: '54%', size: 'text-xl', opacity: 'opacity-75' },
  { top: '102%', left: '86%', size: 'text-xl', opacity: 'opacity-75' },
] as const;

function EffectCard({
  id,
  name,
  emoji,
  isSelected,
  onSelect,
  group,
}: {
  id: string;
  name: string;
  emoji: string;
  isSelected: boolean;
  onSelect: () => void;
  group: 'cursor-trail' | 'click';
}) {
  const rainEmoji = emoji || '*';
  const isNoneCard = id === 'none';

  return (
    <label
      className={clsx(
        isNoneCard
          ? 'flex h-20 flex-col items-center justify-center gap-1'
          : 'relative h-20 overflow-hidden',
        buttonBorderStyles,
        'border-1 border-(--card-color)',
        'cursor-pointer px-2 py-2.5',
      )}
      style={{
        outline: isSelected ? '3px solid var(--secondary-color)' : 'none',
        transition: 'background-color 275ms',
      }}
    >
      <input
        type='radio'
        name={`effect-${group}`}
        className='hidden'
        onChange={onSelect}
        checked={isSelected}
        aria-label={name}
      />
      {isNoneCard ? (
        <>
          <span className='text-base leading-none text-(--secondary-color)'>
            -
          </span>
          <span className='text-center text-xs leading-tight'>{name}</span>
        </>
      ) : (
        EMOJI_RAIN_POSITIONS.map((p, i) => (
          <span
            key={`${group}-${name}-${i}`}
            className={clsx(
              'pointer-events-none absolute leading-none select-none',
              p.size,
              p.opacity,
            )}
            style={{ top: p.top, left: p.left }}
            aria-hidden='true'
          >
            {rainEmoji}
          </span>
        ))
      )}
    </label>
  );
}

const Effects = () => {
  const cursorTrailEffect = usePreferencesStore(s => s.cursorTrailEffect);
  const setCursorTrailEffect = usePreferencesStore(s => s.setCursorTrailEffect);
  const clickEffect = usePreferencesStore(s => s.clickEffect);
  const setClickEffect = usePreferencesStore(s => s.setClickEffect);

  return (
    <div className='flex flex-col gap-6'>
      <CollapsibleSection
        title={
          <span className='flex items-center gap-2'>
            Cursor Trail
            <span className='rounded-md bg-(--card-color) px-1.5 py-0.5 text-xs text-(--secondary-color)'>
              desktop only
            </span>
          </span>
        }
        icon={<MousePointer2 size={18} />}
        level='subsubsection'
        defaultOpen={true}
        storageKey='prefs-effects-cursor'
      >
        <fieldset className='grid grid-cols-5 gap-3 p-1 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8'>
          {CURSOR_TRAIL_EFFECTS.map(effect => (
            <EffectCard
              key={effect.id}
              id={effect.id}
              name={effect.name}
              emoji={effect.emoji}
              isSelected={cursorTrailEffect === effect.id}
              onSelect={() => setCursorTrailEffect(effect.id)}
              group='cursor-trail'
            />
          ))}
        </fieldset>
      </CollapsibleSection>

      <CollapsibleSection
        title='Click Effects'
        icon={<Zap size={18} />}
        level='subsubsection'
        defaultOpen={true}
        storageKey='prefs-effects-click'
      >
        <fieldset className='grid grid-cols-5 gap-3 p-1 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8'>
          {ORDERED_CLICK_EFFECTS.map(effect => (
            <EffectCard
              key={effect.id}
              id={effect.id}
              name={effect.name}
              emoji={effect.emoji}
              isSelected={clickEffect === effect.id}
              onSelect={() => setClickEffect(effect.id)}
              group='click'
            />
          ))}
        </fieldset>
      </CollapsibleSection>
    </div>
  );
};

export default Effects;
