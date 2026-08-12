type OutputBlockProps = {
  label?: string;
  value: string;
};

export function OutputBlock({ label, value }: OutputBlockProps) {
  return (
    <div className="field">
      {label ? <label>{label}</label> : null}
      <div className="output" dir="auto">
        {value || '—'}
      </div>
    </div>
  );
}
