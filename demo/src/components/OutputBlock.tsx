type OutputBlockProps = {
  label?: string;
  value: string;
};

export function OutputBlock({ label, value }: OutputBlockProps) {
  return (
    <div className="field">
      {label ? <div className="field__caption">{label}</div> : null}
      <div className="output" dir="auto" lang="und">
        {value || '—'}
      </div>
    </div>
  );
}
