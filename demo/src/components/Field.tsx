import {
  cloneElement,
  isValidElement,
  useId,
  type ReactElement,
  type ReactNode,
} from 'react';

type FieldProps = {
  label: string;
  children: ReactNode;
};

type ControlProps = {
  id?: string;
};

export function Field({ label, children }: FieldProps) {
  const generatedId = useId();
  const child = isValidElement(children)
    ? (children as ReactElement<ControlProps>)
    : null;
  const controlId = child?.props.id ?? generatedId;

  return (
    <div className="field">
      <label htmlFor={controlId}>{label}</label>
      {child ? cloneElement(child, { id: controlId }) : children}
    </div>
  );
}
