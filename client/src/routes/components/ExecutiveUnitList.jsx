import React, { useMemo, useState } from 'react'

export const ExecutiveUnitList = () => {

    const [selectedSchool, setSelectedSchool] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('');
    const [unitOptions, setUnitOptions] = useState([]);

    const codePerDependencies = {
        '0700000000': { // Facultad de Humanidad y Educación
            nombre: 'Facultad de Humanidad y Educación',
            subdependencies: {
                '0712000000': { // Escuela de Educación
                    nombre: 'Escuela de Educación',
                    unidades: ['0712110110', '0712110210', '0712110310', '0712110410', '0712120110', '0712120210', '0712120310', '0712120410'],
                },
                '0713000000': { // Escuela de Idiomas Modernos
                    nombre: 'Escuela de Idiomas Modernos',
                    unidades: ['0713110110', '0713110210', '0713110310', '0713110410', '0713110510', '0713120110', '0713120210', '0713120310'],
                },
                '0714000000': { // Escuela de Filosofía
                    nombre: 'Escuela de Filosofía',
                    unidades: ['0714110110', '0714110210', '0714110310', '0714110410', '0714120110', '0714120210'],
                },
                '0715000000': { // Escuela de Artes
                    nombre: 'Escuela de Artes',
                    unidades: ['0715110110', '0715110210', '0715110310', '0715110410', '0715120110', '0715120210', '0715120310'],
                },
                '0716000000': { // Escuela de Historia
                    nombre: 'Escuela de Historia',
                    unidades: ['0716110110', '0716110210', '0716110310', '0716110410', '0716120110', '0716120210', '0716120310'],
                },
                '0717000000': { // Escuela de Letras
                    nombre: 'Escuela de Letras',
                    unidades: ['0717110110', '0717110210', '0717110310', '0717110410', '0717120110', '0717120210'],
                },
                '0718000000': { // Escuela de Geografía
                    nombre: 'Escuela de Geografía',
                    unidades: ['0718110110', '0718110210', '0718110310', '0718110410'],
                },
                '0719000000': { // Escuela de Antropología
                    nombre: 'Escuela de Antropología',
                    unidades: ['0719110110', '0719110210', '0719110310', '0719110410'],
                },
                '0721000000': { // Escuela de Psicología
                    nombre: 'Escuela de Psicología',
                    unidades: ['0721110110', '0721110210', '0721110310', '0721110410'],
                },
                '0722000000': { // Escuela de Sociología
                    nombre: 'Escuela de Sociología',
                    unidades: ['0722110110', '0722110210', '0722110310', '0722110410'],
                },
            },
        },
    }

    const handleSchoolChange = (event) => {
        const schoolCode = event.target.value;
        setSelectedSchool(schoolCode);
        setSelectedUnit('');

        // Actualizar las opciones de unidades cuando se cambia la escuela
        const newUnitOptions =
            schoolCode && codePerDependencies['0700000000'].subdependencies[schoolCode]
                ? codePerDependencies['0700000000'].subdependencies[schoolCode].unidades.map((code) => (
                    <option key={code} value={code}>{code}</option>
                ))
                : [];

        setUnitOptions(newUnitOptions);
    };

    const handleUnitsChange = (event) => {
        setSelectedUnit(event.target.value);
    };

    return (
        <>
            <div>
                <select value={selectedSchool} onChange={handleSchoolChange}>
                    <option value="">Selecciona una Escuela</option>
                    {Object.keys(codePerDependencies['0700000000'].subdependencies).map((code) => (
                        <option key={code} value={code}>
                            {codePerDependencies['0700000000'].subdependencies[code].nombre}
                        </option>
                    ))}
                </select>

                {selectedSchool && unitOptions.length > 0 && (
                    <select value={selectedUnit} onChange={handleUnitsChange}>
                        <option value="">Selecciona una Unidad</option>
                        {unitOptions}
                    </select>
                )}
            </div>
        </>
    );

};