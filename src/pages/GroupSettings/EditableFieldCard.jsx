import { SettingsCard, CardLabel, Row, IconButton, EditableInput } from './shared';
import { EditIcon } from './icons';

function EditableFieldCard({
  label,
  value,
  onChange,
  placeholder,
  required,
  inputRef,
  ariaLabel,
}) {
  return (
    <SettingsCard>
      <CardLabel>{label}</CardLabel>
      <Row>
        <EditableInput
          ref={inputRef}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
        />
        <IconButton
          type="button"
          aria-label={ariaLabel}
          onClick={() => inputRef.current?.focus()}
        >
          <EditIcon />
        </IconButton>
      </Row>
    </SettingsCard>
  );
}

export default EditableFieldCard;
