import React, { useEffect } from 'react';
import { Spinner, Table, Button, Badge } from 'react-bootstrap';
import { useSheetsListUpdate } from '../../hooks/useSheetsListUpdate';

export const SheetsToBeApproved = () => {
    const { sheets, fetchSheets, updateSheet, loading, error } = useSheetsListUpdate();

    useEffect(() => {
        fetchSheets('pending'); // Estado de las planillas por aprobar
    }, []);

    return (
        <div className="container mt-4">
            <h1>Planillas por Aprobar</h1>
            <div className='text-center'>
                {loading && <Spinner animation="border" />}
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Número de Planilla</th>
                        <th>Tipo de Movimiento</th>
                        <th>Área</th>
                        <th>Estatus</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {sheets.map(sheet => (
                        <tr key={sheet._id}>
                            <td>{sheet.sheetNumber}</td>
                            <td>{sheet.movementType}</td>
                            <td>{sheet.area}</td>
                            <td>
                                <Badge variant={sheet.status === 'approved' ? 'success' : 'warning'}>
                                    {sheet.status}
                                </Badge>
                            </td>
                            <td>
                                <Button variant="primary" onClick={() => updateSheet(sheet._id, { status: 'approved' })}>
                                    Aprobar
                                </Button>
                                <Button variant="danger" onClick={() => updateSheet(sheet._id, { status: 'rejected' })}>
                                    Rechazar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};
