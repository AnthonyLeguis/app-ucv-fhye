import React from 'react';
import { Button, Form, Row, Col, InputGroup, Spinner } from 'react-bootstrap';
import { useSheetsRegister } from '../../hooks/useSheetsRegister';
import { useNotification } from '../components/Notifications';
import { movimentType } from '../../helpers/listFormSheet';
import ExecutingUnitSelect from './ExecutingUnitSelect';
import '../../CSS/SheetsForm.css';

export const SheetsForm = () => {
  const { formData, handleChange, handleSubmit, findEmployee, loading } = useSheetsRegister();
  const { showNotification } = useNotification();

  const handleNationalIdChange = (e) => {
    const { value } = e.target;
    handleChange('seccionC', 'nationalId', value);
  };

  const handleSearchClick = () => {
    if (formData.seccionC.nationalId.length > 0) {
      findEmployee(formData.seccionC.nationalId);
    } else {
      showNotification('Por favor, ingrese una cédula', 'warning');
    }
  };

  return (
    <>
      <div className='container-fluid contain overflow-auto mt-4 h-100'>
        <Row className='col-11 col-md-8 mx-auto'>
          <h1 className="TitleNameSheetsForm text-center">Formulario de planilla</h1>
        </Row>

        <Form onSubmit={handleSubmit} className="col-11 col-md-10 mx-auto p-2 shadow rounded-4 mb-4">
          {/* Sección para buscar al empleado */}
          <Row className="my-3 d-flex justify-content-center ">
            <Col md={6}>
              <Form.Group controlId="nationalId">
                <Form.Label>Ingrese la Cédula:</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese la cédula del empleado para crear la planilla"
                    value={formData.seccionC.nationalId}
                    onChange={handleNationalIdChange}
                    disabled={loading}
                  />
                  <Button variant="outline-secondary" onClick={handleSearchClick} disabled={loading}>
                    {loading ? <Spinner as="span" animation="border" size="sm" /> : <i className="bi bi-search"></i>}
                  </Button>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          {/* Sección Información General */}
          <Row className="my-3">
            <Col>
              <h2>Información General</h2>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <Form.Group controlId="sheetNumber">
                <Form.Label>Número de Planilla:</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.seccionGeneralInformation.sheetNumber}
                  onChange={e => handleChange('seccionGeneralInformation', 'sheetNumber', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="movementType">
                <Form.Label>Tipo de Movimiento:</Form.Label>
                <Form.Select
                  value={formData.seccionGeneralInformation.movementType}
                  onChange={e => handleChange('seccionGeneralInformation', 'movementType', e.target.value)}
                >
                  {movimentType.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="ubication">
                <Form.Label>Ubicación:</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.seccionGeneralInformation.ubication}
                  onChange={e => handleChange('seccionGeneralInformation', 'ubication', e.target.value)}
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
            <Col md={4}>
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

          {/* Sección A (Información Del empleado encontrado)*/}
          <Row className="my-3">
            <Col>
              <h2>Sección A</h2>
            </Col>

            {formData.seccionC.employee && (
              <Row>
                <Col md={4} className="my-md-2">
                  <div className="employee-details d-flex flex-column align-items-start">
                    <p className='fw-bolder'>Cédula:</p>
                    <p>{formData.seccionC.employee.rif}</p>
                  </div>
                </Col>
                <Col md={4} className="my-md-2">
                  <div className="employee-details d-flex flex-column align-items-start">
                    <p className='fw-bolder'>Nombre:</p>
                    <p>{formData.seccionC.employee.names}</p>
                  </div>
                </Col>
                <Col md={4} className="my-md-2">
                  <div className="employee-details d-flex flex-column align-items-start">
                    <p className='fw-bolder'>Apellidos:</p>
                    <p>{formData.seccionC.employee.surnames}</p>
                  </div>
                </Col>
                <Col md={4} className="my-md-2">
                  <div className="employee-details d-flex flex-column align-items-start">
                    <p className='fw-bolder'>Fecha de Nacimiento:</p>
                    <p>{new Date(formData.seccionC.employee.birthdate).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                  </div>
                </Col>
                <Col md={4} className="my-md-2">
                  <div className="employee-details d-flex flex-column align-items-start">
                    <p className='fw-bolder'>País de Origen:</p>
                    <p>{formData.seccionC.employee.countryOfBirth}</p>
                  </div>
                </Col>
                <Col md={4} className="my-md-2">
                  <div className="employee-details d-flex flex-column align-items-start">
                    <p className='fw-bolder'>Edo. Civil:</p>
                    <p>{formData.seccionC.employee.cityOfBirth}</p>
                  </div>
                </Col>
                <Col md={4} className="my-md-2">
                  <div className="employee-details d-flex flex-column align-items-start">
                    <p className='fw-bolder'>Sexo:</p>
                    <p>{formData.seccionC.employee.gender}</p>
                  </div>
                </Col>
                <Col md={4} className="my-md-2">
                  <div className="employee-details d-flex flex-column align-items-start">
                    <p className='fw-bolder'>Carga Familiar:</p>
                    <p>{formData.seccionC.employee.familyDependents}</p>
                  </div>
                </Col>
                <Col md={4} className="my-md-2">
                  <div className="employee-details d-flex flex-column align-items-start">
                    <p className='fw-bolder'>Grado de Instrucción:</p>
                    <p>{formData.seccionC.employee.educationLevel}</p>
                  </div>
                </Col>
                <Col md={4} className="my-md-2">
                  <div className="employee-details d-flex flex-column align-items-start">
                    <p className='fw-bolder'>Email:</p>
                    <p>{formData.seccionC.employee.email}</p>
                  </div>
                </Col>
                <Col md={4} className="my-md-2">
                  <div className="employee-details d-flex flex-column align-items-start">
                    <p className='fw-bolder'>Teléfono:</p>
                    <p>{formData.seccionC.employee.phoneNumber}</p>
                  </div>
                </Col>
                <Col md={4} className="my-md-2">
                  <div className="employee-details d-flex flex-column align-items-start">
                    <p className='fw-bolder'>Banco: </p>
                    <p>{formData.seccionC.employee.bank}</p>
                  </div>
                </Col>
                <Col md={4} className="my-md-2">
                  <div className="employee-details d-flex flex-column align-items-start">
                    <p className='fw-bolder'>Cuenta Nómina: </p>
                    <p>{formData.seccionC.employee.payrollAccount}</p>
                  </div>
                </Col>
                <Col md={8} className="my-md-2">
                  <div className="employee-details d-flex flex-column align-items-start">
                    <p className='fw-bolder'>Dirección de Habitación: </p>
                    <p>{formData.seccionC.employee.address}</p>
                  </div>
                </Col>
              </Row>
            )}
          </Row>

          {/* Sección B */}
          <Row className="my-3">
            <Col>
              <h2>Sección B</h2>
            </Col>
          </Row>
          <Row>
            <Col md={12} className='my-md-2'>
              <ExecutingUnitSelect handleChange={handleChange}></ExecutingUnitSelect>
            </Col>
            <Col md={6}>
              <Form.Group controlId="facultyOrDependency">
                <Form.Label>Facultad o Dependencia:</Form.Label>
                <Form.Control
                  type="text"
                  value="07 - FACULTAD DE HUMANIDADES Y EDUCACIÓN"
                  disabled
                  onChange={e => handleChange('seccionB', 'facultyOrDependency', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="my-md-2">
              <Form.Group controlId="entryDate">
                <Form.Label>Fecha de Ingreso:</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.seccionB.entryDate}
                  onChange={e => handleChange('seccionB', 'entryDate', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4} className="my-md-2">
              <Form.Group controlId="effectiveDate">
                <Form.Label>Fecha Efectiva:</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.seccionB.effectiveDate}
                  onChange={e => handleChange('seccionB', 'effectiveDate', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4} className="my-md-2">
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
          <Row>
            <Col md={6} className="my-md-2">
              <Form.Group controlId="dedication">
                <Form.Label>Dedicación:</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.seccionB.dedication}
                  onChange={e => handleChange('seccionB', 'dedication', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6} className="my-md-2">
              <Form.Group controlId="teachingCategory">
                <Form.Label>Categoría Docente:</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.seccionB.teachingCategory}
                  onChange={e => handleChange('seccionB', 'teachingCategory', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6} className="my-md-2">
              <Form.Group controlId="position">
                <Form.Label>Cargo:</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.seccionB.position}
                  onChange={e => handleChange('seccionB', 'position', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6} className="my-md-2">
              <Form.Group controlId="currentPosition">
                <Form.Label>Cargo Actual:</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.seccionB.currentPosition}
                  onChange={e => handleChange('seccionB', 'currentPosition', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6} className="my-md-2">
              <Form.Group controlId="grade">
                <Form.Label>Grado:</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.seccionB.grade}
                  onChange={e => handleChange('seccionB', 'grade', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6} className="my-md-2">
              <Form.Group controlId="opsuTable">
                <Form.Label>Tabla OPSU:</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.seccionB.opsuTable}
                  onChange={e => handleChange('seccionB', 'opsuTable', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6} className="my-md-2">
              <Form.Group controlId="personnelType">
                <Form.Label>Tipo de Personal:</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.seccionB.personnelType}
                  onChange={e => handleChange('seccionB', 'personnelType', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6} className="my-md-2">
              <Form.Group controlId="workingDay">
                <Form.Label>Jornada:</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.seccionB.workingDay}
                  onChange={e => handleChange('seccionB', 'workingDay', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6} className="my-md-2">
              <Form.Group controlId="typeContract">
                <Form.Label>Tipo de Contrato:</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.seccionB.typeContract}
                  onChange={e => handleChange('seccionB', 'typeContract', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6} className="my-md-2">
              <Form.Group controlId="valueSalary">
                <Form.Label>Salario Valor:</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.seccionB.valueSalary}
                  onChange={e => handleChange('seccionB', 'valueSalary', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6} className="my-md-2">
              <Form.Group controlId="mounthlySalary">
                <Form.Label>Salario Mensual:</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.seccionB.mounthlySalary}
                  onChange={e => handleChange('seccionB', 'mounthlySalary', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6} className="my-md-2">
              <Form.Group controlId="ReasonForMovement">
                <Form.Label>Razón del Movimiento:</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.seccionB.ReasonForMovement}
                  onChange={e => handleChange('seccionB', 'ReasonForMovement', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Sección C */}
          <Row className="my-3">
            <Col>
              <h2>Sección C</h2>
            </Col>
          </Row>
          <Row>
            <Col md={6} className='mx-auto'>
              <Form.Group controlId="recognitionDate">
                <Form.Label>Fecha de Reconocimiento:</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.seccionC.recognitionDate}
                  onChange={e => handleChange('seccionC', 'recognitionDate', e.target.value)}
                />
              </Form.Group>
            </Col>
            {/* Añadir más campos para la sección C si es necesario */}
          </Row>

          {/* Sección D */}
          <Row className="my-3">
            <Col>
              <h2>Sección D</h2>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group controlId="salaryCompensationDiff">
                <Form.Label>Diferencia de Compensación Salarial:</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.seccionD.salaryCompensationDiff}
                  onChange={e => handleChange('seccionD', 'salaryCompensationDiff', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="representationExpenses">
                <Form.Label>Gastos de Representación:</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.seccionD.representationExpenses}
                  onChange={e => handleChange('seccionD', 'representationExpenses', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group controlId="typePrimaA">
                <Form.Label>Tipo Prima A:</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.seccionD.typePrimaA}
                  onChange={e => handleChange('seccionD', 'typePrimaA', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="amountPrimaA">
                <Form.Label>Monto Prima A:</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.seccionD.amountPrimaA}
                  onChange={e => handleChange('seccionD', 'amountPrimaA', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group controlId="typePrimaB">
                <Form.Label>Tipo Prima B:</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.seccionD.typePrimaB}
                  onChange={e => handleChange('seccionD', 'typePrimaB', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="amountPrimaB">
                <Form.Label>Monto Prima B:</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.seccionD.amountPrimaB}
                  onChange={e => handleChange('seccionD', 'amountPrimaB', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group controlId="primaRangoV">
                <Form.Label>Prima Rango V:</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.seccionD.primaRangoV}
                  onChange={e => handleChange('seccionD', 'primaRangoV', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="otherCompensation">
                <Form.Label>Otras Compensaciones:</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.seccionD.otherCompensation}
                  onChange={e => handleChange('seccionD', 'otherCompensation', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Sección E */}
          <Row className="my-3">
            <Col>
              <h2>Sección E</h2>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group controlId="budgetCode">
                <Form.Label>Código de Presupuesto:</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.seccionE.budgetCode}
                  onChange={e => handleChange('seccionE', 'budgetCode', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="accountingCode">
                <Form.Label>Código Contable:</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.seccionE.accountingCode}
                  onChange={e => handleChange('seccionE', 'accountingCode', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group controlId="executingUnit_E">
                <Form.Label>Unidad Ejecutora:</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.seccionE.executingUnit_E}
                  onChange={e => handleChange('seccionE', 'executingUnit_E', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="personnelType_E">
                <Form.Label>Tipo de Personal:</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.seccionE.personnelType_E}
                  onChange={e => handleChange('seccionE', 'personnelType_E', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Sección de Observaciones */}
          <Row className="my-3">
            <Col>
              <h2>Observaciones</h2>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="observations">
                <Form.Label>Observaciones:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.seccionObservations.observations}
                  onChange={e => handleChange('seccionObservations', 'observations', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Botón para enviar */}
          <div className='d-flex my-4 justify-content-center'>

            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Enviar a Presupuesto'}
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};
