import React from 'react';
import { Button, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { useSheetsRegister } from '../../hooks/useSheetsRegister';
import { useNotification } from '../components/Notifications';
import '../../CSS/SheetsForm.css';

export const SheetsForm = () => {
  const { formData, handleChange, handleSubmit, findEmployees } = useSheetsRegister();
  const { showNotification } = useNotification();

  const handleNationalIdChange = (e) => {
    const { value } = e.target;
    handleChange('seccionC', 'nationalId', value);
  };

  const handleSearchClick = () => {
    if (formData.seccionC.nationalId.length > 0) {
      findEmployees({ nationalId: formData.seccionC.nationalId });
    } else {
      showNotification('Por favor, ingrese una cédula', 'warning');
    }
  };

  const handleEmployeeSelect = (employee) => {
    handleChange('seccionC', 'employee', employee);
    handleChange('seccionC', 'nationalId', employee.nationalId);
  };

  return (
    <>
      <div className='container-fluid contain overflow-auto mt-4 h-100'>
        <Row className='sm-flex-column'>
          <h1 className="TitleNameSheetsForm text-center text-center m-0">Formulario de planilla</h1>
        </Row>

        <Form onSubmit={handleSubmit}>
          {/* Sección para buscar al empleado */}
          <Row>
            <Col md={8}>
              <Form.Group controlId="nationalId">
                <Form.Label>Cédula:</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    value={formData.seccionC.nationalId}
                    onChange={handleNationalIdChange}
                  />
                  <Button variant="outline-secondary" onClick={handleSearchClick}>
                    <i className="bi bi-search"></i>
                  </Button>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          {formData.seccionC.employee && (
            <Row>
              <Col>
                <div className="employee-details mb-3">
                  <p>Nombre: {formData.seccionC.employee.names} {formData.seccionC.employee.surnames}</p>
                  {/* Otros datos del empleado */}
                </div>
              </Col>
            </Row>
          )}
          {/* Sección A */}
          <Row className="my-3">
            <Col>
              <h2>Sección A</h2>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <Form.Group controlId="sheetNumber">
                <Form.Label>Número de Planilla:</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.seccionA.sheetNumber}
                  onChange={e => handleChange('seccionA', 'sheetNumber', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="area">
                <Form.Label>Área:</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.seccionA.area}
                  onChange={e => handleChange('seccionA', 'area', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="introducedDate">
                <Form.Label>Fecha de Introducción:</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.seccionA.introducedDate}
                  onChange={e => handleChange('seccionA', 'introducedDate', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <Form.Group controlId="sentDate">
                <Form.Label>Fecha de Envío:</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.seccionA.sentDate}
                  onChange={e => handleChange('seccionA', 'sentDate', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={8}>
              <Form.Group controlId="observations_general">
                <Form.Label>Observaciones Generales:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.seccionA.observations_general}
                  onChange={e => handleChange('seccionA', 'observations_general', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Sección B */}
          <Row className="my-3">
            <Col>
              <h2>Sección B</h2>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group controlId="facultyOrDependency">
                <Form.Label>Facultad o Dependencia:</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.seccionB.facultyOrDependency}
                  onChange={e => handleChange('seccionB', 'facultyOrDependency', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="executingUnit">
                <Form.Label>Unidad Ejecutora:</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.seccionB.executingUnit}
                  onChange={e => handleChange('seccionB', 'executingUnit', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <Form.Group controlId="entryDate">
                <Form.Label>Fecha de Ingreso:</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.seccionB.entryDate}
                  onChange={e => handleChange('seccionB', 'entryDate', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="effectiveDate">
                <Form.Label>Fecha Efectiva:</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.seccionB.effectiveDate}
                  onChange={e => handleChange('seccionB', 'effectiveDate', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="contractEndDate">
                <Form.Label>Fecha Fin de Contrato:</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.seccionB.contractEndDate}
                  onChange={e => handleChange('seccionB', 'contractEndDate', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          {/* ... otros campos de la sección B ... */}

          {/* Sección C Modificaciones realizadas en la planilla */}
          <Row className="my-3">
            <Col>
              <h2>Sección C</h2>
            </Col>
          </Row>
          <Row>
              {/* COL para Nombres de la Persona de la busqueda */}
              {/* COL para Apellidos de la Persona de la busqueda */}
          </Row>
          <Row>
              {/* COL para idType - nationalId de la Persona de la busqueda */}
              {/* COL para Fecha de Reconocimiento */}
          </Row>
          <Row>
              {/* COL para area (agregar 0) y tomar solo el primer caracter del codigo de esa area (luego incluir el - Y el resto del valor del area) */}
              {/* COL para Unidad Ejecutora */}
          </Row>
          <Row>
              {/* COL para idType - nationalId de la Persona de la busqueda */}
              {/* COL para Fecha de Reconocimiento */}
          </Row>
          <Button variant="primary" type="submit">
            Crear Planilla
          </Button>
        </Form>
      </div>
    </>
  );
};
