import mongoose from "mongoose";

const createBackup = async (req, res, next) => {
    if (req.method !== 'findOneAndUpdate') {
        return next();
    }

    const Sheet = mongoose.model('Sheet');
    const sheetID = req.params.id;

    try {
        const currentSheet = await Sheet.findById(sheetID);
        if(!currentSheet) {
            return next(new Error('No existe la planilla'));
        }

        const backupData = {
            user: currentSheet.user,
            names: currentSheet.names,
            surnames: currentSheet.surnames,
            email: currentSheet.email,
            ci: currentSheet.ci,
            idac: currentSheet.idac,
            school: currentSheet.school,
            department: currentSheet.department,
            professorship: currentSheet.professorship,
            current_dedication: currentSheet.current_dedication,
            executing_unit: currentSheet.executing_unit,
            hire_date: currentSheet.hire_date,
            sheet: currentSheet._id,
            sheet_number: currentSheet.sheet_number,
            movement_type: currentSheet.movement_type,
            proposed_dedication: currentSheet.proposed_dedication,
            period: currentSheet.period,
            category: currentSheet.category,
            arguments: currentSheet.arguments,
            income: currentSheet.income,
            income_type: currentSheet.income_type,
            income_date: currentSheet.income_date,
            attachments: currentSheet.attachments,
            program_code: currentSheet.program_code,
            accounting_code: currentSheet.accounting_code,
            effective_date: currentSheet.effective_date,
            created_by: currentSheet.created_by,
            created_at: currentSheet.created_at
        };

        const backup = new Sheet({ backups: [{ data: backupData }] });
        await backup.save();

        console.log('Respaldo creado con éxito');
        next();

    } catch (error) {
        console.error('Error al crear el respaldo:', error);
        next(error);
    }
};

export default createBackup;