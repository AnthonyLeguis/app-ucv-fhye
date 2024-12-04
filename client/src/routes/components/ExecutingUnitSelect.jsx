import { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { ExecutingUnit } from '../../helpers/listFormSheet';

export const ExecutingUnitSelect = ({ handleChange }) => { // Recibe handleChange como prop
    const [categoria, setCategoria] = useState('');
    const [textoFiltro, setTextoFiltro] = useState('');
    const [opcionesFiltradas, setOpcionesFiltradas] = useState([]);
    const [valorSeleccionado, setValorSeleccionado] = useState(''); // Nuevo estado para el valor seleccionado

    useEffect(() => {
        const filtrarOpciones = () => {
            let opciones = ExecutingUnit;

            if (categoria) {
                opciones = opciones.find(cat => cat.value === categoria)?.opciones || [];
            }

            if (textoFiltro) {
                const filtro = textoFiltro.toLowerCase();
                opciones = opciones.filter(opcion => opcion.label.toLowerCase().includes(filtro));
            }

            setOpcionesFiltradas(opciones);
        };

        filtrarOpciones();
    }, [categoria, textoFiltro]);

    useEffect(() => {
        // Llama a handleChange del componente padre con el valor seleccionado
        handleChange('seccionB', 'executingUnit', valorSeleccionado);
    }, [valorSeleccionado]); // Se ejecuta cuando cambia valorSeleccionado o handleChange

    const handleCategoriaChange = (event) => {
        setCategoria(event.target.value);
    };

    const handleTextoFiltroChange = (event) => {
        setTextoFiltro(event.target.value);
    };

    const handleUnidadEjecutoraChange = (event) => {
        setValorSeleccionado(event.target.value); // Actualiza el valor seleccionado
    };


    return (
        <div>
            <Form.Group controlId="categoria" className='my-md-3'>
                <Form.Label>Filtrar por categoría:</Form.Label>
                <Form.Select value={categoria} onChange={handleCategoriaChange}>
                    <option value="">Todas</option>
                    {ExecutingUnit.map(cat => (
                        <option key={cat.value} value={cat.value}>
                            {cat.label}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>

            <Form.Group controlId="textoFiltro" className='my-md-3'>
                <Form.Label>Buscar:</Form.Label>
                <Form.Control type="text" placeholder="Escribe para filtrar..." value={textoFiltro} onChange={handleTextoFiltroChange} />
            </Form.Group>

            <Form.Group controlId="unidadEjecutora" className='my-md-3'>
                <Form.Label>Unidad Ejecutora:</Form.Label>
                <Form.Select value={valorSeleccionado} onChange={handleUnidadEjecutoraChange}> {/* Agrega value y onChange */}
                    {opcionesFiltradas.map(opcion => (
                        <option key={opcion.value} value={opcion.value}>
                            {opcion.label}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>
        </div>
    );
}

export default ExecutingUnitSelect;