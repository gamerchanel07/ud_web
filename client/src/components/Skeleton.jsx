import React from 'react';

/**
 * Skeleton Loader Components for loading states
 */

export const SkeletonText = ({ width = '100%', height = '1rem', className = '' }) => (
  <div
    className={`skeleton ${className}`}
    style={{
      width,
      height,
      borderRadius: 'var(--radius-md)',
      backgroundColor: 'rgba(0, 173, 181, 0.1)',
      animation: 'skeleton-loading 1.5s infinite'
    }}
  />
);

export const SkeletonAvatar = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    sm: '2rem',
    md: '3rem',
    lg: '4rem',
    xl: '5rem'
  };

  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'rgba(0, 173, 181, 0.1)',
        animation: 'skeleton-loading 1.5s infinite'
      }}
    />
  );
};

export const SkeletonCard = ({ className = '' }) => (
  <div
    className={`card ${className}`}
    style={{
      backgroundColor: 'var(--bg-secondary)',
      overflow: 'hidden'
    }}
  >
    {/* Image */}
    <div
      style={{
        width: '100%',
        height: '12rem',
        backgroundColor: 'rgba(0, 173, 181, 0.1)',
        animation: 'skeleton-loading 1.5s infinite'
      }}
    />
    
    {/* Content */}
    <div style={{ padding: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
      <SkeletonText width="80%" height="1.5rem" />
      <SkeletonText width="100%" height="1rem" />
      <SkeletonText width="60%" height="1.25rem" />
      <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-md)' }}>
        <SkeletonText width="48%" height="2.5rem" />
        <SkeletonText width="48%" height="2.5rem" />
      </div>
    </div>
  </div>
);

export const SkeletonLine = ({ width = '100%', className = '' }) => (
  <SkeletonText width={width} height="0.875rem" className={className} />
);

export const SkeletonBox = ({ width = '100%', height = '100px', className = '' }) => (
  <div
    className={`skeleton ${className}`}
    style={{
      width,
      height,
      borderRadius: 'var(--radius-lg)',
      backgroundColor: 'rgba(0, 173, 181, 0.1)',
      animation: 'skeleton-loading 1.5s infinite'
    }}
  />
);

export const SkeletonGrid = ({ columns = 3, count = 6, className = '' }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fill, minmax(250px, 1fr))`,
      gap: 'var(--spacing-lg)',
      width: '100%'
    }}
    className={className}
  >
    {Array.from({ length: count }).map((_, idx) => (
      <SkeletonCard key={idx} />
    ))}
  </div>
);

export const SkeletonStats = ({ count = 4, className = '' }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))`,
      gap: 'var(--spacing-md)',
      width: '100%'
    }}
    className={className}
  >
    {Array.from({ length: count }).map((_, idx) => (
      <div key={idx} className="card">
        <div style={{ padding: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
          <SkeletonText width="60%" height="1rem" />
          <SkeletonText width="80%" height="2rem" />
          <SkeletonText width="50%" height="0.875rem" />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonList = ({ count = 3, className = '' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', width: '100%' }} className={className}>
    {Array.from({ length: count }).map((_, idx) => (
      <div key={idx} className="card" style={{ padding: 'var(--spacing-md)' }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'flex-start' }}>
          <SkeletonAvatar size="md" />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            <SkeletonText width="40%" height="1rem" />
            <SkeletonText width="100%" height="1rem" />
            <SkeletonText width="80%" height="1rem" />
          </div>
        </div>
      </div>
    ))}
  </div>
);
