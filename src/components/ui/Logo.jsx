import { Link } from 'react-router-dom';
import nachiketaLogo from '@/assets/nachiketa-logo.jpeg';

const SIZE_MAP = {
  sm: {
    img: 'w-8 h-8',
    text: 'text-lg',
  },
  md: {
    img: 'w-9 h-9',
    text: 'text-xl',
  },
  lg: {
    img: 'w-10 h-10',
    text: 'text-xl',
  },
  xl: {
    img: 'w-12 h-12',
    text: 'text-2xl',
  },
};

export default function Logo({
  size = 'md',
  showText = true,
  coloredText = true,
  subtext = null,
  to = null,
  className = '',
  imgClassName = '',
  textClassName = '',
  imageOnly = false,
}) {
  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.md;

  const imageElement = (
    <img
      src={nachiketaLogo}
      alt="Nachiketa Logo"
      className={`object-contain rounded-full flex-shrink-0 ${sizeConfig.img} ${imgClassName}`}
    />
  );

  if (imageOnly) {
    return imageElement;
  }

  const content = (
    <>
      {imageElement}
      {showText && (
        <div>
          <span className={`font-bold tracking-tight text-text-primary ${sizeConfig.text} ${textClassName}`}>
            {coloredText ? (
              <>
                Nach<span className="text-indigo-500">iketa</span>
              </>
            ) : (
              'Nachiketa'
            )}
          </span>
          {subtext && (
            <p className="text-2xs text-text-muted -mt-0.5">{subtext}</p>
          )}
        </div>
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`inline-flex items-center gap-2.5 ${className}`}>
        {content}
      </Link>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {content}
    </div>
  );
}
