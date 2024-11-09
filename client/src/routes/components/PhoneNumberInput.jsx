import React, { useState } from 'react'

function PhoneNumberInput() {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleInputChange = (event) => {
    const formattedPhoneNumber = formatPhoneNumber(event.target.value);
    setPhoneNumber(formattedPhoneNumber);
  };

  return (
    <input
      type="text"
      value={phoneNumber}
      onChange={handleInputChange}
      placeholder="Ingrese su teléfono"
      className="form-control form-control-sm"
      id="phone" name="phone"
      autoComplete='on'
    />
  );
}

function formatPhoneNumber(value) {
  // Elimina todos los caracteres no numéricos
  const cleanedValue = value.replace(/\D/g, '');

  // Verifica la longitud del número de teléfono
  if (cleanedValue.length <= 3) {
    return cleanedValue;
  } else if (cleanedValue.length <= 7) {
    return cleanedValue.slice(0, 3) + '-' + cleanedValue.slice(3);
  } else {
    return cleanedValue.slice(0, 3) + '-' + cleanedValue.slice(3, 6) + '-' + cleanedValue.slice(6);
  }
}

export default PhoneNumberInput;
