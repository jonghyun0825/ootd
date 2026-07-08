type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="state-block">
      <div className="state-block__title">{title}</div>
      {description && <p>{description}</p>}
    </div>
  );
}
