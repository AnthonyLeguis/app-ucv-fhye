import { useState, useEffect } from 'react';
import { useEmployeeRegister } from '../hooks/useEmployeeRegister';
import { Country, State } from 'country-state-city';
import { Button, Form, Row, Col } from 'react-bootstrap';
import {
    VenezuelanBanks,
    documentType,
    studiesGrade,
    maritalStatus,
    gender,
    areaFiltered
} from '../helpers/listFormEmployee';
import '../CSS/employeeRegister.css';

export const EmployeesPerArea = () => {
    const {
        formData,
        handleChange,
        handleSubmit,
        isLoading,
        searchText,
        filteredOptions,
        setSearchText
    } = useEmployeeRegister();

    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');


    useEffect(() => {
        setCountries(Country.getAllCountries());
    }, []);

    const handleCountryChange = (event) => {
        const countryCode = event.target.value;
        setSelectedCountry(countryCode);

        setCities(State.getStatesOfCountry(countryCode));
    };

    return (
        <>
            <div className='container-fluid contain overflow-auto'>
                <div className='row h-100 sm-flex-column'>
                    <div className="col mt-4 mb-2 rounded-1 col-md-8 mx-auto d-flex flex-row justify-content-center justify-content-md-right">
                        <h1 className='TitleName text-center text-center m-0'>Registrar nuevo personal</h1>
                    </div>
                    <div className="row sm-flex-column pb-4">

                        {/* Formulario */}
                        <Form onSubmit={handleSubmit} className="col-11 col-md-8 mx-auto p-2 shadow rounded-4 h-100">
                            <Row>
                                {/* Filtro para area */}
                                <Col md={4} className='my-2 text-start h6'>
                                    <Form.Group controlId="areaSearchInput">
                                        <Form.Label>Filtrar por Área:</Form.Label>
                                        <Form.Select
                                            name='areaSearchInput'
                                            value={searchText}
                                            onChange={(e) => setSearchText(e.target.value)}
                                        >
                                            <option value="">Seleccionar...</option>
                                            {areaFiltered.map((item, index) => (
                                                <option key={index} value={item}> {/* <-- Usar item directamente */}
                                                    {item}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                {/* Area */}
                                <Col md={8} className='my-2 align-content-end h6'>
                                    <Form.Group controlId="areaSearchSelect">
                                        <Form.Select
                                            name="area"
                                            value={formData.area}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Seleccionar...</option>
                                            {filteredOptions.map((item, index) => (
                                                <option key={index} value={`${item.Código} - ${item.Area}`}>
                                                    {item.Area}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                {/* Nombres */}
                                <Col md={6} className="my-2 h6">
                                    <Form.Group controlId="names">
                                        <Form.Label>Nombres:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="names"
                                            value={formData.names}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                                {/* Apellidos */}
                                <Col md={6} className="my-2 h6">
                                    <Form.Group controlId="surnames">
                                        <Form.Label>Apellidos:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="surnames"
                                            value={formData.surnames}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                                {/* Tipo de documento */}
                                <Col md={6} className="my-2 h6">
                                    <Form.Group controlId="idType">
                                        <Form.Label>Tipo de documento:</Form.Label>
                                        <Form.Select
                                            name="idType"
                                            value={formData.idType}
                                            onChange={handleChange}
                                            required

                                        >
                                            {documentType.map((tipo) => (
                                                <option key={tipo.value} value={tipo.value}>
                                                    {tipo.label}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                {/* Cédula */}
                                <Col md={6} className="my-2 h6">
                                    <Form.Group controlId="nationalId">
                                        <Form.Label>Cédula:</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="nationalId"
                                            value={formData.nationalId}
                                            onChange={handleChange}
                                            required
                                            maxLength={8}
                                        />
                                    </Form.Group>
                                </Col>

                                {/* RIF */}
                                <Col md={6} className="my-2 h6">
                                    <Form.Group controlId="rif">
                                        <Form.Label>RIF:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="rif"
                                            value={formData.rif}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                                {/* Fecha de nacimiento */}
                                <Col md={6} className="my-2 h6">
                                    <Form.Group controlId="birthdate">
                                        <Form.Label>Fecha de nacimiento:</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="birthdate"
                                            value={formData.birthdate}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                                {/* País de nacimiento */}
                                <Col md={6} className="my-2 h6">
                                    <Form.Group controlId="countryOfBirth">
                                        <Form.Label>País de nacimiento:</Form.Label>
                                        <Form.Select value={selectedCountry} onChange={handleCountryChange}>
                                            <option value="">Seleccionar país...</option>
                                            {countries.map((country, index) => (
                                                <option key={index} value={country.isoCode}> {/* Usar isoCode para el valor */}
                                                    {country.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                {/* Ciudad de nacimiento */}
                                <Col md={6} className="my-2 h6">
                                    <Form.Group controlId="cityOfBirth">
                                        <Form.Label>Ciudad de nacimiento:</Form.Label>
                                        <Form.Select name="cityOfBirth" value={formData.cityOfBirth} onChange={handleChange}>
                                            <option value="">Seleccionar ciudad...</option>
                                            {cities.map((city, index) => (
                                                <option key={index} value={city.name}>
                                                    {city.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                {/* Estado civil */}
                                <Col md={6} className="my-2 h6">
                                    <Form.Group controlId="maritalStatus">
                                        <Form.Label>Estado civil:</Form.Label>
                                        <Form.Select
                                            name="maritalStatus"
                                            value={formData.maritalStatus}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Seleccionar...</option>
                                            {maritalStatus.map((estado, index) => (
                                                <option key={index} value={estado}>
                                                    {estado}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                {/* Género */}
                                <Col md={6} className="my-2 h6">
                                    <Form.Group controlId="gender">
                                        <Form.Label>Género:</Form.Label>
                                        <Form.Select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Seleccionar...</option>
                                            {gender.map((genero) => (
                                                <option key={genero.value} value={genero.value}>
                                                    {genero.label}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                {/* Familiares a cargo */}
                                <Col md={6} className="my-2 h6">
                                    <Form.Group controlId="familyDependents">
                                        <Form.Label>Familiares a cargo:</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="familyDependents"
                                            value={formData.familyDependents}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                                {/* Nivel educativo */}
                                <Col md={6} className="my-2 h6">
                                    <Form.Group controlId="educationLevel">
                                        <Form.Label>Nivel de educación:</Form.Label>
                                        <Form.Select
                                            name="educationLevel"
                                            value={formData.educationLevel}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Seleccionar...</option>
                                            {studiesGrade.map((nivel, index) => (
                                                <option key={index} value={nivel}>
                                                    {nivel}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                {/* Correo */}
                                <Col md={6} className="my-2 h6">
                                    <Form.Group controlId="email">
                                        <Form.Label>Correo electrónico:</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            autoComplete='off'
                                            value={formData.email}

                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                                {/* Número de teléfono */}
                                <Col md={6} className="my-2 h6">
                                    <Form.Group controlId="phoneNumber">

                                        <Form.Label>Número de teléfono:</Form.Label>
                                        <Form.Control
                                            type="tel"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                                {/* Dirección */}
                                <Col md={12} className="my-2 h6">
                                    <Form.Group controlId="address">
                                        <Form.Label>Dirección:</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            name="address"
                                            autoComplete='off'
                                            value={formData.address}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                                {/* Banco */}
                                <Col md={4} className="my-2 h6">
                                    <Form.Group controlId="bank">
                                        <Form.Label>Banco:</Form.Label>
                                        <Form.Select
                                            name="bank"
                                            value={formData.bank}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Seleccionar banco...</option>
                                            {VenezuelanBanks.map((banco, index) => (
                                                <option key={index} value={banco}>
                                                    {banco}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                {/* Cuenta nómina */}
                                <Col md={8} className="my-2 h6">
                                    <Form.Group controlId="payrollAccount">
                                        <Form.Label>Cuenta nómina:</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="payrollAccount"
                                            value={formData.payrollAccount}
                                            onChange={handleChange}
                                            required
                                            maxLength={20}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className='d-flex flex-column text-center align-content-center'>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={isLoading}
                                    onClick={handleSubmit}
                                    className='my-3 col-4 items-center'>
                                    {isLoading ? 'Registrando...' : 'Registrar'}
                                </Button>
                            </Row>
                        </Form>
                    </div>
                </div>


            </div>
        </>
    );
};
